import type { NextApiRequest, NextApiResponse } from 'next';
import { type } from 'os';

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
    const marketplaceModels = await fetch(
        "https://us-central1-flock-demo-design.cloudfunctions.net/getModelData",
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const { data } = await marketplaceModels.json();
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}