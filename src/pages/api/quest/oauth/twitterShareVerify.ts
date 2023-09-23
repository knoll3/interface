import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import Client from 'twitter-api-sdk';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prismaDB = new PrismaClient();
  await prismaDB.$connect();

  try {
    const { wallet } = req.body;

    const getUser = await prismaDB.user.findUnique({
      where: {
        wallet: wallet as string,
      },
      include: {
        userQuestTask: true,
        userTwitterData: true,
      },
    });
    if (!getUser) {
      return res.status(404).json({ data: { message: 'Not Found' } });
    }

    const useTwitterData = getUser.userTwitterData;
    const getQuestTask = await prismaDB.questTask.findUnique({
      where: {
        taskName: 'twitter_share',
      },
    });

    if (!getQuestTask) {
      return res
        .status(503)
        .json({ data: { message: 'Internal Server Error' } });
    }

    const userHasTask = getUser.userQuestTask.filter(
      (usertask) => usertask.taskId == getQuestTask.id
    );

    if (userHasTask.length) {
      return res.status(200).json({ data: 'OK' });
    }

    const twitterClient = new Client(useTwitterData?.twitterAccessToken!);
    const usersTweets = await twitterClient.tweets.usersIdTweets(
      useTwitterData?.twitterIdstr!
    );

    const tweeted = usersTweets.data?.find((tweet) =>
      tweet.text.includes('FLockQuest')
    );

    if (tweeted?.id) {
      const userQuestTask = await prismaDB.userQuestTask.create({
        data: {
          userId: getUser.id,
          taskId: getQuestTask.id,
        },
      });
      return res.status(200).json({ data: { message: 'OK' } });
    } else {
      return res.status(404).json({ data: { message: 'Not Found' } });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: { message: 'Internal Server Error' } });
  }
}
