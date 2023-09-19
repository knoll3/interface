import { Button, Text } from 'grommet';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function DiscordOAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const discordCode = params.get('code');

    localStorage.setItem('discordCode', discordCode!);
    router.push('/quest');
  }, []);

  return <></>;
}
