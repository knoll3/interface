import type { NextApiRequest, NextApiResponse } from 'next';
import cacheData from 'memory-cache';
import { ethers } from 'ethers';
import { FLOCK_TASK_MANAGER_ABI } from '@/src/contracts/flockTaskManager';

type Data = {
  holders: string[];
};

const flockTaskManagerContracts = [
  '0xf805f2faa2c040e51153518d4c3bdca52a2dbab1',
  '0x6c4345851357552eb63211f733b8127fced75e15',
  '0x2e839f8042f0c74a4a61056d83ad0cce8a0d4e67',
  '0x5c72d099408336b4250b23c30b8606202caf0da6',
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const provider = new ethers.providers.JsonRpcProvider(
  `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`
);

const getContractInteractionAddresses = async () => {
  const addresses: any[] = [];
  for (let i = 0; i < flockTaskManagerContracts.length; i++) {
    const contract = new ethers.Contract(
      flockTaskManagerContracts[i],
      FLOCK_TASK_MANAGER_ABI,
      provider
    );

    const tasks = await contract.getTasks();
    for (let i = 0; i < tasks.length; i++) {
      const contractInteractionsRequest = await fetch(
        `https://api-testnet.polygonscan.com/api?module=account&action=txlist&address=${tasks[i]}&startblock=0&endblock=99999999&apikey=${process.env.POLYGONSCAN_API_KEY}`
      );
      const response = await contractInteractionsRequest.json();
      console.log(response);
      addresses.push(response.result?.map((item: any) => item.from));
      await sleep(1000);
    }
  }

  return addresses.flat();
};

export default async function holdersHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { tokenAddress } = req.query;
  const value = cacheData.get(tokenAddress);

  if (value) {
    res.status(200).json({ holders: value });
  } else {
    const tokenHoldersRequest = await fetch(
      `https://api.covalenthq.com/v1/matic-mumbai/tokens/${tokenAddress}/token_holders_v2/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.COVALENT_API_KEY}`,
        },
      }
    );

    const {
      data: { items },
    } = await tokenHoldersRequest.json();

    const contractInteractionAddresses =
      await getContractInteractionAddresses();
    console.log(contractInteractionAddresses);
    items.forEach((item: any) => {
      const interactions = contractInteractionAddresses.filter(
        (address) => address.toLowerCase() === item.address.toLowerCase()
      );
      item.interactions = interactions.length;
    });

    const minutes = 1;
    cacheData.put(tokenAddress, items, minutes * 1000 * 1);

    res.status(200).json({ holders: items });
  }
}
