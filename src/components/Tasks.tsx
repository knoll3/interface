import { useContractRead } from 'wagmi';
import { FLOCK_TASK_MANAGER_ABI } from '../contracts/flockTaskManager';
import { Anchor, Avatar, Box, Heading, Layer, Meter, Stack, Text } from 'grommet';
import { useEffect, useState } from 'react';
import { FLOCK_TASK_ABI } from '../contracts/flockTask';
import { readContract } from '@wagmi/core';
import { Chat, Favorite, Group, UserFemale, View } from 'grommet-icons';
import { PrimaryButton } from './PrimaryButton';

export interface Task {
  address: string;
  name: string;
  description: string;
  input: string;
  output: string;
  modelName: string;
  taskType: string;
  sizeMemory: number;
  outputDescription: string;
  minParticipants: number;
  maxParticipants: number;
  rounds: number;
  accuracy: number;
  stake: number;
  rewardPool: number;
  modelDefinitionHash: string;
  schema: string;
  sampleData: any;
  sampleDataContent: string;
  numberOfParticipants: number;
}

export const Tasks = ({
  setNumberOfTasks,
}: {
  setNumberOfTasks: (numberOfTasks: number) => void;
}) => {
  const [tasks, setTasks] = useState<Task[]>([] as Task[]);
  const [showTask, setShowTask] = useState(false);

  const [taskToShow, setTaskToShow] = useState<Task>({} as Task);

  const { data, isError, isLoading, refetch } = useContractRead({
    address: process.env
      .NEXT_PUBLIC_FLOCK_TASK_MANAGER_ADDRESS as `0x${string}`,
    abi: FLOCK_TASK_MANAGER_ABI,
    functionName: 'getTasks',
    watch: true,
  });

  const loadTasks = async () => {
    if (data) {
      const loadedTasks: Task[] = await Promise?.all(
        (data as Array<string>)?.map(async (item) => {
          const metadata = (await readContract({
            address: item as `0x${string}`,
            abi: FLOCK_TASK_ABI,
            functionName: 'metadata',
          })) as string;

          const currentRound = (await readContract({
            address: item as `0x${string}`,
            abi: FLOCK_TASK_ABI,
            functionName: 'currentRound',
          })) as number;

          const numberOfParticipants = (await readContract({
            address: item as `0x${string}`,
            abi: FLOCK_TASK_ABI,
            functionName: 'getNumberOfParticipants',
          })) as number;

          return {
            address: item,
            ...JSON.parse(metadata),
            numberOfParticipants,
          } as Task;
        })
      );

      setTasks(loadedTasks);
      setNumberOfTasks(loadedTasks.length);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [data]);

  return (
    <>
      <Box
        direction="row-responsive"
        wrap
        width="100%"
        align="center"
        justify="center"
        gap="small"
      >
        {tasks?.map((task: Task, index: number) => {
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
              width="30%"
              border={{ color: 'black', size: 'small' }}
            >
              <Heading level="3" margin="none">
                  {task.name}
              </Heading>
              <Text>{task.description}</Text>
              <Text margin={{ top: 'xsmall', bottom: 'xsmall' }} size="small">Updated 0 days ago</Text>
              <Box 
                  direction="row" 
                  width="100%" 
                  justify="between" 
                  align="center" 
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
                      <Chat color="black" size="20px" /><Text weight="bold">{task.taskType}</Text>
                  </Box>
                  <Box direction="row" gap="small">
                      <Box direction="row" gap="1px"><Favorite color="black" /> {}</Box>
                      <Box direction="row" gap="1px"><View color="black" /> {}</Box>
                      <Box direction="row" gap="1px"><Group color="black" /> {}</Box>
                  </Box>
              </Box>
              <Box
                direction="row"
                justify="between"
                border={{
                  color: 'black',
                  size: 'small',
                  style: 'solid',
                  side: 'bottom'
                }}
                pad={{ bottom: 'xsmall' }}
              >
                <Box
                  direction="row" 
                  align="center" 
                  gap="xsmall"
                  basis="1/2"
                >
                  <Heading level="3" margin="0">
                    {(
                      ((task.rewardPool / task.rounds) * 100) /
                      task.rewardPool
                    ).toFixed(2)}
                    %
                  </Heading>
                  <Box basis="1/2">
                    <Text size="small">Rewards Return Rate</Text>
                  </Box>
                </Box>
                <Box 
                  direction="row" 
                  align="center"
                  gap="xsmall"
                  basis="1/2"
                  justify="end"
                >
                  <Heading level="3" color="#6C94EC" margin="0">
                    {task.minParticipants}
                  </Heading>
                  <Box basis="1/2">
                    <Text size="small" color="#6C94EC">Participants Requirements</Text>
                  </Box>
                </Box>
              </Box>
              <Box direction="row" width="100%" justify="between" margin={{ top: 'small'}}>
                <Box direction="row" gap="small" alignSelf="end">
                      <UserFemale color='brand' />
                      <Text>Creator Name</Text>
                </Box>
                <Box align="center">
                  <Box
                    direction="row"
                    gap="xxsmall"
                    align="center"
                  >
                    <Text size="small" weight="bold">Short of</Text>
                    <Text size="medium" color="#6C94EC" weight="bold">
                      {task.minParticipants - Number(task.numberOfParticipants)}
                    </Text>
                    <Text size="small" weight="bold">to start</Text>
                  </Box>
                  <PrimaryButton
                    onClick={() => {
                      setTaskToShow(task);
                      setShowTask(true);
                    }}
                    label="Join"
                    size="medium"
                    alignSelf="end"
                    pad={{ vertical: 'xsmall', horizontal: 'medium' }}
                  />
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
      {showTask && (
        <Layer responsive={true}>
          <Box pad="small">
            <Box direction="row-responsive" justify="between" gap="medium" pad="medium">
              <Box direction="row" gap="small">
                <Box gap="small">
                  <Box>
                    <Box direction="row" gap="small" align="center">
                      <Heading level="3" margin="0">
                        {taskToShow.name}
                      </Heading>
                    </Box>
                  </Box>
                  <Box direction="row" gap="small">
                    <Box background="#F5F5F5" round="medium" pad="xsmall">
                      <Text size="xsmall">
                        Reward Pool: <b>$F {taskToShow.rewardPool}</b>
                      </Text>
                    </Box>
                    <Box background="#F2F6FF" round="medium" pad="xsmall">
                      <Text size="xsmall">
                        Initial Stake: <b>$F {taskToShow.stake}</b>
                      </Text>
                    </Box>
                  </Box>
                  <Box
                    background="#F8FAFB"
                    round="small"
                    pad="medium"
                    width="500px"
                  >
                    <Box direction="row" justify="between" align="center">
                      <Box direction="row" align="center" gap="xsmall">
                        <Text color="brand" size="2xl" weight="bold">
                          {Number(taskToShow.numberOfParticipants)}
                        </Text>
                        <Text weight="bold">
                          participant
                          {Number(taskToShow.numberOfParticipants) !== 1 && 's'} have
                          joined the task
                        </Text>
                      </Box>
                      <Box direction="row" align="center">
                        {/* <Stack anchor="right">
                          {Array.from(
                            {
                              length: Math.min(
                                Number(taskToShow.numberOfParticipants),
                                4
                              ),
                            },
                            (_, i) => (
                              <Box key={i} direction="row">
                                <Avatar background="brand" size="small">
                                  <UserFemale size="small" />
                                </Avatar>
                                {Array.from(
                                  {
                                    length:
                                      Number(taskToShow.numberOfParticipants) - (i + 1),
                                  },
                                  (_, j) => (
                                    <Box key={j} pad="xsmall" />
                                  )
                                )}
                              </Box>
                            )
                          )}
                        </Stack>
                        {Number(taskToShow.numberOfParticipants) > 4 && (
                          <Text>+{Number(taskToShow.numberOfParticipants) - 4}</Text>
                        )} */}
                        <Avatar background="brand" size="small">
                          <UserFemale size="small" />
                        </Avatar>
                      </Box>
                    </Box>
                    <Box
                      direction="row"
                      justify="between"
                      margin={{ top: 'small' }}
                    >
                      <Text size="small">Min: {taskToShow.minParticipants}</Text>
                      <Text size="small">Max: {taskToShow.maxParticipants}</Text>
                    </Box>
                    <Box
                      border={{
                        color: 'grey',
                        size: 'xsmall',
                        style: 'solid',
                        side: 'all',
                      }}
                      round="small"
                      margin={{ top: 'xsmall' }}
                    >
                      <Meter
                        values={[
                          {
                            value: Number(taskToShow.numberOfParticipants),
                            color: 'brand',
                            onClick: () => {},
                            label: `Min: ${taskToShow.minParticipants}`,
                            highlight: true,
                          },
                          {
                            value: Number(taskToShow.maxParticipants),
                            color: '#A0F2FF',
                            onClick: () => {},
                            label: `Max: ${taskToShow.maxParticipants}`,
                            highlight: true,
                          },
                        ]}
                        aria-label="meter"
                        max={Number(taskToShow.maxParticipants)}
                        round
                        size="full"
                        thickness="small"
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box direction="row" gap="medium">
                <Box
                  background="#F8FAFB"
                  round="small"
                  pad="medium"
                  align="center"
                  width="small"
                  gap="medium"
                >
                  <Heading level="4" margin="0" alignSelf="start" weight="bold">
                    Learning Rounds
                  </Heading>
                  <Heading level="1" color="#6C94EC" weight="bold">
                    {Number(taskToShow.rounds)}
                  </Heading>
                </Box>
                <Box
                  background="#F8FAFB"
                  round="small"
                  pad="medium"
                  align="center"
                  width="small"
                  gap="medium"
                >
                  <Heading level="4" margin="0" alignSelf="start" weight="bold">
                    Target Accuracy
                  </Heading>
                  <Heading level="1" color="#6C94EC" weight="bold">
                    {taskToShow.accuracy ? Number(taskToShow.accuracy) : '0'}%
                  </Heading>
                </Box>
              </Box>
            </Box>
            <Box pad="medium" gap="medium">
              <Box>
                <Text weight="bold">Description</Text>
                <Text>{taskToShow.description}</Text>
              </Box>
              <Box direction="row-responsive" justify="between">
                <Box gap="medium">
                  <Box>
                    <Text weight="bold">Task Id</Text>
                    <Text wordBreak="break-word">{taskToShow.address}</Text>
                  </Box>
                  <Box>
                    <Text weight="bold">Model name</Text>
                    <Text>{taskToShow.modelName}</Text>
                  </Box>
                </Box>
                <Box gap="medium">
                  <Box>
                    <Text weight="bold">Task type</Text>
                    <Text>{taskToShow.taskType}</Text>
                  </Box>
                  <Box>
                    <Text weight="bold">Model size</Text>
                    <Text>{taskToShow.sizeMemory} MB</Text>
                  </Box>
                </Box>
              </Box>
              <Box direction="row" justify="between">
                <Anchor
                  href={
                    taskToShow.address ===
                    '0x7280c6EF7bB61e76b116b61e608110a85136A35a'
                      ? 'https://drive.google.com/uc?export=download&id=1TBZruhiwYYf9HWN37TOnEW-0qePMxcxr'
                      : 'https://drive.google.com/uc?export=download&id=1HbCqlSop48OETzTcDuo1Oaw3bMLIxA4n'
                  }
                  label="Test Case Dataset"
                />
                <Box>
                  <PrimaryButton label="close" onClick={() => setShowTask(false)} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Layer>
      )}
    </>
  );
};
