import { useContractRead } from 'wagmi';
import { FLOCK_TASK_MANAGER_ABI } from '../contracts/flockTaskManager';
import { Anchor, Avatar, Box, Heading, Layer, Meter, Stack, Text } from 'grommet';
import { useEffect, useState } from 'react';
import { FLOCK_TASK_ABI } from '../contracts/flockTask';
import { readContract } from '@wagmi/core';
import { UserFemale, Favorite, View, Group, Chat, Scorecard, CreditCard, Image } from 'grommet-icons';
import { PrimaryButton } from './PrimaryButton';
import { PrismaClient } from '@prisma/client';

export interface Model {
    name: string;
    description: string;
    type: string;
    creator: string;
    price: number;
    likes: number;
    views: number;
    people: number;
    link: string;
}

const tasks = [
    {
        "name": "FlockLLM finetuned on Dolly dataset",
        "description": "Finetune Vicuna v1.1 pre-trained model on Dolly dataset for 20 communication rounds.",
        "type": "LLM Chatbot",
        "creator": "Creator Name",
        "price": 0,
        "likes": 1,
        "views": 1,
        "people": 1,
        "link": "http://209.20.157.253:7860"
    }
] as Model[];

type CardColors = {
  [key: string]: TaskCardProps;
}

interface TaskCardProps {
  cardColor: string;
  cardIcon: JSX.Element;
}

const cardColors: CardColors = {
  "Large Language Model Finetuning": {
    cardColor: "#A4C0FF", cardIcon: <Chat color="black" size="20px" />
  },
  "NLP": {
    cardColor: "#E69FBD", cardIcon: <Scorecard color="black" size="20px" />
  },
  "Time series prediction": {
    cardColor: "#D9D9D9", cardIcon: <CreditCard color="black" size="20px" />
  },
  "Classification": {
    cardColor: "#BDD4DA", cardIcon: <Image color="black" size="20px" />
  },
}

export const MarketplaceItems = ({
  filterItems,
}: {
  filterItems: string[];
}) => {
  const [models, setModels] = useState<Model[]>([] as Model[]);

  const prisma = new PrismaClient();

  const loadModels = async () => {
    const loadedModels = await prisma.marketplacemodel.findMany();
    setModels(loadedModels);
  };

  useEffect(() => {
    loadModels();
  }, []);

  return (
    <>
      <Box
        direction="row-responsive"
        wrap
        width="100%"
        align="center"
        justify='center'
        gap="small"
      >
        {tasks
          ?.filter((task) => filterItems.length === 0 || filterItems.includes(task.type))
          .map((model: Model, index: number) => {
          return (
            <Box
              background="#FFFFFF"
              key={index}
              align="start"
              justify="center"
              round="small"
              elevation="large"
              pad="medium"
              margin={{ top: 'small' }}
              height={{ min: 'small' }}
              width="440px"
              border={{ color: 'black', size: 'small' }}
            >
                <Heading level="3" margin="none">
                    {model.name}
                </Heading>
                <Text margin={{ bottom: 'medium' }}>{model.description}</Text>
                <Box 
                    direction="row" 
                    width="100%" 
                    justify="between" 
                    align="center" 
                    border={{
                        color: 'black',
                        size: 'small',
                        style: 'solid',
                        side: 'bottom'
                    }}
                    pad={{ bottom: 'xsmall' }}
                    >
                    <Box
                        border={{ color: 'black', size: 'small' }}
                        round="small"
                        pad="xsmall"
                        background={cardColors[model.type]?.cardColor}
                        direction="row"
                        gap="small"
                        align="center"
                    >
                        <Chat color="black" size="20px" /><Text weight="bold" truncate={true}>{model.type}</Text>
                    </Box>
                    <Box direction="row" gap="small">
                        <Box direction="row" gap="1px"><Favorite color="black" /> {model.likes}</Box>
                        <Box direction="row" gap="1px"><View color="black" /> {model.views}</Box>
                        <Box direction="row" gap="1px"><Group color="black" /> {model.people}</Box>
                    </Box>
                </Box>
                <Box direction="row" width="100%" justify="between" margin={{ top: 'small'}}>
                    <Box direction="row" gap="small">
                        <UserFemale color='brand' />
                        <Text>Creator Name</Text>
                    </Box>
                    <Box direction="row" align="center" gap="small">
                        <Text weight="bold">FLC {model.price}</Text>
                        <PrimaryButton label="Use" href={model.link} target="blank" />
                    </Box>
                </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
};
