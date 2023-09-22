import type { NextApiRequest, NextApiResponse } from 'next';
import { twitterAuthClient, twitterClient } from '@/src/lib/twitterClient';
import { Prisma, PrismaClient, UserQuestTask } from '@prisma/client';
import Client from 'twitter-api-sdk';
type Response = {};

async function prismaInsertUserTwitterData(
  prismaDB: PrismaClient,
  userId: string,
  twitterIdstr: string,
  twitterName: string,
  twitterAccessToken: string
) {
  try {
    const userTwitterData = await prismaDB.userTwitterData.create({
      data: {
        userId,
        twitterIdstr,
        twitterName,
        twitterAccessToken,
      },
    });
    return { error: false, status: 201, message: 'OK', data: userTwitterData };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code == 'P2002') {
        return {
          error: true,
          status: 409,
          message: 'This Twitter account has been bound by another address',
        };
      }
    }
    return { error: true, status: 503, message: 'Internal Server Error' };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const prismaDB = new PrismaClient();
  await prismaDB.$connect();

  try {
    const { wallet, accessToken } = req.body;
    const twitterClient = new Client(accessToken);

    const getUser = await prismaDB.user.findUnique({
      where: {
        wallet: wallet as string,
      },
      include: {
        userTwitterData: true,
        userQuestTask: true,
      },
    });

    if (!getUser) {
      return res.status(404).json({ data: { message: 'Not Found' } });
    }

    const userTwitterData = getUser.userTwitterData;
    const getCurrentUserData = await twitterClient.users.findMyUser();
    if (userTwitterData) {
      const updateTwitter = await prismaDB.userTwitterData.update({
        where: {
          userId: getUser.id,
        },
        data: {
          twitterAccessToken: accessToken,
        },
        select: {
          twitterName: true,
        },
      });
    } else {
      const createUserTwitter = await prismaInsertUserTwitterData(
        prismaDB,
        getUser?.id as string,
        getCurrentUserData.data?.id as string,
        getCurrentUserData.data?.name as string,
        accessToken
      );
    }

    const getQuestTask = await prismaDB.questTask.findUnique({
      where: {
        taskName: 'twitter_connect',
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
    if (userHasTask)
      return res
        .status(200)
        .json({ data: { twitterName: getCurrentUserData.data?.name } });
    else {
      const userQuestTask = await prismaDB.userQuestTask.create({
        data: {
          userId: getUser.id,
          taskId: getQuestTask.id,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(503).json({ data: { message: 'Internal Server Error' } });
  }
}
