import { Box, Image, Button, Text } from 'grommet';
import { Layout } from '../components';
import ConnectWallet from '../components/ConnectWallet';
import ConnectDiscord from '../components/ConnectDiscord';
import JoinDiscord from '../components/JoinDiscord';
import ConnectTwitter from '../components/ConnectTwitter';
import FollowTwitter from '../components/FollowTwitter';
import BroadcastTwitter from '../components/BroadcastTwitter';
import styled from 'styled-components';
import { useState } from 'react';

const Divider = styled.span`
  border-left: 2px solid #6c94ec;
  width: 1px;
  height: 20px;
  margin-left: 26px;
`;

export default function QuestPage() {
  const [activeStep, setActiveStep] = useState(1);

  const stepStatus = (step: number) => {
    if (step === activeStep) {
      return 'active';
    }
    if (step < activeStep) {
      return 'complete';
    }
    return 'disabled';
  };

  const onNext = () => {
    setActiveStep(activeStep + 1);
  };

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
            <ConnectWallet step={1} status={stepStatus(1)} nextStep={onNext} />
            <Divider />
            <ConnectDiscord step={2} status={stepStatus(2)} nextStep={onNext} />
            <Divider />
            <JoinDiscord step={3} status={stepStatus(3)} nextStep={onNext}  />
            <Divider />
            <ConnectTwitter step={4} status={stepStatus(4)} nextStep={onNext}  />
            <Divider />
            <FollowTwitter step={5} status={stepStatus(5)} nextStep={onNext}  />
            <Divider />
            <BroadcastTwitter step={6} status={stepStatus(6)} nextStep={onNext}  />
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
