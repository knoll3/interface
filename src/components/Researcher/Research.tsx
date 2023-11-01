import { Box, Button, Heading, Layer, RangeInput, Select, Text, TextInput } from 'grommet';
import { PrimaryButton } from '../PrimaryButton';
import { useState, useContext, useEffect } from 'react';
import { useCreditsData } from '../../hooks/useCreditsData';
import { WalletContext } from '../../context/walletContext';
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import { FLOCK_CREDITS_ABI } from '@/src/contracts/flockCredits';
import { FLOCK_ABI } from '@/src/contracts/flock';
import { parseEther } from 'viem';

export const Research = ({
    isResearching,
    handleSubmit,
}:{
    isResearching: boolean,
    handleSubmit: (task: string, reportType: string) => void,
}) => {
    const [showPurchase, setShowPurchase] = useState(false);
    const [amount, setAmount] = useState<number>(0);
    const [task, setTask] = useState<string>('');
    const [reportType, setReportType] = useState({
      label: 'Research Report',
      value: 'research_report',
    });
      const { address } = useAccount();

    const { FLCTokenBalance } = useContext(WalletContext);
    const { userData, researchPrice, isWhitelisted } = useCreditsData({
        userAddress: address,
    });

    const userBalance = userData
        ? Math.round(Number(userData[3]) * 100) / 100
        : 0;
    const price = researchPrice ? Number(researchPrice) : 0;
    const numberOfResearchesAvailable = Math.trunc(userBalance / price);

    const hasAccess = reportType.value === 'outline_report' || numberOfResearchesAvailable > 0

    const {
        data: purchaseCredits,
        write: writePurchaseCredits,
        isLoading: purchaseLoading,
      } = useContractWrite({
        address: process.env.NEXT_PUBLIC_FLOCK_CREDITS_ADDRESS as `0x${string}`,
        abi: FLOCK_CREDITS_ABI,
        functionName: 'addCredits',
      });
    
      const {
        data: approveTokens,
        write: writeApproveTokens,
        isLoading: approveLoading,
      } = useContractWrite({
        address: process.env.NEXT_PUBLIC_FLOCK_TOKEN_ADDRESS as `0x${string}`,
        abi: FLOCK_ABI,
        functionName: 'approve',
      });
    
      const { isSuccess: isSuccessApprove, isLoading: isApproveTxLoading } =
        useWaitForTransaction({
          hash: approveTokens?.hash,
        });
    
      const { isSuccess: isSuccessPurchase, isLoading: isPurchaseTxLoading } =
        useWaitForTransaction({
          hash: purchaseCredits?.hash,
        });
    
      const handleApprove = () => {
        writeApproveTokens?.({
          args: [
            process.env.NEXT_PUBLIC_FLOCK_CREDITS_ADDRESS as `0x${string}`,
            parseEther(`${amount}`),
          ],
        });
      };
    
      const handlePurchase = () => {
        writePurchaseCredits?.({ args: [amount] });
      };
    
      useEffect(() => {
        if (isSuccessApprove) {
          handlePurchase();
        }
    
        if (isSuccessPurchase) {
          setShowPurchase(false);
        }
      }, [isSuccessPurchase, isSuccessApprove]);
    

    useEffect(() => {
        setAmount(price);
      }, [price]);

  return (
    <>
        {showPurchase && (
            <Layer>
                <Box pad="large" align="center" gap="small" width="550px">
                    <Heading level="2" margin="xsmall">
                        Purchase Reports
                    </Heading>
                    <Text alignSelf="start" weight="bold">
                        Single research report costs $FLC {price}     
                    </Text>
                    {Number(FLCTokenBalance?.formatted) < price ? (
                        <Text weight="bold" alignSelf="start" color="red">
                            Not enough FLC to purchase credits
                        </Text>
                    ) : (
                        <Box
                            width="100%"
                            direction="row"
                            justify="between"
                            align="center"
                        >
                            <Button
                            primary
                            busy={
                                purchaseLoading ||
                                approveLoading ||
                                isApproveTxLoading ||
                                isPurchaseTxLoading
                            }
                            disabled={amount < price}
                            onClick={handleApprove}
                            label="Purchase"
                            />
                            <Box direction="row" gap="small" width="65%">
                            <Text weight="bold">{amount}</Text>
                            <RangeInput
                                size={30}
                                value={amount}
                                min={price}
                                max={Number(FLCTokenBalance?.formatted)}
                                step={price}
                                onChange={(event) => setAmount(Number(event.target.value))}
                            />
                            </Box>
                        </Box>
                    )}
                    <Button
                    margin={{ top: 'medium' }}
                    alignSelf="end"
                    secondary
                    disabled={
                        purchaseLoading ||
                        approveLoading ||
                        isApproveTxLoading ||
                        isPurchaseTxLoading
                    }
                    onClick={() => setShowPurchase(false)}
                    label="Close"
                    />
                </Box>
            </Layer>
        )}

        <Box
            pad={{ vertical: 'large', horizontal: 'large' }}
            gap="medium"
            fill="horizontal"
        >
            <Box>
                <Box>
                    <Heading level="2" margin="none" weight="bold">Step 1: Research & Download Reports</Heading>
                    {reportType.value !== 'outline_report' &&
                        <Text>
                            <span>&#42;</span> You need to pay <b>$FLC{price}</b> for single research. You have <b>{numberOfResearchesAvailable}</b> researches left.
                        </Text>
                    }
                </Box>
            </Box>
            <Box gap="small">
                <Box>
                <Text>What would you like me to research next?</Text>
                <Box background="white">
                    <TextInput onChange={(e) => setTask(e.target.value)} />
                </Box>
                </Box>
                <Box>
                    <Text>What type of report would you like me to generate?</Text>
                    <Box background="white">
                        <Select
                            options={[
                            { label: 'Outline Report', value: 'outline_report' },
                            { label: 'Research Report', value: 'research_report' },
                            { label: 'Resource Report', value: 'resource_report' },
                            ]}
                            value={reportType.value}
                            valueLabel={<Box pad="small">{reportType.label}</Box>}
                            onChange={({ option }) => setReportType(option)}
                            disabled={isResearching}
                        />
                    </Box>
                </Box>
            </Box>
            <Box justify="end" align="end">
                <PrimaryButton
                    label={hasAccess ? "Research" : "Pay and research"} 
                    busy={isResearching}
                    onClick={
                        hasAccess
                          ? () => handleSubmit(task, reportType.value)
                          : () => setShowPurchase(true)
                      }
                    />
            </Box>
        </Box>
    </>
  );
};
