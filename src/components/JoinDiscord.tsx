import { Box, Button } from 'grommet';
import ClaimStep from './ClaimStep';
import { useIsMounted } from '../hooks';
import TimerButton from './TimerButton';

export default function JoinDiscord({ step, status, nextStep }: any) {
  const mounted = useIsMounted();

  const handleJoinButton = () => {
    // open invite modal
  };

  const handleVerifyButton = () => {};

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
          <TimerButton label="Verify" onClick={handleVerifyButton} />
        </Box>
      )}
    </ClaimStep>
  );
}
