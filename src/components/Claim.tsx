import { Box, Button } from 'grommet';
import { useContext, useState } from 'react';
import { useAccount } from 'wagmi';
import { WalletContext } from '../context/walletContext';
import { IStepProps } from '../pages/quest';
import { toasts } from '../constants/toastMessages';
import Tag from './Tag';
import { QuestContext } from '../context/questContext';
import PressableButton from './PressableButton';
import QuestStep from './QuestStep';

export default function Claim({ showToaster }: IStepProps) {
  const { publicKey, userToken } = useContext(WalletContext);
  const { address } = useAccount();
  const { getStepInfo, nextStep } = useContext(QuestContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const STEP_NAME = 'claim_reward';
  const { status, step } = getStepInfo(STEP_NAME);

  const handleClaim = async () => {
    setIsLoading(true);
    const response = await fetch('/api/quest/claimReward', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        auth_key: publicKey,
        walletAddress: (address as string)?.toLocaleLowerCase(),
      }),
    });

    setIsLoading(false);
    const data = await response.json();
    console.log({ data });

    if (response.status === 200) {
      nextStep(STEP_NAME);
      showToaster({ toast: toasts.claimSuccess });
    } else {
      showToaster({ toast: toasts.claimFailed });
    }
  };

  const content: any = {
    disabled: <Tag label="Claim $MATIC & $FLC" type="ghost" />,
    active: (
      <PressableButton label="Claim $MATIC & $FLC" onClick={handleClaim} />
    ),
    complete: (
      <QuestStep step={step} status={status} label="Claim $MATIC & $FLC" />
    ),
  };

  return (
    <Box align="center" gap="small">
      {isLoading ? (
        <Tag label="Claim $MATIC & $FLC" type="black" />
      ) : (
        content[status]
      )}
    </Box>
  );
}
