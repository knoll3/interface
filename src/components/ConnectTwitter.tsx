import ClaimStep from './ClaimStep';
import { useIsMounted } from '../hooks';
import { useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { WalletContext } from '../context/walletContext';
import { IStepProps } from '../pages/quest';
import { toasts } from '../constants/toastMessages';
import PressableButton from './PressableButton';
import Tag from './Tag';

export default function ConnectTwitter({ step, status, onSubmit }: IStepProps) {
  const mounted = useIsMounted();
  const { address } = useAccount();
  const { publicKey, userToken } = useContext(WalletContext);

  const [twitterAccessToken, setTwitterAccessToken] = useState('');
  const [twitterUser, setTwitterUser] = useState('');

  const handleConnectButton = () => {
    const params =
      'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=700,height=800,left=50%,top=50%';
    const url = `${window.location.origin}/api/quest/oauth/twitterLogin`;
    const popup = window.open(url, 'Twitter Auth', params);
    popup?.postMessage('message', window.location.href);
  };

  const checkTwitterAuth = async (accessToken: string) => {
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
      setTwitterUser(name);
      onSubmit({ toast: toasts.twitterConnectionSuccess });
    } else {
      if (accessToken) {
        onSubmit({ error: true, toast: toasts.twitterConnectionFailed });
      }
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
    if (publicKey && userToken && address && status === 'active') {
      checkTwitterAuth(twitterAccessToken);
    }
  }, [twitterAccessToken, publicKey, userToken, address, status]);

  if (!mounted) {
    return <></>;
  }

  const content: any = {
    disabled: <></>,
    active: (
      <PressableButton label="Connect Now" onClick={handleConnectButton} />
    ),
    complete: twitterUser && <Tag label={`@${twitterUser}`} />,
  };

  return (
    <ClaimStep label="Connect your Twitter account" step={step} status={status}>
      {content[status]}
    </ClaimStep>
  );
}
