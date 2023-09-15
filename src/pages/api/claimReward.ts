import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const client = new PrismaClient();
import { ethers } from 'ethers';
import { FLOCK_ABI } from '../../contracts/flock';


interface ClaimedReward {
    message: string | unknown,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ClaimedReward>
) {
    const { walletAddress } = req.body;

    const userView = await client.claimedRewards.findFirst({
        where: {
            wallet: walletAddress as string,
        }
    });

    if (userView) {
        res.status(200).json({ message: 'Already claimed' });
        return;
    }

    const maticToClaim = ethers.utils.parseEther('0.01');
    const flcToClaim = ethers.utils.parseEther('100');

    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_WEB3_AUTH_RPC);

    const wallet = new ethers.Wallet(process.env.NEXT_PRIVATE_KEY!, provider);
    
    const flockContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_FLOCK_TOKEN_ADDRESS!,
        FLOCK_ABI,
        wallet
    );

    try {
        const txResponse = await wallet.sendTransaction({
            to: walletAddress,
            value: maticToClaim,
        });    
        await txResponse.wait();
    } catch (error) {
        res.status(200).json({ message: 'Error claiming MATIC' });
        return;
    }

    try {
        const txResponse = await flockContract.mint(walletAddress, flcToClaim);    
        await txResponse.wait();
    } catch (error) {
        res.status(200).json({ message: 'Error claiming FLC' });
        return;
    }

    await client.claimedRewards.create({
        data: {
            wallet: walletAddress as string,
        }
    }).then(() => {
        res.status(200).json({ message: 'Claimed rewards' });
    }).catch((error) => {
        console.log(error);
        res.status(500).json({ message: 'Error posting data to db' });
    });
}