import { Box, Button } from 'grommet';
import ClaimStep from './ClaimStep';
import { useIsMounted } from '../hooks';
import TimerButton from './TimerButton';
import { toasts } from '../constants/toastMessages';
import { IStepProps } from '../pages/quest';

export default function JoinDiscord({ step, status, onSubmit }: IStepProps) {
  const mounted = useIsMounted();

  const handleVerifyButton = () => {
    onSubmit({ toast: toasts.discordConnectionSuccess });
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
            href={process.env.NEXT_PUBLIC_DISCORD_CHANNEL_LINK}
            style={{ boxShadow: '3px 4px 0px 0px #000' }}
            target="_blank"
          />
          <TimerButton label="Verify" onClick={handleVerifyButton} />
        </Box>
      )}
    </ClaimStep>
  );
}
