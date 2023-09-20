import { Box, Button } from 'grommet';
import ClaimStep, { ClaimStatus } from './ClaimStep';
import { useIsMounted } from '../hooks';

export default function BroadcastTwitter({ step, status, nextStep }: any) {
  const mounted = useIsMounted();

  const handleBroadcastButton = () => {
    // open invite modal
  };

  const handleVerifyButton = () => {
    nextStep();
    // setStatus('complete');
  };

  if (!mounted) {
    return <></>;
  }

  return (
    <ClaimStep
      label="Broadcast your Journey to your mate"
      step={step}
      status={status}
    >
      {status === 'active' && (
        <Box direction="row" gap="xsmall">
          <Button
            primary
            label="Broadcast Now"
            onClick={handleBroadcastButton}
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
