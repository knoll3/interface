import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const client = new PrismaClient();
import { ethers } from 'ethers';
import { CLAIM_REWARDS_ABI } from '@/src/contracts/claimRewards';

interface ClaimedReward {
  message: string | unknown;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ClaimedReward>
) {
  const { walletAddress } = req.body;

  const userView = await client.claimedRewards.findFirst({
    where: {
      wallet: walletAddress as string,
    },
  });

  if (userView) {
    res.status(200).json({ message: 'Already claimed' });
    return;
  }

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_WEB3_AUTH_RPC
  );

  const wallet = new ethers.Wallet(process.env.CLAIM_PRIVATE_KEY!, provider);
  
  const questTaskNames = [
    'discord_connect',
    'twitter_follow',
    'twitter_share',
    'discord_join_get_role',
    'twitter_connect',
  ];

  const questTasks = await client.questTask.findMany({
    where: {
      taskName: { in: questTaskNames },
    },
  });

  const user = await client.user.findUnique({
    where: { wallet: walletAddress as string },
    include: { userQuestTask: true },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  for (const questTaskName of questTaskNames) {
    const questTask = questTasks.find((task) => task.taskName === questTaskName);
    if (!questTask) {
      return res.status(400).json({ message: `Quest task "${questTaskName}" not found` });
    }

    const userQuestTask = user.userQuestTask.find(
      (task) => task.taskId === questTask.id
    );

    if (!userQuestTask) {
      return res.status(400).json({ message: `User has not completed "${questTaskName}" task` });
    }
  }
  
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

  await client.claimedRewards
    .create({
      data: {
        wallet: walletAddress as string,
      },
    })
    .then(() => {
      res.status(200).json({ message: 'Claimed rewards' });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'Error posting data to db' });
    });
}
