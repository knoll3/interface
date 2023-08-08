import { useContractRead } from 'wagmi';
import { FLOCK_TASK_MANAGER_ABI } from '../contracts/flockTaskManager';
import { Anchor, Avatar, Box, Heading, Layer, Meter, Stack, Text } from 'grommet';
import { useEffect, useState } from 'react';
import { FLOCK_TASK_ABI } from '../contracts/flockTask';
import { readContract } from '@wagmi/core';
import { UserFemale, Favorite, View, Group, Chat } from 'grommet-icons';
import { PrimaryButton } from './PrimaryButton';

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
        "name": "FlockLLM finetuning on Dolly dataset",
        "description": "Finetune Vicuna v1.1 pre-trained model on Dolly dataset for 20 communication rounds.",
        "type": "LLM Chatbot",
        "creator": "Creator Name",
        "price": 10,
        "likes": 816,
        "views": 4510,
        "people": 99,
        "link": "https://www.google.com"
    },
    {
        "name": "FlockLLM finetuning on Dolly dataset",
        "description": "Finetune Vicuna v1.1 pre-trained model on Dolly dataset for 20 communication rounds.",
        "type": "LLM Chatbot",
        "creator": "Creator Name",
        "price": 10,
        "likes": 816,
        "views": 4510,
        "people": 99,
        "link": "https://www.google.com"
    },
    {
        "name": "FlockLLM finetuning on Dolly dataset",
        "description": "Finetune Vicuna v1.1 pre-trained model on Dolly dataset for 20 communication rounds.",
        "type": "LLM Chatbot",
        "creator": "Creator Name",
        "price": 10,
        "likes": 816,
        "views": 4510,
        "people": 99,
        "link": "https://www.google.com"
    },
    {
        "name": "FlockLLM finetuning on Dolly dataset",
        "description": "Finetune Vicuna v1.1 pre-trained model on Dolly dataset for 20 communication rounds.",
        "type": "LLM Chatbot",
        "creator": "Creator Name",
        "price": 10,
        "likes": 816,
        "views": 4510,
        "people": 99,
        "link": "https://www.google.com"
    },
] as Model[];

export const MarketplaceItems = () => {
  const [models, setModels] = useState<Model[]>([] as Model[]);

//   const { data, isError, isLoading, refetch } = useContractRead({
//     address: process.env
//       .NEXT_PUBLIC_FLOCK_TASK_MANAGER_ADDRESS as `0x${string}`,
//     abi: FLOCK_TASK_MANAGER_ABI,
//     functionName: 'getTasks',
//     watch: true,
//   });

//   const loadTasks = async () => {
//     if (data) {
//       const loadedTasks: Task[] = await Promise?.all(
//         (data as Array<string>)?.map(async (item) => {
//           const metadata = (await readContract({
//             address: item as `0x${string}`,
//             abi: FLOCK_TASK_ABI,
//             functionName: 'metadata',
//           })) as string;

//           const currentRound = (await readContract({
//             address: item as `0x${string}`,
//             abi: FLOCK_TASK_ABI,
//             functionName: 'currentRound',
//           })) as number;

//           const numberOfParticipants = (await readContract({
//             address: item as `0x${string}`,
//             abi: FLOCK_TASK_ABI,
//             functionName: 'getNumberOfParticipants',
//           })) as number;

//           return {
//             address: item,
//             ...JSON.parse(metadata),
//             numberOfParticipants,
//           } as Task;
//         })
//       );

//       setTasks(loadedTasks);
//     }
//   };

//   useEffect(() => {
//     loadTasks();
//   }, [data]);

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
        {tasks?.map((model: Model, index: number) => {
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
                <Text>{model.description}</Text>
                <Text margin={{ top: 'medium' }}>Updated</Text>
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
                        background="#E69FBD"
                        direction="row"
                        gap="small"
                        align="center"
                    >
                        <Chat color="black" size="20px" />{model.type}
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
                        <PrimaryButton label="Use" />
                    </Box>
                </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
};
