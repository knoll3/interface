import { Box } from 'grommet';
import ClaimStep from './ClaimStep';
import { useIsMounted } from '../hooks';
import TimerButton from './TimerButton';
import { toasts } from '../constants/toastMessages';
import { IStepProps } from '../pages/quest';
import { useAccount } from 'wagmi';
import { useContext, useState } from 'react';
import { WalletContext } from '../context/walletContext';
import { QuestContext } from '../context/questContext';
import PressableButton from './PressableButton';

export default function FollowTwitter({ showToaster }: IStepProps) {
  const { address } = useAccount();
  const mounted = useIsMounted();
  const { publicKey, userToken } = useContext(WalletContext);
  const { getStepInfo, nextStep } = useContext(QuestContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const STEP_NAME = 'twitter_follow';
  const { step, status } = getStepInfo(STEP_NAME);

  const handleFollowButton = () => {
    window.open(process.env.NEXT_PUBLIC_TWITTER_FOLLOW_LINK, '_blank');
  };

  const handleVerifyButton = async () => {
    setIsLoading(true);
    const response = await fetch('/api/quest/oauth/twitterFollowVerify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        auth_key: publicKey,
        wallet: (address as string)?.toLocaleLowerCase(),
      }),
    });

    if (response.status === 200) {
      nextStep(STEP_NAME);
      showToaster({ toast: toasts.twitterConnectionSuccess });
    } else {
      showToaster({ error: true, toast: toasts.twitterFollowFailed });
    }
    setIsLoading(false);
  };

  if (!mounted) {
    return <></>;
  }

  return (
    <ClaimStep
      label="Follow @flock_io on Twitter"
      step={step}
      status={status}
      minWidth="160px"
    >
      {status === 'active' && (
        <Box direction="row" gap="xsmall">
          <PressableButton label="Follow Now" onClick={handleFollowButton} />
          <TimerButton
            label="Verify"
            onClick={handleVerifyButton}
            isLoading={isLoading}
          />
        </Box>
      )}
    </ClaimStep>
  );
}
