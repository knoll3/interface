import {
  Box,
  Button,
  Heading,
  Layer,
  Menu,
  Paragraph,
  TextInput,
  Text,
  ResponsiveContext,
} from 'grommet';
import { CreateTask, Layout, PrimaryButton, Tasks } from '../components';
import { useState, useContext } from 'react';
import { Chat, CreditCard, Scorecard, Search, Image } from 'grommet-icons';
import { useAccount } from 'wagmi';

const cardColors = {
  "Large Language Model Finetuning": "#A4C0FF",
  "NLP": "#E69FBD",
  "Time series prediction": "#D9D9D9",
  "Classification": "#BDD4DA",
}

export default function TrainPage() {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [numberOfTasks, setNumberOfTasks] = useState(0);
  const [filter, setFilter] = useState<string[]>([]);
  const { isDisconnected } = useAccount();
  const size = useContext(ResponsiveContext);

  const filterAction = (item: string) => {
    if (filter.find((f) => f === item)) {
      setFilter(filter.filter((f) => f !== item));
    } else {
      setFilter([...filter, item]);
    }
  }

  return (
    <Layout>
      <Box direction="row-responsive" width="100%">
        <Box basis="1/4" background="#EEEEEE" pad={{ horizontal: size === 'large' ? 'xlarge' : 'medium', bottom: 'large' }}>
          <Box margin={{ vertical: 'small'}}>
              <PrimaryButton
                onClick={() => setShowCreateTask(true)}
                disabled={isDisconnected}
                margin={{ top: 'large' }}
                label="Create New"
                size="medium"
                pad={{ vertical: 'small', horizontal: 'large' }}
              />
          </Box>
          <Box gap="small">
              <Heading level="3">NLP</Heading>
              <Box
                  border={{ color: 'black', size: 'small' }}
                  round="small"
                  pad="xsmall"
                  background={ filter.includes('NLP') ? cardColors["NLP"] : ''}
                  direction="row"
                  gap="small"
                  align="center"
                  onClick={() => filterAction('NLP')}
              >
                  <Scorecard color="black" size="20px" /><Text weight="bold">NLP</Text>
              </Box>
              <Box
                  border={{ color: 'black', size: 'small' }}
                  round="small"
                  pad="xsmall"
                  background={ filter.includes('Large Language Model Finetuning') ? cardColors["Large Language Model Finetuning"] : ''}
                  direction="row"
                  gap="small"
                  align="center"
                  onClick={() => filterAction('Large Language Model Finetuning')}
              >
                  <Chat color="black" size="20px" /><Text weight="bold">LLM Finetuning</Text>
              </Box>
          </Box>
          <Box gap="small">
              <Heading level="3">Finance</Heading>
              <Box
                  border={{ color: 'black', size: 'small' }}
                  round="small"
                  pad="xsmall"
                  direction="row"
                  gap="small"
                  align="center"
                  onClick={() => filterAction('Credit Card Fraud Detection')}
              >
                  <CreditCard color="black" size="20px" /><Text weight="bold">Credit Card Fraud Detection</Text>
              </Box>
              <Box
                  border={{ color: 'black', size: 'small' }}
                  round="small"
                  pad="xsmall"
                  background={ filter.includes('Time series prediction') ? cardColors["Time series prediction"] : ''}
                  direction="row"
                  gap="small"
                  align="center"
                  onClick={() => filterAction('Time series prediction')}
              >
                  <CreditCard color="black" size="20px" /><Text weight="bold">Time series prediction</Text>
              </Box>
          </Box>
          <Box gap="small">
              <Heading level="3">Computer Vision</Heading>
              <Box
                  border={{ color: 'black', size: 'small' }}
                  round="small"
                  pad="xsmall"
                  background={ filter.includes('Classification') ? cardColors["Classification"] : ''}
                  direction="row"
                  gap="small"
                  align="center"
                  onClick={() => filterAction('Classification')}
              >
                  <Image color="black" size="20px" /><Text weight="bold">Classification</Text>
              </Box>
          </Box>
        </Box>
        <Box basis="3/4">
          <Box 
              direction="row-responsive" 
              align="center"
              justify="between"
              pad={{ top: 'large', bottom: 'small', horizontal: 'large'}}
          >
              <Box direction="row-responsive" gap="large">
                  <Box direction="row" alignSelf="end" gap="xsmall"><Text>Tasks</Text>{numberOfTasks}</Box>
                  <TextInput
                  placeholder="Search"
                  icon={<Search />}
                  ></TextInput>
              </Box>
              <Box>
                { size === "large" &&
                  <Menu plain label="Sort by" items={[]} color="#9E9E9E" />
                }
              </Box>
          </Box>
          <Box pad={{ horizontal: 'large'}} align="center">
            <Tasks setNumberOfTasks={setNumberOfTasks} filterItems={filter} />
          </Box>
        </Box>
      </Box>
      {showCreateTask && (
        <Layer responsive={true}>
          <CreateTask setShowCreateTask={setShowCreateTask} />
        </Layer>
      )}
    </Layout>
  );
}
