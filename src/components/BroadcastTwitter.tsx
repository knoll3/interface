import { Box } from 'grommet';
import ClaimStep from './ClaimStep';
import { useIsMounted } from '../hooks';
import TimerButton from './TimerButton';
import { toasts } from '../constants/toastMessages';
import { IStepProps } from '../pages/quest';
import { useAccount } from 'wagmi';
import { useContext } from 'react';
import { WalletContext } from '../context/walletContext';
import PressableButton from './PressableButton';

export default function BroadcastTwitter({
  step,
  status,
  onSubmit,
}: IStepProps) {
  const mounted = useIsMounted();
  const { address } = useAccount();
  const { publicKey, userToken } = useContext(WalletContext);

  const twitterBaseUrl = 'https://twitter.com/intent/tweet';
  const tweetText = 'Check out this awesome post!'; // Replace with your desired tweet text
  const hashtags = 'ReactJS,WebDevelopment'; // Replace with your desired hashtags
  const twitterUsername = 'yourTwitterUsername'; // Replace with your Twitter username

  const twitterShareLink = `${twitterBaseUrl}?text=${encodeURIComponent(
    tweetText
  )}&hashtags=${encodeURIComponent(hashtags)}&via=${twitterUsername}`;

  const handleBroadcastButton = () => {
    window.open(twitterShareLink, '_blank');
  };

  const handleVerifyButton = async () => {
    const response = await fetch('/api/quest/oauth/verify-twitter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        auth_key: publicKey,
        wallet: (address as string)?.toLocaleLowerCase(),
        redirectUri: `${window.location.origin}/oauth/twitter`,
      }),
    });

    if (response.status === 200) {
      onSubmit({ toast: toasts.twitterConnectionSuccess });
    } else {
      onSubmit({ error: true, toast: toasts.twitterPostFailed });
    }
  };

  if (!mounted) {
    return <></>;
  }

  return (
    <ClaimStep
      label="Broadcast your Journey to your mate"
      step={step}
      status={status}
      minWidth="180px"
    >
      {status === 'active' && (
        <Box direction="row" gap="xsmall">
          <PressableButton
            label="Broadcast Now"
            onClick={handleBroadcastButton}
          />
          <TimerButton label="Verify" onClick={handleVerifyButton} />
        </Box>
      )}
    </ClaimStep>
  );
}
