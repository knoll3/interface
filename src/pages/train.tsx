import {
  Box,
  Button,
  Heading,
  Layer,
  Menu,
  Paragraph,
  TextInput,
  Text,
} from 'grommet';
import { CreateTask, Layout, PrimaryButton, Tasks } from '../components';
import { useState } from 'react';
import { Chat, CreditCard, Scorecard, Search, Image } from 'grommet-icons';
import { useAccount } from 'wagmi';

export default function TrainPage() {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [numberOfTasks, setNumberOfTasks] = useState(0);
  const { isDisconnected } = useAccount();

  return (
    <Layout>
      <Box direction="row" width="100%">
        <Box basis="1/4" background="#EEEEEE" pad={{ horizontal: 'xlarge' }}>
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
                  direction="row"
                  gap="small"
                  align="center"
              >
                  <Scorecard color="black" size="20px" /><Text weight="bold">Sentiment Analysis</Text>
              </Box>
              <Box
                  border={{ color: 'black', size: 'small' }}
                  round="small"
                  pad="xsmall"
                  background="#E69FBD"
                  direction="row"
                  gap="small"
                  align="center"
              >
                  <Chat color="black" size="20px" /><Text weight="bold">LLM Chatbot</Text>
              </Box>
          </Box>
          <Box>
              <Heading level="3">Finance</Heading>
              <Box
                  border={{ color: 'black', size: 'small' }}
                  round="small"
                  pad="xsmall"
                  direction="row"
                  gap="small"
                  align="center"
              >
                  <CreditCard color="black" size="20px" /><Text weight="bold">Credit Card Fraud Detection</Text>
              </Box>
          </Box>
          <Box>
              <Heading level="3">Computer Vision</Heading>
              <Box
                  border={{ color: 'black', size: 'small' }}
                  round="small"
                  pad="xsmall"
                  direction="row"
                  gap="small"
                  align="center"
              >
                  <Image color="black" size="20px" /><Text weight="bold">Image Classification</Text>
              </Box>
          </Box>
        </Box>
        <Box basis="3/4">
        <Box 
            direction="row" 
            align="center"
            justify="between"
            pad={{ top: 'large', bottom: 'small', horizontal: 'large'}}
        >
            <Box direction="row" gap="large">
                <Box direction="row" alignSelf="end" gap="xsmall"><Text>Tasks</Text>{numberOfTasks}</Box>
                <TextInput
                placeholder="Search"
                icon={<Search />}
                width="medium"
                ></TextInput>
            </Box>
            <Box>
                <Menu plain label="Sort by" items={[]} color="#9E9E9E" />
            </Box>
        </Box>
        <Box pad={{ horizontal: 'large'}} align="center">
          <Tasks setNumberOfTasks={setNumberOfTasks} />
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
