import { Box, Image, Button, Text } from 'grommet';
import { Layout } from '../components';
import ConnectWallet from '../components/ConnectWallet';
import ConnectDiscord from '../components/ConnectDiscord';
import JoinDiscord from '../components/JoinDiscord';
import ConnectTwitter from '../components/ConnectTwitter';
import FollowTwitter from '../components/FollowTwitter';
import BroadcastTwitter from '../components/BroadcastTwitter';
import { useState } from 'react';
import QuestDivider from '../components/QuestDivider';
import ToasterList from '../components/ToasterList';
import useToaster, { IToastContent } from '../hooks/useToaster';
import { ClaimStatus } from '../components/ClaimStep';

interface IOnSubmitProps {
  error?: boolean;
  toast: IToastContent;
}

export interface IStepProps {
  step: number;
  status: ClaimStatus;
  onSubmit(props: IOnSubmitProps): void;
}

export default function QuestPage() {
  const { toasts, addToast } = useToaster();
  const [activeStep, setActiveStep] = useState<number>(1);

  const stepStatus = (step: number) => {
    if (step === activeStep) {
      return 'active';
    }
    if (step < activeStep) {
      return 'complete';
    }
    return 'disabled';
  };

  const onSubmit = ({ error, toast }: IOnSubmitProps) => {
    addToast(toast);
    if (!error) {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
    }
  };

  return (
    <Layout>
      <Box
        direction="row"
        align="center"
        justify="evenly"
        pad={{ vertical: 'large', horizontal: 'xlarge' }}
        background="white"
      >
        <ToasterList toasts={toasts} />
        <Box gap="large">
          <Image src="quest.jpg" alt="quest" />
          <Box align="center" gap="small">
            <Button secondary size="large" label="Claim $MATIC & $FLC" />
          </Box>
        </Box>

        <Box gap="small" style={{ position: 'relative' }}>
          <Text color="#000000" weight={600} margin={{ left: 'medium' }}>
            Complete the tasks to claim $FLC
          </Text>
          <Box gap="xsmall">
            <ConnectWallet
              step={1}
              status={stepStatus(1)}
              onSubmit={onSubmit}
            />
            <QuestDivider />
            <ConnectDiscord
              step={2}
              status={stepStatus(2)}
              onSubmit={onSubmit}
            />
            <QuestDivider />
            <JoinDiscord step={3} status={stepStatus(3)} onSubmit={onSubmit} />
            <QuestDivider />
            <ConnectTwitter
              step={4}
              status={stepStatus(4)}
              onSubmit={onSubmit}
            />
            <QuestDivider />
            <FollowTwitter
              step={5}
              status={stepStatus(5)}
              onSubmit={onSubmit}
            />
            <QuestDivider />
            <BroadcastTwitter
              step={6}
              status={stepStatus(6)}
              onSubmit={onSubmit}
            />
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
