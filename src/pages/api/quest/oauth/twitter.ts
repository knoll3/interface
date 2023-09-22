import type { NextApiRequest, NextApiResponse } from 'next';
import { twitterAuthClient, twitterClient } from '@/src/lib/twitterClient';
import { Prisma, PrismaClient } from '@prisma/client';
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
          message: 'This discord account has been bound by another address',
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
    });

    const getCurrentUser = await twitterClient.users.findMyUser();

    await prismaInsertUserTwitterData(
      prismaDB,
      getUser?.id as string,
      getCurrentUser.data?.id as string,
      getCurrentUser.data?.name as string,
      accessToken
    );

    return res.status(201).json({ data: getCurrentUser.data });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ data: { message: 'Internal Server Error' } });
  }
}
