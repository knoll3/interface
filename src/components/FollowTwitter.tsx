import { Box, Button } from 'grommet';
import ClaimStep, { ClaimStatus } from './ClaimStep';
import { useIsMounted } from '../hooks';

export default function FollowTwitter({ step, status, nextStep }: any) {
  const mounted = useIsMounted();

  const handleFollowButton = () => {
    // open invite modal
  };

  const handleVerifyButton = () => {
    nextStep()
  };

  if (!mounted) {
    return <></>;
  }

  return (
    <ClaimStep label="Follow @flock_io on Twitter" step={step} status={status}>
      {status === 'active' && (
        <Box direction="row" gap="xsmall">
          <Button
            primary
            label="Follow Now"
            onClick={handleFollowButton}
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
