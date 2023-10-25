import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const client = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean>
) {
    try {
        const { wallet } = req.query;

        const userView = await client.claimedRewards.findFirst({
            where: {
                wallet: wallet as string,
            }
        });

        if (userView) {
            res.status(200).json(true);
        } else {
            res.status(200).json(false);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(false);
    }
}