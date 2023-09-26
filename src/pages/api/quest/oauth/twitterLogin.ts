import { twitterAuthClient } from '@/src/lib/twitterClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const authUrl = twitterAuthClient.generateAuthURL({
    state: process.env.TWITTER_STATE as string,
    code_challenge: 'flock-test',
    code_challenge_method: 'plain',
  });
  res.redirect(authUrl);
}
