import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

type Response = {};

async function hasUserGuildAndRole(userDiscordAccessToken: string | undefined) {
  const guildId = process.env.DISCORD_GUILD_ID;

  const memberResponse = await fetch(
    `https://discord.com/api/v10/users/@me/guilds/${guildId}/member`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userDiscordAccessToken}`,
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const prismaDB = new PrismaClient();
  await prismaDB.$connect();

  const { wallet } = req.body;
  try {
    // check if user already has completed the task
    const getUser = await prismaDB.user.findUnique({
      where: {
        wallet: wallet as string,
      },
      include: {
        userQuestTask: true,
        userDiscordData: true,
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

    const userHasTask = getUser.userQuestTask.filter(
      (usertask) => usertask.taskId == getQuestTask.id
    );
    if (userHasTask.length) {
      return res.status(200).json({ data: { message: 'OK' } });
    }

    // if not completed, create a new one
    const userDiscord = getUser.userDiscordData;
    const userGuildsResult = await hasUserGuildAndRole(
      userDiscord?.discordAccessToken
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
