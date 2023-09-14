import type { NextApiRequest, NextApiResponse } from 'next';

type ModelData = {
  id: string;
  name: string;
  type: string;
  creator: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  shares: number;
  link: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ModelData[]>
) {


  try {
    const { modelId, userToken, wallet, publicKey } = req.body;
    const updateLikes = await fetch(
        "https://us-central1-flock-demo-design.cloudfunctions.net/updateModelLikes",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer " + userToken, 
        },
        body: JSON.stringify({ pubKey: publicKey, modelId: modelId, wallet: wallet }),
      }
    );
    const models = await updateLikes.json();
    res.status(200).json(models);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}