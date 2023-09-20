import { useEffect } from 'react';

export default function DiscordOAuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const discordCode = params.get('code');

    window.opener.postMessage(
      { code: discordCode },
      `${window.location.origin}/quest`
    );
    window.close();
  }, []);

  return <></>;
}
