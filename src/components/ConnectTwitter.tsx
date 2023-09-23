import { Button } from 'grommet';
import ClaimStep from './ClaimStep';
import { useIsMounted } from '../hooks';
import { useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { WalletContext } from '../context/walletContext';
import { IStepProps } from '../pages/quest';
import { toasts } from '../constants/toastMessages';
import { QuestContext } from '../context/questContext';

export default function ConnectTwitter({ showToaster }: IStepProps) {
  const mounted = useIsMounted();
  const { address } = useAccount();
  const { publicKey, userToken } = useContext(WalletContext);
  const [twitterAccessToken, setTwitterAccessToken] = useState('');
  const { getStepInfo, user, nextStep } = useContext(QuestContext);

  const STEP_NAME = 'twitter_connect';
  const { step, status } = getStepInfo(STEP_NAME);
  const { twitterName } = user;

  const handleConnectButton = () => {
    const params =
      'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=700,height=800,left=50%,top=50%';
    const url = `${window.location.origin}/api/quest/oauth/twitterLogin`;
    const popup = window.open(url, 'Twitter Auth', params);
    popup?.postMessage('message', window.location.href);
  };

  const checkTwitterAuth = async (accessToken: string) => {
    if (accessToken) {
      const response = await fetch('/api/quest/oauth/twitter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          auth_key: publicKey,
          wallet: (address as string)?.toLocaleLowerCase(),
          accessToken,
        }),
      });

      if (response.status === 201 || response.status === 200) {
        const {
          data: { name },
        } = await response.json();
        nextStep(STEP_NAME, { twitterName: name });
        showToaster({ toast: toasts.twitterConnectionSuccess });
      } else {
        showToaster({ error: true, toast: toasts.twitterConnectionFailed });
      }
    } else {
      showToaster({ error: true, toast: toasts.twitterConnectionFailed });
    }
  };

  useEffect(() => {
    const bc = new BroadcastChannel('twitterChannel');
    bc.onmessage = (event) => {
      const accessToken = event?.data?.accessToken;
      if (accessToken) {
        setTwitterAccessToken(accessToken);
      }
    };

    return () => bc.close();
  }, []);

  useEffect(() => {
    twitterAccessToken && checkTwitterAuth(twitterAccessToken);
  }, [twitterAccessToken]);

  if (!mounted) {
    return <></>;
  }

  const content: any = {
    disabled: <></>,
    active: (
      <Button
        primary
        label="Connect Now"
        onClick={handleConnectButton}
        size="small"
      />
    ),
    complete: twitterName && (
      <Button primary label={`@${twitterName}`} size="small" />
    ),
  };

  return (
    <ClaimStep label="Connect your Twitter account" step={step} status={status}>
      {content[status]}
    </ClaimStep>
  );
}
