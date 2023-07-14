import type { NextApiRequest, NextApiResponse } from 'next';
import cacheData from 'memory-cache';

type Data = {
  holders: string[];
};

export default async function holdersHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { tokenAddress } = req.query;
  const value = cacheData.get(tokenAddress);

  if (value) {
    res.status(200).json({ holders: value });
  } else {
    const tokenHoldersRequest = await fetch(
      `https://api.covalenthq.com/v1/matic-mumbai/tokens/${tokenAddress}/token_holders_v2/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.COVALENT_API_KEY}`,
        },
      }
    );

    const {
      data: { items },
    } = await tokenHoldersRequest.json();

    const minutes = 15;
    cacheData.put(tokenAddress, items, minutes * 1000 * 60);

    res.status(200).json({ holders: items });
  }
}
