import type { NextApiRequest, NextApiResponse } from 'next';
import Pinata from '@pinata/sdk';

const pinata = new Pinata(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_API_KEY
);

type Data = {
  hash: string;
};

export default async function pinJsonToIPFSHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const json = req.body;
  console.log(json);
  const pinResponse = await pinata.pinJSONToIPFS(json);
  res.status(200).json({ hash: pinResponse.IpfsHash });
}
