import Client, { auth } from 'twitter-api-sdk';

export const twitterAuthClient = new auth.OAuth2User({
  client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID as string,
  client_secret: process.env.TWITTER_CLIENT_SECRET as string,
  callback: `${process.env.NEXT_PUBLIC_SITE_URL}/api/quest/oauth/twitterCallback`,
  scopes: ['tweet.read', 'users.read', 'follows.write'],
});

export const twitterClient = new Client(twitterAuthClient);
