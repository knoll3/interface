import { Button } from 'grommet';
import ClaimStep, { ClaimStatus } from './ClaimStep';
import { useIsMounted } from '../hooks';
import { useState } from 'react';

export default function ConnectTwitter() {
  const mounted = useIsMounted();

  const [status, setStatus] = useState<ClaimStatus>('active');

  const handleConnectButton = () => {
    setStatus('complete');

    // connect twitter
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
    complete: <Button primary label="@BrunoSouto" />,
  };

  return (
    <ClaimStep label="Connect your Twitter account" step={4} status={status}>
      {content[status]}
    </ClaimStep>
  );
}
