import { useIsMounted, userDataHook, web3AuthInstance } from '@/src/hooks';
import { Button } from 'grommet';
import { useAccount, useConnect } from 'wagmi';
import ClaimStep, { ClaimStatus } from './ClaimStep';
import { useEffect, useState } from 'react';

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { publicKey } = userDataHook();
  const mounted = useIsMounted();

  const [status, setStatus] = useState<ClaimStatus>('active');

  const handleConnectButton = async () => {
    await connectAsync({ connector: connectors[0] });
  };

  const fetchLogin = async () => {
    const token = await web3AuthInstance.authenticateUser()
    console.log(token)

    const response = await fetch('/api/quest/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.idToken}`,
      },
      body: JSON.stringify({ auth_key: publicKey, wallet: (address as string).toLocaleLowerCase() }),
    });
    if (response.status === 200) {
      setStatus('complete');
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
    <ClaimStep label="Get your Wallet Ready" status={status} step={1}>
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
