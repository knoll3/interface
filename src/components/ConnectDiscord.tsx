import { Button } from 'grommet';
import ClaimStep from './ClaimStep';
import { useIsMounted, userDataHook } from '../hooks';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function ConnectDiscord({ step, status, nextStep }: any) {
  const { address } = useAccount();
  const mounted = useIsMounted();
  const { publicKey, userToken } = userDataHook();

  const handleConnectButton = () => {
    const params =
      'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=700,height=800,left=50%,top=50%';
    const url =
      'https://discord.com/api/oauth2/authorize?client_id=1153110663946842162&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth%2Fdiscord&response_type=code&scope=identify%20guilds%20guilds.join';
    const popup = window.open(url, 'Discord Auth', params);
    popup?.postMessage('message', 'https://localhost:3000/quest');
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
      }),
    });

    // TODO - check response success to complete task
    console.log({ response });
    // nextStep();
  };

  useEffect(() => {
    const popupResponse = (event: any) => {
      const discordCode = event?.data?.code;
      if (discordCode) {
        window.removeEventListener('message', popupResponse);
        checkDiscordAuth(discordCode);
      }
    };

    window.addEventListener('message', popupResponse);
    return () => window.removeEventListener('message', popupResponse);
  }, []);

  if (!mounted) {
    return <></>;
  }

  const content = {
    disabled: <></>,
    active: (
      <Button
        primary
        label="Connect Now"
        onClick={handleConnectButton}
        style={{ boxShadow: '3px 4px 0px 0px #000' }}
      />
    ),
    complete: <Button primary label="BrunoSouto" />,
  };

  return (
    <ClaimStep label="Connect your Discord account" step={step} status={status}>
      {content[status]}
    </ClaimStep>
  );
}
