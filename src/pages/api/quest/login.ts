import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

type Response = {
  data: {
    message: string;
    user: any;
  };
};

const getUser = async (prismaDB: PrismaClient, wallet: string) => {
  return await prismaDB.user.findUnique({
    where: {
      wallet,
    },
    select: {
      wallet: true,
      id: true,
      userDiscordData: {
        select: {
          discordName: true,
          discordExpiresAt: true,
        },
      },
      userTwitterData: {
        select: {
          twitterName: true,
          twitterExpiresAt: true,
        },
      },
      userQuestTask: {
        select: {
          questTask: {
            select: {
              taskName: true,
            },
          },
        },
      },
    },
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const prismaDB = new PrismaClient();
  await prismaDB.$connect();

  try {
    let user = await getUser(prismaDB, req.body.wallet);
    console.log(user);
    if (user) {
      const now = new Date();
      const discordExpiresAt = new Date(
        Number(user.userDiscordData?.discordExpiresAt!)
      ); // milliseconds
      const twitterExpiresAt = new Date(
        Number(user.userTwitterData?.twitterExpiresAt!)
      );

      if (
        user.userTwitterData?.twitterExpiresAt === '' ||
        user.userDiscordData?.discordExpiresAt === '' ||
        twitterExpiresAt.getTime() < Date.now() ||
        discordExpiresAt.getTime() < Date.now()
      ) {
        await prismaDB.userQuestTask.deleteMany({
          where: {
            userId: user.id,
          },
        });
        user = await getUser(prismaDB, req.body.wallet);
      }

      return res.status(200).json({ data: { message: 'OK', user } });
    }

    const createUser = await prismaDB.user.create({
      data: {
        wallet: req.body.wallet,
      },
      select: {
        wallet: true,
      },
    });
    console.log(createUser);
    return res.status(200).json({ data: { message: 'OK', user: createUser } });
  } catch (error) {
    console.log(error);
    return res
      .status(503)
      .json({ data: { message: 'Internal Server Error', user: null } });
  }
}
