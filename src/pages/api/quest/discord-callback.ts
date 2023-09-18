import type { NextApiRequest, NextApiResponse } from 'next';

type Response = {
  data: {
    message: string
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
    console.log(req.url)
    res.status(200).send({data: {message: "ok"}})
}