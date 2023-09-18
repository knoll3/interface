import { Button } from 'grommet';
import ClaimStep, { ClaimStatus } from './ClaimStep';
import { useIsMounted } from '../hooks';
import { useState } from 'react';

export default function ConnectDiscord() {
  const mounted = useIsMounted();

  const [status, setStatus] = useState<ClaimStatus>('active');

  const handleConnectButton = () => {
    setStatus('complete');
    window.open(
      'https://discord.com/api/oauth2/authorize?client_id=1153110663946842162&redirect_uri=http://localhost:3000/api/quest/discord-callback&response_type=code&scope=identify',
      '_blank'
    );
  };

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
    <ClaimStep label="Connect your Discord account" step={2} status={status}>
      {content[status]}
    </ClaimStep>
  );
}
