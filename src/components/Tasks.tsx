import { useContractRead } from 'wagmi';
import { FLOCK_TASK_MANAGER_ABI } from '../contracts/flockTaskManager';
import { Avatar, Box, Heading, Layer, Meter, Text, Button } from 'grommet';
import { useEffect, useState } from 'react';
import { FLOCK_TASK_ABI } from '../contracts/flockTask';
import { readContract } from '@wagmi/core';
import { Favorite, Group, View,  } from 'grommet-icons';
import { PrimaryButton } from './PrimaryButton';
import download from 'downloadjs';

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
  currentRound: number;
}

interface TasksProps {
  setNumberOfTasks: (numberOfTasks: number) => void;
  filterItems: {
    taskTypes: string[];
    progressStatus: string[];
  };
  updateFilterType: (selectedTypes: string[]) => void;
  updateFilterProgressStatus: (selectedStatuses: string[]) => void;
}

export const Tasks = ({
    setNumberOfTasks,
    filterItems,
  }: TasksProps) => {
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
            currentRound,
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


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const taskAddress = params.get('taskAddress');
    if (taskAddress) {
      const task = tasks.find((task) => task.address === taskAddress);
      if (task) {
        setTaskToShow(task);
        setShowTask(true);
      }
    }
  }, [tasks]);

  const ipfsGatewayURL = `https://gateway.ipfs.io/ipfs/${taskToShow.sampleData}`;
  
  const downloadJSON = async () => {
    try {
      const response = await fetch(ipfsGatewayURL);
      const data = await response.blob();

      download(data, 'data.json', 'application/json');
    } catch (error) {
      console.error('Error downloading JSON:', error);
    }
  };

  const handleRedirect = async () => {
    setTimeout(function(){
      if (confirm("If you don't have Flock client installed, you can download it now by clicking OK.")) {
        window.location.assign('https://github.com/FLock-io/client-interface/releases');
      }
    }, 1000);

    window.location.assign('flock://test');
  }

  function filterProgress(task: Task): string {
    if (task.minParticipants > Number(task.numberOfParticipants)) {
      return "available";
    } else if (Number(task.currentRound) < Number(task.rounds)-1) {
      return "inProcess";
    } return "completed";
  }

  const getProgressColor = (progress: string) => {
    switch (progress) {
      case 'available':
        return '#FBC756'; 
      case 'inProcess':
        return '#76CA66'; 
      case 'completed':
        return '#70A4FF';
      default:
        return ''; 
    }
  };

  const getProgressText = (progress: string) => {
    switch (progress) {
      case 'available':
        return 'Available to join'; 
      case 'inProcess':
        return 'In process'; 
      case 'completed':
        return 'Completed';
      default:
        return ''; 
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const taskTypeMatch = filterItems.taskTypes?.length === 0 || filterItems.taskTypes?.includes(task.taskType);
    const progressStatusMatch = filterItems.progressStatus?.length === 0 || filterItems.progressStatus?.includes(filterProgress(task));
    return taskTypeMatch && progressStatusMatch;
  });
  
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
        {filteredTasks.map((task: Task, index: number) => {
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
              width="400px"
              border={{ color: 'black', size: 'small' }}
            >
          <Box direction="row" gap="small">
            <Box
              border={{ color: 'black', size: 'small' }}
              round="medium"
              pad="xsmall"
              background="#F2F6FF"
              direction="row"
              gap="small"
              justify="center"
              width="xsmall"
            >
              <Text size="xsmall" margin="xsmall">
                {task.taskType}
              </Text>
            </Box>
            <Box
              border={{ color: 'black', size: 'small' }}
              round="medium"
              pad="xsmall"
              background={getProgressColor(filterProgress(task))}
              direction="row"
              gap="small"
              align="center"
              width={{ max: '60%' }}
            >
              <Text size="xsmall" margin="xsmall">
                {getProgressText(filterProgress(task))}
              </Text>
            </Box>
          </Box>
              <Heading level="3" margin="none">
                  {task.name}
              </Heading>
              <Text size="small" truncate={true}>{task.description}</Text>
              <Text margin={{ top: 'xsmall', bottom: 'xsmall' }} size="small">Updated 0 days ago</Text>
              <Box 
                  direction="row" 
                  width="100%" 
                  justify="between" 
                  align="center" 
                  pad={{ bottom: 'xsmall' }}
                  >
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
                  justify="end"
                  margin={{ left: 'small'}}
                  basis='1/2'
                >
                  <Heading level="3" color="#6C94EC" margin="0">
                    {task.minParticipants}
                  </Heading>
                  <Box width="xsmall">
                    <Text size="small" color="#6C94EC">Participants Requirements</Text>
                  </Box>
                </Box>
              </Box>
              <Box direction="row" width="100%" justify="between" margin={{ top: 'small'}}>
                <Box direction="row" gap="small" alignSelf="end">
                      <Avatar src="emoji1.png" background="brand" size="medium">
                      </Avatar>
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
                        <Avatar src="emoji1.png" background="brand" size="small">
                        </Avatar>
                        <Avatar src="emoji2.png" background="brand" size="small">
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
                    {taskToShow.accuracy ? `${Number(taskToShow.accuracy)} %`  : 'N/A'} 
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
              <Box justify="start" width="small">
                <Button
                  onClick={handleRedirect}
                  label="Join"
                  primary
                />              
              </Box>
              <Box direction="row" justify="between">
                <PrimaryButton onClick={downloadJSON} label="Download Test Case Dataset"/>
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
