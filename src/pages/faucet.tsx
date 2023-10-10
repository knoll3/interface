import {
  Box,
  Button,
  Form,
  FormField,
  Heading,
  Paragraph,
  TextInput,
  Text,
} from 'grommet';
import { Layout, PrimaryButton, Tasks } from '../components';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import { FLOCK_ABI } from '../contracts/flock';
import { FLOCK_V2_ABI } from '../contracts/flockV2';
import { MIGRATE_TOKENS_ABI } from '../contracts/migrateTokens';
import { use, useEffect, useState, useContext } from 'react';
import { WalletContext } from '../context/walletContext';
import { useIsMounted } from '../hooks';

export default function FaucetPage() {
  const { address } = useAccount();
  const [errors, setErrors] = useState<any>({});
  const [disabled, setDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { FLCTokenBalance, FLOTokenBalance } = useContext(WalletContext);

  const mounted = useIsMounted();

  // const { data, write } = useContractWrite({
  //   address: process.env.NEXT_PUBLIC_FLOCK_TOKEN_ADDRESS as `0x${string}`,
  //   abi: FLOCK_ABI,
  //   functionName: 'mint',
  // });

  const { data: dataMigrate, write: writeMigrate } = useContractWrite({
    address: process.env.NEXT_PUBLIC_MIGRATE_TOKENS_ADDRESS as `0x${string}`,
    abi: MIGRATE_TOKENS_ABI,
    functionName: 'migrate',
  });

  const { data: dataApprove, write: writeApprove } = useContractWrite({
    address: process.env.NEXT_PUBLIC_FLOCK_TOKEN_ADDRESS as `0x${string}`,
    abi: FLOCK_ABI,
    functionName: 'approve',
  });

  const { isSuccess: isSuccessMigrate, isLoading: isLoadingMigrate } =
    useWaitForTransaction({
      hash: dataMigrate?.hash,
    });

  const { isSuccess: isSuccessApprove, isLoading: isLoadingApprove } =
    useWaitForTransaction({
      hash: dataApprove?.hash,
    });

  // const handleMint = async () => {
  //   write?.({ args: [address, amount * 10 ** 18] });
  // };

  const handleApprove = async () => {
    setIsLoading(true);
    writeApprove?.({
      args: [
        process.env.NEXT_PUBLIC_MIGRATE_TOKENS_ADDRESS as `0x${string}`,
        FLCTokenBalance.value,
      ],
    });
  };

  useEffect(() => {
    if (isSuccessApprove) {
      writeMigrate?.();
    }
    if (isSuccessMigrate) {
      setIsLoading(false);
    }
  }, [isSuccessApprove, isSuccessMigrate]);

  const hasErrors = Object.keys(errors).length > 0;

  useEffect(() => {
    setDisabled(!address || hasErrors || isLoading);
  }, [address, isLoading]);

  const roundedFLCBalance = FLCTokenBalance
    ? Math.round(Number(FLCTokenBalance.formatted) * 100) / 100
    : 0;

  if (!mounted) {
    return <></>;
  }

  return (
    <Layout>
      <Box width="100%" gap="large">
        <Box
          background="#EEEEEE"
          direction="row-responsive"
          align="center"
          justify="center"
          width="100%"
          pad={{ vertical: 'large', horizontal: 'large' }}
        >
          <Box>
            <Box direction="row-responsive" gap="xsmall">
              <Heading level="2">FLock (FLO) tokens faucet </Heading>
            </Box>
            <Paragraph>
              Migrate your FLC to FLO tokens for participating in the FLock
              network.
            </Paragraph>
            <Paragraph>
              {roundedFLCBalance} FLC tokens available to migrate.
            </Paragraph>
          </Box>
        </Box>
        <Box
          width="100%"
          align="center"
          pad="large"
          background="white"
          justify="center"
          round="small"
        >
          <Box direction="row" align="end" justify="end">
            <Button
              primary
              onClick={handleApprove}
              disabled={disabled || roundedFLCBalance === 0}
              label={isLoading ? 'Migrating...' : 'Migrate'}
            />
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
