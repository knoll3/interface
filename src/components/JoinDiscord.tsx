import { Box, Button } from 'grommet';
import ClaimStep from './ClaimStep';
import { useIsMounted } from '../hooks';
import TimerButton from './TimerButton';
import { toasts } from '../constants/toastMessages';
import { IStepProps } from '../pages/quest';
import { useContext } from 'react';
import { WalletContext } from '../context/walletContext';
import { useAccount } from 'wagmi';
import { QuestContext } from '../context/questContext';

export default function JoinDiscord({ showToaster }: IStepProps) {
  const { address } = useAccount();
  const mounted = useIsMounted();
  const { publicKey, userToken } = useContext(WalletContext);
  const { getStepInfo, nextStep } = useContext(QuestContext);

  const STEP_NAME = 'discord_join_get_role'
  const { step, status } = getStepInfo(STEP_NAME);

  const handleVerifyButton = async () => {
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
  };

  if (!mounted) {
    return <></>;
  }

  return (
    <ClaimStep
      label="Join our Discord and acquire a role"
      step={step}
      status={status}
      minWidth='160px'
    >
      {status === 'active' && (
        <Box direction="row" gap="xsmall">
          <Button
            primary
            label="Join Now"
            href={process.env.NEXT_PUBLIC_DISCORD_CHANNEL_LINK}
            target="_blank"
            size="small"
          />
          <TimerButton
            label="Verify"
            onClick={handleVerifyButton}
          />
        </Box>
      )}
    </ClaimStep>
  );
}
