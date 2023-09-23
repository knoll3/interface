import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

type Response = {
  data: {
    message: string;
    user: any;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const prismaDB = new PrismaClient();
  await prismaDB.$connect();

  try {
    let getUser = await prismaDB.user.findUnique({
      where: {
        wallet: req.body.wallet,
      },
      select: {
        wallet: true,
        userDiscordData: {
          select: {
            discordName: true,
          },
        },
        userTwitterData: {
          select: {
            twitterName: true,
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
    console.log(getUser);
    if (getUser) {
      return res.status(200).json({ data: { message: 'OK', user: getUser } });
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
