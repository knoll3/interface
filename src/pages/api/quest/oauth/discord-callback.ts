import type { NextApiRequest, NextApiResponse } from 'next';

type Response = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
    console.log(req.url)
    res.status(200).json({data: {message: "Not Found"}})
}