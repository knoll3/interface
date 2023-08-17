import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  modelId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { modelId } = req.body;
//   const privateKey = await web3AuthInstance.provider?.request({
//     method: "eth_private_key", 
//   }) as string;

//   const publicKey = getPublicCompressed(Buffer.from(privateKey.padStart(64, "0"), "hex")).toString("hex");
//   const user = await web3AuthInstance.getUserInfo();

  try {
    const updateLikes = await fetch(
        "https://us-central1-flock-demo-design.cloudfunctions.net/updateModelLikes",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer " + user.idToken, 
        },
        body: JSON.stringify({ pubKey: publicKey, modelId: modelId }),
      }
    );
    const { data, errors } = await updateLikes.json();
    if (errors) {
      console.error(errors);
      res.status(500).end();
    }

    res.status(200).json({ modelId: modelId });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}