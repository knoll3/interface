import { Button } from 'grommet';
import ClaimStep, { ClaimStatus } from './ClaimStep';
import { useIsMounted } from '../hooks';

export default function ConnectTwitter({ step, status, nextStep }: any) {
  const mounted = useIsMounted();

  const handleConnectButton = () => {
    nextStep()

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
    <ClaimStep label="Connect your Twitter account" step={step} status={status}>
      {content[status]}
    </ClaimStep>
  );
}
