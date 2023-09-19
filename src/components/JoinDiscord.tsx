import { Box, Button } from 'grommet';
import ClaimStep, { ClaimStatus } from './ClaimStep';
import { useIsMounted } from '../hooks';
import { useState } from 'react';

export default function JoinDiscord() {
  const mounted = useIsMounted();

  const [status, setStatus] = useState<ClaimStatus>('active');

  const handleJoinButton = () => {
    // open invite modal
  };

  const handleVerifyButton = () => {
    setStatus('complete');
  };

  if (!mounted) {
    return <></>;
  }

  return (
    <ClaimStep
      label="Join our Discord and acquire a role"
      step={3}
      status={status}
    >
      {status !== 'complete' && (
        <Box direction="row" gap="xsmall">
          <Button
            primary
            label="Join Now"
            onClick={handleJoinButton}
            style={{ boxShadow: '3px 4px 0px 0px #000' }}
          />
          <Button
            secondary
            label="Verify"
            onClick={handleVerifyButton}
            style={{ boxShadow: '3px 4px 0px 0px #000' }}
          />
        </Box>
      )}
    </ClaimStep>
  );
}
