import ClaimStep from './ClaimStep';
import { useIsMounted } from '../hooks';
import { useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { WalletContext } from '../context/walletContext';
import { toasts } from '../constants/toastMessages';
import { IStepProps } from '../pages/quest';
import { QuestContext } from '../context/questContext';
import PressableButton from './PressableButton';
import Tag from './Tag';

export default function ConnectDiscord({ showToaster }: IStepProps) {
  const mounted = useIsMounted();
  const { address } = useAccount();
  const { publicKey, userToken } = useContext(WalletContext);
  const { getStepInfo, nextStep, user } = useContext(QuestContext);
  const [discordCode, setDiscordCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const STEP_NAME = 'discord_connect';
  const { step, status } = getStepInfo(STEP_NAME);
  const { discordName } = user;

  const handleConnectButton = () => {
    const params =
      'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=700,height=800,left=50%,top=50%';
    const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${window.location.origin}/oauth/discord&response_type=code&scope=identify%20guilds.members.read`;
    const popup = window.open(url, 'Discord Auth', params);
    popup?.postMessage('message', window.location.href);
  };

  const checkDiscordAuth = async (code: string) => {
    setIsLoading(true);
    const response = await fetch('/api/quest/oauth/discord', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        auth_key: publicKey,
        wallet: (address as string)?.toLocaleLowerCase(),
        code,
        redirectUri: `${window.location.origin}/oauth/discord`,
      }),
    });

    if (response.status === 200 || response.status === 201) {
      const {
        data: { discordName },
      } = await response.json();

      showToaster({ toast: toasts.discordConnectionSuccess });
      nextStep(STEP_NAME, { discordName });
    } else {
      if (response.status === 409) {
        showToaster({
          error: true,
          toast: toasts.discordConnectionAlreadyAssociated,
        });
      } else {
        if (code) {
          showToaster({ error: true, toast: toasts.discordConnectionFailed });
        }
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const popupResponse = (event: any) => {
      const code = event?.data?.code;
      if (code) {
        window.removeEventListener('message', popupResponse);
        setDiscordCode(code);
      }
    };

    window.addEventListener('message', popupResponse);
    return () => window.removeEventListener('message', popupResponse);
  }, []);

  useEffect(() => {
    discordCode && checkDiscordAuth(discordCode);
  }, [discordCode]);

  if (!mounted) {
    return <></>;
  }

  const content: any = {
    disabled: <></>,
    active: (
      <PressableButton label="Connect Now" onClick={handleConnectButton} />
    ),
    complete: discordName && <Tag label={discordName} />,
  };

  return (
    <ClaimStep label="Connect your Discord account" step={step} status={status}>
      {isLoading ? <Tag label="Connect Now" type="black" /> : content[status]}
    </ClaimStep>
  );
}
