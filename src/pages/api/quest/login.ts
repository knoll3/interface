import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

type Response = {
  data: {
    message: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const prismaDB = new PrismaClient();
  await prismaDB.$connect();

  try {
    let user = await prismaDB.user.findUnique({
      where: {
        wallet: req.body.wallet,
      },
      select: {
        wallet: true,
        userQuestTask: true,
      },
    });
    console.log(user);

    if (!user) {
      user = await prismaDB.user.create({
        data: {
          wallet: req.body.wallet,
        },
        select: {
          wallet: true,
          userQuestTask: true,
        },
      });
      console.log(user);
    }
    res.status(200).json({ data: { message: 'OK' } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: { message: 'Internal Server Error' } });
  }
}
