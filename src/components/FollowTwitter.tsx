import { Box, Button } from 'grommet';
import ClaimStep from './ClaimStep';
import { useIsMounted } from '../hooks';
import TimerButton from './TimerButton';
import { toasts } from '../constants/toastMessages';
import { IStepProps } from '../pages/quest';

export default function FollowTwitter({ step, status, onSubmit }: IStepProps) {
  const mounted = useIsMounted();

  const handleFollowButton = () => {
    // open invite modal
  };

  const handleVerifyButton = () => {
    onSubmit({ toast: toasts.twitterConnectionSuccess });
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
          <TimerButton label="Verify" onClick={handleVerifyButton} />
        </Box>
      )}
    </ClaimStep>
  );
}
