import { Box, Image, Button, Text } from 'grommet';
import { Layout } from '../components';
import ConnectWallet from '../components/ConnectWallet';
import ConnectDiscord from '../components/ConnectDiscord';
import JoinDiscord from '../components/JoinDiscord';
import ConnectTwitter from '../components/ConnectTwitter';
import FollowTwitter from '../components/FollowTwitter';
import BroadcastTwitter from '../components/BroadcastTwitter';
import styled from 'styled-components';

const Divider = styled.span`
  border-left: 2px solid #6c94ec;
  width: 1px;
  height: 20px;
  margin-left: 26px;
`;

export default function QuestPage() {
  return (
    <Layout>
      <Box
        direction="row"
        align="center"
        justify="evenly"
        pad={{ vertical: 'large', horizontal: 'xlarge' }}
        background="#FFFFFF"
      >
        <Box gap="large">
          <Image src="quest.jpg" alt="quest" />
          <Box align="center" gap="small">
            <Button secondary size="large" label="Claim $MATIC & $FLC" />
          </Box>
        </Box>

        <Box gap="small">
          <Text color="#000000" weight={600} margin={{ left: 'medium' }}>
            Complete the tasks to claim $FLC
          </Text>
          <Box gap="xsmall">
            <ConnectWallet />
            <Divider />
            <ConnectDiscord />
            <Divider />
            <JoinDiscord />
            <Divider />
            <ConnectTwitter />
            <Divider />
            <FollowTwitter />
            <Divider />
            <BroadcastTwitter />
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
