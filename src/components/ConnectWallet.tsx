import { useIsMounted, userDataHook, web3AuthInstance } from '@/src/hooks';
import { Button } from 'grommet';
import { useAccount, useConnect } from 'wagmi';
import ClaimStep from './ClaimStep';
import { useEffect } from 'react';

export default function ConnectWallet({ step, status, nextStep }: any) {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { publicKey, userToken } = userDataHook();
  const mounted = useIsMounted();

  const handleConnectButton = async () => {
    if (!isConnected) {
      await connectAsync({ connector: connectors[0] });
    } else {
      fetchLogin();
    }
  };

  const fetchLogin = async () => {
    const response = await fetch('/api/quest/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        auth_key: publicKey,
        wallet: (address as string).toLocaleLowerCase(),
      }),
    });
    if (response.status === 200) {
      nextStep();
    } else {
      // TODO - show error toaster
      console.log({ response });
    }
  };

  useEffect(() => {
    if (address && publicKey) {
      fetchLogin();
    }
  }, [address, publicKey]);

  if (!mounted) {
    return <></>;
  }

  return (
    <ClaimStep label="Get your Wallet Ready" status={status} step={step}>
      {status !== 'complete' && (
        <Button
          primary
          label="Connect Now"
          onClick={handleConnectButton}
          style={{ boxShadow: '3px 4px 0px 0px #000' }}
        />
      )}
    </ClaimStep>
  );
}
