import { Box, Heading, Paragraph } from 'grommet';
import { Layout, PrimaryButton } from '../components';

export default function TrainPage() {
  return (
    <Layout>
      <Box width="100%">
        <Box
          background="#EEEEEE"
          direction="row"
          align="center"
          justify="around"
          width="100%"
        >
          <Box>
            <Box direction="row" gap="xsmall">
              <Heading level="2">Model to</Heading>
              <Heading
                level="2"
                color="#6C94EC
"
              >
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
              margin={{ top: 'large' }}
              label="Create New"
              size="medium"
              pad={{ vertical: 'small', horizontal: 'large' }}
            />
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
