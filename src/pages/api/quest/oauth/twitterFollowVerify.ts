import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import Client from 'twitter-api-sdk';
type Response = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
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
        taskName: 'twitter_follow',
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

    const myUser = await twitterClient.users.findMyUser();
    // const followers = await twitterClient.users.usersIdFollowers(
    //   useTwitterData?.twitterIdstr as string
    // );
    //
    // console.log(followers.data);

    const followUser = await twitterClient.users.usersIdFollow(
      //The ID of the user that is requesting to follow the target user
      useTwitterData?.twitterIdstr!,
      {
        //The ID of the user that the source user is requesting to follow
        target_user_id: process.env.FLOCK_TWITTER_ID!,
      }
    );

    if (followUser.data?.following) {
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
  }
}
