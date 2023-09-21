import { useIsMounted } from '@/src/hooks';
import { Button } from 'grommet';
import { useAccount, useConnect } from 'wagmi';
import ClaimStep from './ClaimStep';
import { useContext, useEffect } from 'react';
import { WalletContext } from '../context/walletContext';
import { toasts } from '../constants/toastMessages';
import { IStepProps } from '../pages/quest';

export default function ConnectWallet({ step, status, onSubmit }: IStepProps) {
  const { address } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { publicKey, userToken } = useContext(WalletContext);
  const mounted = useIsMounted();

  const handleConnectButton = async () => {
    if (!address) {
      await connectAsync({ connector: connectors[0] });
    } else {
      fetchLogin();
    }
  };

  const fetchLogin = async () => {
    const payload = {
      auth_key: publicKey,
      wallet: (address as string).toLocaleLowerCase(),
    };
    const response = await fetch('/api/quest/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(payload),
    });
    if (response.status === 200) {
      onSubmit({ toast: toasts.walletConnectionSuccess });
    } else {
      onSubmit({ error: true, toast: toasts.walletConnectionFailed });
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
