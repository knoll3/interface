import { useContractRead } from 'wagmi';
import { FLOCK_TASK_MANAGER_ABI } from '../contracts/flockTaskManager';
import { Avatar, Box, Heading, Stack, Text } from 'grommet';
import { useEffect, useState } from 'react';
import { FLOCK_TASK_ABI } from '../contracts/flockTask';
import { readContract } from '@wagmi/core';
import { UserFemale } from 'grommet-icons';
import { PrimaryButton } from './PrimaryButton';

export interface Task {
  address: string;
  name: string;
  description: string;
}

export const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([] as Task[]);

  const { data, isError, isLoading, refetch } = useContractRead({
    address: process.env
      .NEXT_PUBLIC_FLOCK_TASK_MANAGER_ADDRESS as `0x${string}`,
    abi: FLOCK_TASK_MANAGER_ABI,
    functionName: 'getTasks',
    watch: true,
  });

  const loadTasks = async () => {
    console.log('loadTasks');
    const loadedTasks: Task[] = await Promise.all(
      (data as Array<string>)?.map(async (item) => {
        const name = await readContract({
          address: item as `0x${string}`,
          abi: FLOCK_TASK_ABI,
          functionName: 'taskName',
        });

        const description = await readContract({
          address: item as `0x${string}`,
          abi: FLOCK_TASK_ABI,
          functionName: 'taskDescription',
        });

        return { address: item, name, description } as Task;
      })
    );

    setTasks(loadedTasks);
  };

  useEffect(() => {
    loadTasks();
  }, [data]);

  return (
    <Box
      gap="medium"
      direction="row-responsive"
      wrap
      width="100%"
      align="center"
      justify="center"
    >
      {tasks?.map((task: Task, index: number) => {
        return (
          <Box
            background="#FFFFFF"
            key={index}
            width="medium"
            align="center"
            justify="center"
            round="small"
            elevation="large"
            pad="medium"
            margin={{ top: 'medium' }}
          >
            <Box align="center" justify="center">
              <Heading level="3" margin="0">
                {task.name}
              </Heading>
              <Text size="small">{task.description}</Text>
            </Box>
            <Box
              direction="row"
              align="center"
              justify="center"
              pad={{ vertical: 'large' }}
              width="100%"
              gap="medium"
            >
              <Box align="center" justify="center">
                <Heading level="2" color="#6C94EC" margin="0">
                  10
                </Heading>
                <Text size="small">Participants Requirements</Text>
              </Box>
              <Box align="center" justify="center">
                <Heading level="2" margin="0">
                  20%
                </Heading>
                <Text size="small">Rewards Return Rate</Text>
              </Box>
            </Box>
            <Box border={{ side: 'top' }} width="90%"></Box>
            <Box
              direction="row"
              align="center"
              justify="between"
              width="100%"
              pad="medium"
            >
              <Box
                direction="row"
                gap="xxsmall"
                align="center"
                justify="center"
              >
                <Text size="small">Short of</Text>{' '}
                <Text size="medium" color="#6C94EC">
                  1
                </Text>{' '}
                <Text size="small">to start</Text>
              </Box>
              <Box direction="row">
                <Stack anchor="right">
                  <Box direction="row">
                    <Avatar background="brand" size="small">
                      <UserFemale size="small" />
                    </Avatar>
                    <Box pad="xsmall" />
                  </Box>

                  <Avatar background="brand" size="small">
                    <UserFemale size="small" />
                  </Avatar>
                </Stack>

                <Text>+2</Text>
              </Box>
            </Box>
            <Box>
              <PrimaryButton
                label="Join"
                margin={{ top: 'medium' }}
                size="medium"
                pad={{ vertical: 'xsmall', horizontal: 'medium' }}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
