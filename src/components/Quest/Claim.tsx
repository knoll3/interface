import { Box, Button } from 'grommet';
import { useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { WalletContext } from '../../context/walletContext';
import { IStepProps } from '../../pages/quest';
import { toasts } from '../../constants/toastMessages';
import { QuestContext } from '../../context/questContext';
import PressableButton from '../PressableButton';
import QuestStep from './QuestStep';
import { ClaimTag } from '../Tag';

export default function Claim({ showToaster }: IStepProps) {
  const { publicKey, userToken } = useContext(WalletContext);
  const { address } = useAccount();
  const { getStepInfo, nextStep } = useContext(QuestContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(30);

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

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        if (timer > 0) {
          setTimer(timer - 1);
        } else {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLoading, timer]);

  const content: any = {
    disabled: <ClaimTag label="Claim $MATIC & $FLC" type="ghost" />,
    active: (
      <PressableButton
        label="Claim $MATIC & $FLC"
        onClick={handleClaim}
        size="large"
      />
    ),
    complete: (
      <QuestStep step={step} status={status} label="Claim $MATIC & $FLC" />
    ),
  };

  return (
    <Box align="center" gap="small">
      {isLoading ? (
        <ClaimTag label={`${timer}`} type="black" timer />
      ) : (
        content[status]
      )}
    </Box>
  );
}
