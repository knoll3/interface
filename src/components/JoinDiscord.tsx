import { Box, Button } from 'grommet';
import ClaimStep, { ClaimStatus } from './ClaimStep';
import { useIsMounted } from '../hooks';

export default function JoinDiscord({ step, status, nextStep }: any) {
  const mounted = useIsMounted();

  const handleJoinButton = () => {
    // open invite modal
  };

  const handleVerifyButton = () => {
    nextStep()
  };

  if (!mounted) {
    return <></>;
  }

  return (
    <ClaimStep
      label="Join our Discord and acquire a role"
      step={step}
      status={status}
    >
      {status === 'active' && (
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
