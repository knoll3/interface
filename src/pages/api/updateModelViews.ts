import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  modelId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {


  try {
    const { modelId, userToken, userEmail, publicKey } = req.body;
    const updateLikes = await fetch(
        "https://us-central1-flock-demo-design.cloudfunctions.net/updateModelViews",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer " + userToken, 
        },
        body: JSON.stringify({ pubKey: publicKey, modelId: modelId, userEmail: userEmail }),
      }
    );
    await updateLikes.json();
    res.status(200).json({ modelId: modelId });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}