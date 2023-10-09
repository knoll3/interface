import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const client = new PrismaClient();

type Response = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { walletAddress } = req.body;

  const getReport = await client.researcherReport.findFirst({
    where: {
      wallet: walletAddress as string,
    }
  });

  if (!getReport) {
    return res.status(404).json({ data: { message: 'Not Found' } });
  }

  return res.status(200).json({ data: getReport });
}
