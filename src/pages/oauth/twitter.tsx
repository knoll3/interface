import { useEffect } from 'react';

export default function TwitterOAuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');

    const bc = new BroadcastChannel('twitterChannel');
    bc.postMessage({ accessToken: accessToken });

    window.close();
  }, []);

  return <></>;
}
