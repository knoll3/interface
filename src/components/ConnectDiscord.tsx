import { Button } from 'grommet';
import ClaimStep from './ClaimStep';
import { useIsMounted } from '../hooks';
import { useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { WalletContext } from '../context/walletContext';
import { toasts } from '../constants/toastMessages';
import { IStepProps } from '../pages/quest';

export default function ConnectDiscord({ step, status, onSubmit }: IStepProps) {
  const { address } = useAccount();
  const mounted = useIsMounted();
  const { publicKey, userToken } = useContext(WalletContext);

  const [discordCode, setDiscordCode] = useState<string>('');
  const [discordUser, setDiscordUser] = useState<any>('');

  const handleConnectButton = () => {
    const params =
      'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=700,height=800,left=50%,top=50%';
    const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${window.location.origin}/oauth/discord&response_type=code&scope=identify%20guilds.members.read`;
    const popup = window.open(url, 'Discord Auth', params);
    popup?.postMessage('message', window.location.href);
  };

  const checkDiscordAuth = async (code: string) => {
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

      setDiscordUser(discordName);
      onSubmit({ toast: toasts.discordConnectionSuccess });
    } else {
      if (response.status === 409) {
        onSubmit({
          error: true,
          toast: toasts.discordConnectionAlreadyAssociated,
        });
      } else {
        if (code) {
          onSubmit({ error: true, toast: toasts.discordConnectionFailed });
        }
      }
    }
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
    if (publicKey && userToken && address && status === 'active') {
      checkDiscordAuth(discordCode);
    }
  }, [discordCode, publicKey, userToken, address, status]);

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
    complete: discordUser && <Button label={discordUser} size="small" />,
  };

  return (
    <ClaimStep label="Connect your Discord account" step={step} status={status}>
      {content[status]}
    </ClaimStep>
  );
}
