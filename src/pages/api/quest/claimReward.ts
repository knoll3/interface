import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const client = new PrismaClient();
import { ethers } from 'ethers';
import { CLAIM_REWARDS_ABI } from '@/src/contracts/claimRewards';

type Response = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { walletAddress } = req.body;

  const getUser = await client.user.findUnique({
    where: {
      wallet: walletAddress as string,
    },
    include: {
      userQuestTask: true,
      userDiscordData: true,
    },
  });
  if (!getUser) {
    return res.status(404).json({ data: { message: 'Not Found' } });
  }

  const getQuestTask = await client.questTask.findUnique({
    where: {
      taskName: 'claim_reward',
    },
  });
  if (!getQuestTask) {
    return res.status(404).json({ data: { message: 'Not Found' } });
  }

  const userHasTask = getUser.userQuestTask.filter(
    (usertask) => usertask.taskId == getQuestTask.id
  );
  if (userHasTask.length) {
    return res.status(200).json({ data: { message: 'OK' } });
  }

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

  for (const questTaskName of questTaskNames) {
    const questTask = questTasks.find(
      (task) => task.taskName === questTaskName
    );
    if (!questTask) {
      return res
        .status(400)
        .json({ message: `Quest task "${questTaskName}" not found` });
    }

    const userQuestTask = getUser.userQuestTask.find(
      (task) => task.taskId === questTask.id
    );

    if (!userQuestTask) {
      return res
        .status(400)
        .json({ message: `User has not completed "${questTaskName}" task` });
    }
  }

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_WEB3_AUTH_RPC
  );

  const wallet = new ethers.Wallet(process.env.CLAIM_PRIVATE_KEY!, provider);

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

  const createTask = await client.userQuestTask.create({
    data: {
      userId: getUser.id,
      taskId: getQuestTask.id,
    },
  });
  if (createTask) {
    return res.status(200).json({ data: { message: 'OK' } });
  }
}
