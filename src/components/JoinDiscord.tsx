import { Box } from 'grommet';
import ClaimStep from './ClaimStep';
import { useIsMounted } from '../hooks';
import TimerButton from './TimerButton';
import { toasts } from '../constants/toastMessages';
import { IStepProps } from '../pages/quest';
import { useContext, useState } from 'react';
import { WalletContext } from '../context/walletContext';
import { useAccount } from 'wagmi';
import { QuestContext } from '../context/questContext';
import PressableButton from './PressableButton';

export default function JoinDiscord({ showToaster }: IStepProps) {
  const { address } = useAccount();
  const mounted = useIsMounted();
  const { publicKey, userToken } = useContext(WalletContext);
  const { getStepInfo, nextStep } = useContext(QuestContext);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const STEP_NAME = 'discord_join_get_role'
  const { step, status } = getStepInfo(STEP_NAME);

  const handleVerifyButton = async () => {
    setIsLoading(true)
    const response = await fetch('/api/quest/oauth/discordVerify', {
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
      showToaster({ toast: toasts.discordVerifySuccess });
    } else {
      showToaster({ toast: toasts.discordVerifyFailed });
    }
    setIsLoading(false)
  };

  if (!mounted) {
    return <></>;
  }

  return (
    <ClaimStep
      label="Join our Discord and acquire a role"
      step={step}
      status={status}
      minWidth="160px"
    >
      {status === 'active' && (
        <Box direction="row" gap="xsmall">
          <PressableButton
            label="Join Now"
            onClick={() =>
              window.open(
                process.env.NEXT_PUBLIC_DISCORD_CHANNEL_LINK,
                '_blank'
              )
            }
          />
          <TimerButton label="Verify" onClick={handleVerifyButton} isLoading={isLoading} />
        </Box>
      )}
    </ClaimStep>
  );
}
