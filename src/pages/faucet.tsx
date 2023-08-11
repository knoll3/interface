import { Box, Form, FormField, Heading, Paragraph, TextInput, Text } from 'grommet';
import { Layout, PrimaryButton, Tasks } from '../components';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { FLOCK_ABI } from '../contracts/flock';
import { useState } from 'react';

export default function FaucetPage() {
  const { address, isDisconnected } = useAccount();
  const [amount, setAmount] = useState(0);
  const [errors, setErrors] = useState<any>({});

  const { config, error } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_FLOCK_TOKEN_ADDRESS as `0x${string}`,
    abi: FLOCK_ABI,
    functionName: 'mint',
    args: [address, amount * 10 ** 18],
  });
  const { writeAsync } = useContractWrite(config);

  const handleMint = async () => {
    await writeAsync?.();
    setAmount(0);
  };

  const hasErrors = Object.keys(errors).length > 0;

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
              <Heading level="2">FLock (FLC) tokens faucet </Heading>
            </Box>
            <Paragraph>
              Mint your FLC tokens for participating in the FLock network.
            </Paragraph>
            <Paragraph>
              Contract Address:{' '}
              <Text wordBreak="break-word">{process.env.NEXT_PUBLIC_FLOCK_TOKEN_ADDRESS}</Text>
            </Paragraph> 
          </Box>
        </Box>
        <Box width="100%" align="center" pad="large">
          <Form
            onValidate={(validationResults) => {
              setErrors(validationResults.errors);
            }}
          >
            <FormField
              name="amount"
              htmlFor="amount"
              label="Amount"
              required
              validateOn="blur"
            >
              <TextInput
                type="number"
                id="amount"
                name="amount"
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </FormField>
            <PrimaryButton
              onClick={handleMint}
              disabled={isDisconnected || amount === 0 || hasErrors}
              margin={{ top: 'medium' }}
              label="Mint"
              size="medium"
              pad={{ vertical: 'small', horizontal: 'xlarge' }}
            />
          </Form>
        </Box>
      </Box>
    </Layout>
  );
}
