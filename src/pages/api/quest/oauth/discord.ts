import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client'
import querystring from 'querystring';
import { Code } from 'grommet-icons';

type Response = {};

async function getDiscordUserInfo(code: string) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  const requestData = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
  };

  const requestBody = querystring.stringify(requestData);

  const responseGetToken = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: requestBody,
  });

  if (!responseGetToken.ok) {
    return {error: true, data: responseGetToken.body}
  }

  const tokenData = await responseGetToken.json();

  const responseGetUserInfo = await fetch('https://discord.com/api/users/@me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!responseGetUserInfo.ok) {
      return {error: true, data: responseGetUserInfo.body}
    }

    const userInfo = await responseGetUserInfo.json();
    return userInfo
}

async function prismaInsertUserDiscordData(prismaDB: PrismaClient, userId: string, discordId: string, discordUserName: string) {
  try {
    const _ = await prismaDB.userDiscordData.create({
      data: {
        userId: userId,
        discordId: discordId,
        discordName: discordUserName,
      }
    })
    return {error: false, status: 201, message: "OK"}
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code == 'P2002'){
        return {error: true, status: 409, message: "This discord account has been bound by another address"}
      }
    }
    return {error: true, status: 503, message: "Internal Server Error"}
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const wallet = req.body.wallet
  const discord_code = req.body.code


  const prismaDB = new PrismaClient()
  await prismaDB.$connect()

  const getUser = await prismaDB.user.findUnique({
    where: {
      wallet: wallet
    }
  })

  if (getUser) {
    const resp = await getDiscordUserInfo(discord_code as string)
    if (resp.error) {
      return res.status(404).json({data: {message: "Not Found"}})
    }

    const result = await prismaInsertUserDiscordData(prismaDB, getUser.id, resp.id, resp.username)
    return res.status(result.status).json({data: {message: result.message}})
  }

  return res.status(404).json({data: {message: "Not Found"}})
}