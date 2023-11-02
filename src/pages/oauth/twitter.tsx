import { useEffect } from 'react';

export default function TwitterOAuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const expiresAt = params.get('expiresAt');

    const bc = new BroadcastChannel('twitterChannel');
    bc.postMessage({ accessToken: accessToken, expiresAt: expiresAt });

    window.close();
  }, []);

  return <></>;
}
