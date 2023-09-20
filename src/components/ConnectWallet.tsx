import { useIsMounted, userDataHook, web3AuthInstance } from '@/src/hooks';
import { Button } from 'grommet';
import { useAccount, useConnect } from 'wagmi';
import ClaimStep from './ClaimStep';
import { useEffect } from 'react';
import useQuest from '../hooks/useQuest';

export default function ConnectWallet({ step, status, nextStep }: any) {
  const { address } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { publicKey, userToken } = userDataHook();
  const mounted = useIsMounted();
  const { setQuestInfo, getQuestInfo } = useQuest();
  const {activeStep} = getQuestInfo()

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
      setQuestInfo({ userToken, ...payload });
      nextStep();
    } else {
      // TODO - show error toaster
      console.log({ response });
    }
  };

  useEffect(() => {
    if (address && publicKey && activeStep === step) {
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
