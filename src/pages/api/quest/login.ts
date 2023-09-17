import type { NextApiRequest, NextApiResponse } from 'next';
import * as jose from "jose"
import { web3AuthInstance } from '@/src/hooks';
import { PrismaClient, User } from '@prisma/client'

type Response = {
  data: {
    user: any | null
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {

  const prismaDB = new PrismaClient()
  await prismaDB.$connect()

  const getUser = await prismaDB.user.findUnique({
    where: {
      wallet: req.body.public_address,
    },
    select: {
      wallet: true,
      email: true,
      userQuest: {
        select: {
          discordName: true,
          discordVerified: true,

          twitterIdstr: true,
          twitterName : true,
          twitterFollowingVerification: true,
          twitterPostVerification : true
        }
      }
    },
  })

  if (!getUser){
    const createUser = await prismaDB.user.create({
      data: {
        wallet: req.body.public_address,
        email: "",
        userQuest: {
          create: {
            discordId:"",
            discordName: "",
            discordVerified: false,
            discordRole: "",
            twitterIdstr : "",
            twitterName : "",
            twitterFollowingVerification: false,
            twitterPostVerification : false
          }
        }
      },
      select: {
        wallet: true,
        email: true,
        userQuest: {
          select: {
            discordName: true,
            discordVerified: true,
  
            twitterIdstr: true,
            twitterName : true,
            twitterFollowingVerification: true,
            twitterPostVerification : true
          }
        }
      },
    })
    res.status(200).json({data: {user: createUser}})
  } else {
    res.status(200).json({data: {user: getUser}})
  }
}