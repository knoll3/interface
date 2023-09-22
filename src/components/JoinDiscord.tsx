import { Box } from 'grommet';
import ClaimStep from './ClaimStep';
import { useIsMounted } from '../hooks';
import TimerButton from './TimerButton';
import { toasts } from '../constants/toastMessages';
import { IStepProps } from '../pages/quest';
import { useContext } from 'react';
import { WalletContext } from '../context/walletContext';
import { useAccount } from 'wagmi';
import PressableButton from './PressableButton';

export default function JoinDiscord({ step, status, onSubmit }: IStepProps) {
  const { address } = useAccount();
  const mounted = useIsMounted();
  const { publicKey, userToken } = useContext(WalletContext);

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
      onSubmit({ toast: toasts.discordVerifySuccess });
    } else {
      onSubmit({ toast: toasts.discordVerifyFailed });
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
          <TimerButton label="Verify" onClick={handleVerifyButton} />
        </Box>
      )}
    </ClaimStep>
  );
}
