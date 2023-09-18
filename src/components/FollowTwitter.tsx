import { Box, Button } from 'grommet';
import ClaimStep from './ClaimStep';
import { useIsMounted } from '../hooks';
import { useState } from 'react';

export default function FollowTwitter() {
  const mounted = useIsMounted();

  const [status, setStatus] = useState<String>('active');

  const handleFollowButton = () => {
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
      label="Follow @flock_io on Twitter"
      step={5}
      status={status}
    >
      {status !== 'complete' && (
        <Box direction="row" gap="xsmall">
          <Button primary label="Follow Now" onClick={handleFollowButton} style={{boxShadow: '3px 4px 0px 0px #000'}} />
          <Button secondary label="Verify" onClick={handleVerifyButton} style={{boxShadow: '3px 4px 0px 0px #000'}} />
        </Box>
      )}
    </ClaimStep>
  );
}
