import { useEffect } from 'react';

export default function TwitterOAuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const twitterCode = params.get('code');

    const bc = new BroadcastChannel('twitterChannel');
    bc.postMessage({ code: twitterCode });

    window.close();
  }, []);

  return <></>;
}
