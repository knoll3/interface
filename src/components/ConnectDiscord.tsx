import { Button } from 'grommet';
import ClaimStep, { ClaimStatus } from './ClaimStep';
import { useIsMounted, userDataHook } from '../hooks';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function ConnectDiscord({ step, status, nextStep }: any) {
  const { address } = useAccount();
  const mounted = useIsMounted();
  const { publicKey } = userDataHook();

  const handleConnectButton = () => {
    document.location.href =
      'https://discord.com/api/oauth2/authorize?client_id=1153110663946842162&redirect_uri=http%3A%2F%2Flocalhost:3000%2Foauth%2Fdiscord&response_type=code&scope=identify%20guilds%20guilds.members.read';
  };

  const checkDiscordAuth = async (code: string) => {
    const response = await fetch('/api/quest/oauth/discord', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publicKey}`,
      },
      body: JSON.stringify({ code, wallet: address }),
    });

    // TODO - check response success to complete task
    console.log({ response });
    nextStep()
  };

  useEffect(() => {
    const discordCode = localStorage.getItem('discordCode');
    if (discordCode) {
      checkDiscordAuth(discordCode);
    }
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
