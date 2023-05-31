import {
  Box,
  Button,
  Heading,
  Layer,
  Menu,
  Paragraph,
  TextInput,
} from 'grommet';
import { CreateTask, Layout, PrimaryButton, Tasks } from '../components';
import { useEffect, useState } from 'react';
import { Search } from 'grommet-icons';

export default function TrainPage() {
  const [showCreateTask, setShowCreateTask] = useState(false);

  return (
    <Layout>
      <Box width="100%" gap="large">
        <Box
          background="#EEEEEE"
          direction="row"
          align="center"
          justify="around"
          width="100%"
          pad={{ vertical: 'large' }}
        >
          <Box>
            <Box direction="row" gap="xsmall">
              <Heading level="2">Model to</Heading>
              <Heading level="2" color="#6C94EC">
                train
              </Heading>
            </Box>
            <Paragraph>
              Improve model performance by training it on distributed data
              sources. Data stays local and rewards paid our based on
              contribution to model performance.
            </Paragraph>
          </Box>
          <Box>
            <PrimaryButton
              onClick={() => setShowCreateTask(true)}
              margin={{ top: 'large' }}
              label="Create New"
              size="medium"
              pad={{ vertical: 'small', horizontal: 'large' }}
            />
          </Box>
        </Box>
        <Box
          direction="row"
          align="center"
          justify="around"
          width="100%"
          pad={{ horizontal: 'xlarge' }}
        >
          <Box>
            <TextInput
              placeholder="Search"
              icon={<Search />}
              width="medium"
            ></TextInput>
          </Box>
          <Box direction="row" gap="xlarge" align="center">
            <Box direction="row" gap="large">
              <Button
                secondary
                label="All"
                style={{ borderWidth: '0px' }}
                pad={{ vertical: 'small', horizontal: 'medium' }}
              />
              <Button
                secondary
                plain
                label="Helthcare"
                color="#9E9E9E"
                style={{ borderWidth: '0px' }}
              />
              <Button
                secondary
                plain
                label="Fiance"
                color="#9E9E9E"
                style={{ borderWidth: '0px' }}
              />
            </Box>
            <Box>
              <Menu plain label="Sort by" items={[]} color="#9E9E9E" />
            </Box>
          </Box>
        </Box>
        <Box width="100%" align="center" pad="large">
          <Tasks />
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
