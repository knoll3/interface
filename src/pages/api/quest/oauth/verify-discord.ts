import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, PrismaClient } from '@prisma/client';
import querystring from 'querystring';

type Response = {};

async function hasUserGuildAndRole(
  code: string,
  userDiscordId: string | undefined,
  redirectUri: string
) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const guildId = process.env.DISCORD_GUILD_ID;

  const requestData = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
  };

  const requestBody = querystring.stringify(requestData);

  const memberResponse = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}/members/${userDiscordId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    }
  );

  if (!memberResponse.ok) {
    console.error('Error:', memberResponse.statusText);
    return false;
  }

  const member = await memberResponse.json();

  // Step 4: Check for the role
  const roles = process.env.DISCORD_ROLES?.split(', ');
  const hasRole = (roles as string[]).some((role) =>
    member.roles.includes(role)
  );

  if (hasRole) {
    return true;
  }
  return false;
}

async function findTask(prismaDB: PrismaClient, taskName: string) {
  try {
    const task = await prismaDB.questTask.findUnique({
      where: {
        taskName: taskName,
        active: true,
      },
    });
    return task;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const prismaDB = new PrismaClient();
  await prismaDB.$connect();

  const { wallet, redirect_uri } = req.query;
  try {
    // check if user already has completed the task
    const getUser = await prismaDB.user.findUnique({
      where: {
        wallet: wallet as string,
      },
    });
    if (!getUser) {
      return res.status(404).json({ data: { message: 'Not Found' } });
    }

    const getQuestTask = await prismaDB.questTask.findUnique({
      where: {
        taskName: 'discord_join_get_role',
      },
    });
    if (!getQuestTask) {
      return res.status(404).json({ data: { message: 'Not Found' } });
    }

    const userHasTask = await prismaDB.userQuestTask.findUnique({
      where: {
        userId: getUser.id,
        taskId: getQuestTask.id,
      },
    });
    if (userHasTask) {
      return res.status(200).json({ data: { message: 'OK' } });
    }

    // if not completed, create a new one
    const userDiscord = await prismaDB.userDiscordData.findUnique({
      where: {
        userId: getUser.id,
      },
    });
    const userGuildsResult = await hasUserGuildAndRole(
      req.body.code,
      userDiscord?.discordId,
      redirect_uri as string
    );
    if (userGuildsResult) {
      const createTask = await prismaDB.userQuestTask.create({
        data: {
          userId: getUser.id,
          taskId: getQuestTask.id,
        },
      });
      if (createTask) {
        return res.status(200).json({ data: { message: 'OK' } });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(503).json({ data: { message: 'Internal Server Error' } });
  }

  return res.status(503).json({ data: { message: 'Internal Server Error' } });
}
