import type { NextApiRequest, NextApiResponse } from 'next';
import { web3AuthInstance } from '@/src/hooks/web3AuthInstance';
import { getPublicCompressed } from "@toruslabs/eccrypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {

  try {
    const { userEmail } = req.body;
    
    const modelLikes = await fetch(
        "https://us-central1-flock-demo-design.cloudfunctions.net/getUserLikes",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: userEmail }),
      }
    );
    const data  = await modelLikes.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}