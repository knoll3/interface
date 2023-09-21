import { Button } from 'grommet';
import ClaimStep from './ClaimStep';
import { useIsMounted } from '../hooks';
import { useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { WalletContext } from '../context/walletContext';
import { IStepProps } from '../pages/quest';

export default function ConnectTwitter({ step, status, onSubmit }: IStepProps) {
  const mounted = useIsMounted();
  const { address } = useAccount();
  const { publicKey, userToken } = useContext(WalletContext);

  const [twitterCode, setTwitterCode] = useState('');

  const handleConnectButton = () => {
    const params =
      'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=700,height=800,left=50%,top=50%';
    const url = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID}&redirect_uri=${window.location.origin}/oauth/twitter&scope=tweet.write%20follows.read&state=state&code_challenge=challenge&code_challenge_method=plain`;
    const popup = window.open(url, 'Twitter Auth', params);
    popup?.postMessage('message', window.location.href);
  };

  const checkTwitterAuth = async (code: string) => {
    // TODO - check twitter auth on backend
    console.log({ code });

    // onSubmit({ toast: toasts.twitterConnectionSuccess });
  };

  useEffect(() => {
    const bc = new BroadcastChannel('twitterChannel');
    bc.onmessage = (event) => {
      const code = event?.data?.code;
      if (code) {
        setTwitterCode(code);
      }
    };

    return () => bc.close();
  }, []);

  useEffect(() => {
    if (twitterCode && publicKey && userToken && address) {
      checkTwitterAuth(twitterCode);
    }
  }, [twitterCode, publicKey, userToken, address]);

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
        style={{ boxShadow: '3px 4px 0px 0px #000' }}
      />
    ),
    complete: <Button primary label="@BrunoSouto" />,
  };

  return (
    <ClaimStep label="Connect your Twitter account" step={step} status={status}>
      {content[status]}
    </ClaimStep>
  );
}
