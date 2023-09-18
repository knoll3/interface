import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const client = new PrismaClient();
import { ethers } from 'ethers';
import { CLAIM_REWARDS_ABI } from '@/src/contracts/claimRewards';


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

    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_WEB3_AUTH_RPC);

    const wallet = new ethers.Wallet(process.env.NEXT_PRIVATE_KEY!, provider);
    
    const claimContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CLAIM_REWARDS_ADDRESS!,
        CLAIM_REWARDS_ABI,
        wallet
    );

    try {
        const txResponse = await claimContract.claim(walletAddress);
        await txResponse.wait();
    } catch (error) {
        res.status(200).json({ message: error });
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