import { useIsMounted } from '@/src/hooks';
import { Button } from 'grommet';
import { useAccount, useConnect } from 'wagmi';
import ClaimStep from './ClaimStep';
import { useContext, useEffect } from 'react';
import { WalletContext } from '../context/walletContext';
import { toasts } from '../constants/toastMessages';
import { IStepProps } from '../pages/quest';
import { QuestContext } from '../context/questContext';
import PressableButton from './PressableButton';

export default function ConnectWallet({ showToaster }: IStepProps) {
  const mounted = useIsMounted();
  const { address } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { publicKey, userToken } = useContext(WalletContext);
  const { saveQuestProgress, getStepInfo } = useContext(QuestContext);

  const { step, status } = getStepInfo('wallet_connect');

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
    const response: any = await fetch('/api/quest/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(payload),
    });
    if (response.status === 200) {
      const { data } = await response.json();
      const discordName = data?.user?.userDiscordData?.discordName;
      const twitterName = data?.user?.userTwitterData?.twitterName;
      const wallet = data?.user?.wallet;
      const user = { discordName, twitterName, wallet };
      const tasks =
        data?.user?.userQuestTask?.map(
          (task: any) => task.questTask.taskName
        ) || [];

      saveQuestProgress(tasks, user);
      // nextStep();
      showToaster({ toast: toasts.walletConnectionSuccess });
    } else {
      showToaster({ error: true, toast: toasts.walletConnectionFailed });
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
        <PressableButton label="Connect Now" onClick={handleConnectButton} />
      )}
    </ClaimStep>
  );
}
