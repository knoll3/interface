import { Box, Image, Button, Text, ResponsiveContext } from 'grommet';
import { Layout } from '../components';
import ConnectWallet from '../components/ConnectWallet';
import ConnectDiscord from '../components/ConnectDiscord';
import JoinDiscord from '../components/JoinDiscord';
import ConnectTwitter from '../components/ConnectTwitter';
import FollowTwitter from '../components/FollowTwitter';
import BroadcastTwitter from '../components/BroadcastTwitter';
import { useContext, useEffect, useState } from 'react';
import QuestDivider from '../components/QuestDivider';
import ToasterList from '../components/ToasterList';
import useToaster, { IToastContent } from '../hooks/useToaster';
import { ClaimStatus } from '../components/ClaimStep';
import { useAccount } from 'wagmi';
import { WalletContext } from '../context/walletContext';
import styled from 'styled-components';
import Tag from '../components/Tag';
import PressableButton from '../components/PressableButton';

interface IOnSubmitProps {
  error?: boolean;
  toast: IToastContent;
}

export interface IStepProps {
  step: number;
  status: ClaimStatus;
  onSubmit(props: IOnSubmitProps): void;
}

const QuestWrapper = styled.div<{ size: string }>`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: ${(props) => (props.size === 'small' ? '100%' : '518px')};
  min-width: ${(props) => (props.size === 'small' ? 'none' : '350px')};
`;

export default function QuestPage() {
  const size = useContext(ResponsiveContext);
  const { toasts, addToast } = useToaster();
  const [activeStep, setActiveStep] = useState<number>(6);
  const { address } = useAccount();
  const { publicKey, userToken } = useContext(WalletContext);

  const isMobile = size === 'small';

  useEffect(() => {
    console.log({ size });
  }, [size]);

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

  const handleClaim = async () => {
    const response = await fetch('/api/quest/claimReward', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        auth_key: publicKey,
        walletAddress: (address as string)?.toLocaleLowerCase(),
      }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <Layout>
      <Box
        direction={isMobile ? 'column' : 'row'}
        align="center"
        justify="evenly"
        pad={{ vertical: 'large', horizontal: 'xlarge' }}
        background="white"
        gap="30px"
      >
        <ToasterList toasts={toasts} />
        <Box gap="large" width={isMobile ? '300px' : undefined}>
          <Image src="quest.jpg" alt="quest" />
          <Box align="center" gap="small">
            {activeStep < 7 ? (
              <Tag label="Claim $MATIC & $FLC" type="disabled" />
            ) : (
              <PressableButton
                label="Claim $MATIC & $FLC"
                onClick={handleClaim}
              />
            )}
          </Box>
        </Box>

        <QuestWrapper size={size}>
          <Box>
            <Text
              color="#000000"
              weight={600}
              margin={{ left: 'medium' }}
              size="16px"
            >
              Complete the tasks to claim $FLC
            </Text>
          </Box>
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
        </QuestWrapper>
      </Box>
    </Layout>
  );
}
