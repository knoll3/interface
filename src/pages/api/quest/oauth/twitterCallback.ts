import type { NextApiRequest, NextApiResponse } from 'next';
import { twitterAuthClient } from '@/src/lib/twitterClient';
type Response = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    const { code, state } = req.query;
    if (state !== process.env.TWITTER_STATE) {
      return res
        .status(401)
        .json({ data: { message: "State isn't matching" } });
    }
    twitterAuthClient.generateAuthURL({
      state: process.env.TWITTER_STATE as string,
      code_challenge: 'flock-test',
      code_challenge_method: 'plain',
    });

    const { token } = await twitterAuthClient.requestAccessToken(
      code as string
    );

    res.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/oauth/twitter?accessToken=${token.access_token}&expiresAt=${token.expires_at}`
    );
  } catch (error) {
    console.log(error);
  }
}
