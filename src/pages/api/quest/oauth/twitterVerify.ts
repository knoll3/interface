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
    });

    const useTwitterData = await prismaDB.userTwitterData.findUnique({
      where: {
        userId: getUser?.id,
      },
    });

    console.log(useTwitterData?.twitterAccessToken);
    const twitterClient = new Client(useTwitterData?.twitterAccessToken!);

    const myUser = await twitterClient.users.findMyUser();
    // const followers = await twitterClient.users.usersIdFollowers(
    //   useTwitterData?.twitterIdstr as string
    // );
    //
    // console.log(followers.data);

    if (myUser) {
      return res.status(200).json({ data: { message: 'OK' } });
    } else {
      return res.status(404).json({ data: { message: 'Not Found' } });
    }
  } catch (error) {
    console.log(error);
  }
}
