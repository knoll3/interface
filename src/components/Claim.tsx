import { Box, Button } from 'grommet';
import { useContext } from 'react';
import { useAccount } from 'wagmi';
import { WalletContext } from '../context/walletContext';
import { IStepProps } from '../pages/quest';
import { toasts } from '../constants/toastMessages';

export default function Claim({ showToaster }: IStepProps) {
  const handleClaim = async () => {
    const { address } = useAccount();
    const { publicKey, userToken } = useContext(WalletContext);

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
    const data = await response.json();
    console.log({ data });

    if (response.status === 200) {
      showToaster({ toast: toasts.claimSuccess });
    } else {
      showToaster({ toast: toasts.claimFailed });
    }
  };

  return (
    <Box align="center" gap="small">
      <Button
        secondary
        label="Claim $MATIC & $FLC"
        size="small"
        onClick={handleClaim}
      />
    </Box>
  );
}
