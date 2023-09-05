import type { NextApiRequest, NextApiResponse } from 'next';
import Pinata from '@pinata/sdk';
import formidable from 'formidable';
import fs from 'fs';

const pinata = new Pinata(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_API_KEY
);

type Data = {
  hash: string;
};

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

export default async function pinFileToIPFSHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const form = new formidable.IncomingForm();

  const hash: string = await new Promise((resolve) => {
    form.parse(req, async function (err, fields, files) {
      const options = {
        pinataMetadata: {
          // @ts-ignore
          name: files.file.originalFilename,
        },
      };
      // @ts-ignore
      const data = fs.createReadStream(files.file.filepath);
      const pinResponse = await pinata.pinFileToIPFS(data, options);

      resolve(pinResponse.IpfsHash);
    });
  });

  res.status(200).json({ hash });
}
