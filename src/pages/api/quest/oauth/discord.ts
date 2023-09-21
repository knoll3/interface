import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';
import querystring from 'querystring';

type Response = {};

async function getDiscordUserInfo(code: string, redirectUri: string) {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;

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
    await responseGetToken.text().then((res) => console.log(res));

    return { error: true, status: 401, message: 'Unauthorized' };
  }

  const tokenData = await responseGetToken.json();

  const responseGetUserInfo = await fetch('https://discord.com/api/users/@me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  if (!responseGetUserInfo.ok) {
    return { error: true, status: 401, message: 'Unauthorized' };
  }

  const userInfo = await responseGetUserInfo.json();
  return userInfo;
}

async function createUserTask(prismaDB: PrismaClient, userId: string) {
  try {
    const task = await prismaDB.questTask.findUnique({
      where: {
        taskName: 'discord_connect',
        active: true,
      },
    });
    if (task) {
      const userTask = await prismaDB.userQuestTask.create({
        data: {
          userId: userId,
          taskId: task.id,
        },
      });
      console.log(userTask);
      return { error: false, status: 201, message: 'OK' };
    }
    return { error: true, status: 404, message: 'Not Found' };
  } catch (error) {
    console.log(error);
    return { error: true, status: 503, message: 'Internal Server Error' };
  }
}

async function prismaGetUserDiscordData(
  prismaDB: PrismaClient,
  userId: string
) {
  const userDiscordData = await prismaDB.userDiscordData.findUnique({
    where: {
      userId: userId,
    },
  });
  return userDiscordData;
}

async function prismaInsertUserDiscordData(
  prismaDB: PrismaClient,
  userId: string,
  discordId: string,
  discordUserName: string
) {
  try {
    const userDiscordData = await prismaDB.userDiscordData.create({
      data: {
        userId: userId,
        discordId: discordId,
        discordName: discordUserName,
      },
    });
    return { error: false, status: 201, message: 'OK', data: userDiscordData };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code == 'P2002') {
        return {
          error: true,
          status: 409,
          message: 'This discord account has been bound by another address',
        };
      }
    }
    return { error: true, status: 503, message: 'Internal Server Error' };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { wallet, code: discord_code, redirect_uri } = req.query;

  const prismaDB = new PrismaClient();
  await prismaDB.$connect();

  const getUser = await prismaDB.user.findUnique({
    where: {
      wallet: wallet as string,
    },
  });

  if (getUser) {
    const userDiscordData = await prismaGetUserDiscordData(
      prismaDB,
      getUser.id
    );

    if (userDiscordData) {
      return res.status(201).json({ data: userDiscordData });
    }

    const resp = await getDiscordUserInfo(
      discord_code as string,
      redirect_uri as string
    );
    if (resp.error) {
      return res.status(resp.status).json({ data: { message: resp.message } });
    }

    let result = await prismaInsertUserDiscordData(
      prismaDB,
      getUser.id,
      resp.id,
      resp.username
    );
    if (result.error) {
      return res.status(result.status).json({ data: result.data });
    }

    const userTask = await createUserTask(prismaDB, getUser.id);
    console.log(userTask);
    return res
      .status(userTask.status)
      .json({ data: { message: userTask.message } });
  }

  return res.status(404).json({ data: { message: 'Not Found' } });
}
