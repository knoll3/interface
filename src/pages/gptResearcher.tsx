import { Layout } from '../components';
import {
  Box,
  Button,
  Heading,
  Paragraph,
  Select,
  Text,
  TextInput,
  InfiniteScroll,
  Layer,
  RangeInput,
  Markdown,
} from 'grommet';
import { Key, useEffect, useState, useContext, createContext } from 'react';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { FLOCK_CREDITS_ABI } from '../contracts/flockCredits';
import { FLOCK_V2_ABI } from '../contracts/flockV2';
import { useCreditsData } from '../hooks/useCreditsData';
import { parseEther } from 'viem';
import { WalletContext } from '../context/walletContext';
import { event } from 'nextjs-google-analytics';
import { Instructions } from '../components/Researcher/Instructions';
import { Research } from '../components/Researcher/Research';
import { Reports } from '../components/Researcher/Reports';

export default function GptResearcherPage() {
  const { address } = useAccount();
  const [task, setTask] = useState<string>('');
  const [reportType, setReportType] = useState({
    label: 'Outline Report',
    value: 'outline_report',
  });
  const [report, setReport] = useState<string>('');
  const [agentOutput, setAgentOutput] = useState<string[]>([]);
  const [downloadLink, setDownloadLink] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [showPurchase, setShowPurchase] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);
  const [isResearching, setIsResearching] = useState<boolean>(false);

  const { FLCTokenBalance, userToken, publicKey } = useContext(WalletContext);

  const { userData, researchPrice, isWhitelisted } = useCreditsData({
    userAddress: address,
  });

  const userBalance = userData
    ? Math.round(Number(userData[3]) * 100) / 100
    : 0;

  const hasAccess =
    userBalance >= price || reportType.value === 'outline_report';

  useEffect(() => {
    if (address) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [address]);

  useEffect(() => {
    setPrice(researchPrice ? Number(researchPrice) : 0);
  }, [researchPrice]);

  const GPTResearcher = (() => {
    const startResearch = () => {
      setIsResearching(true);
      addAgentResponse({
        output:
          '🤔 Too many requests right now, you are in the queue, please be patient.',
      });

      listenToSockEvents();
    };

    const listenToSockEvents = () => {
      // const ws_uri = `wss://researcher.flock.io/ws?token=${userToken}&authKey=${publicKey}`;
      const ws_uri = `ws://localhost/ws?token=${userToken}&authKey=${publicKey}`;
      const socket = new WebSocket(ws_uri);
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'logs') {
          addAgentResponse(data);
        } else if (data.type === 'report') {
          writeReport(data);
        } else if (data.type === 'path') {
          updateDownloadLink(data);
        }
      };

      socket.onopen = (e) => {
        const requestData = {
          task: task,
          report_type: reportType.value,
          agent: 'Auto Agent',
          walletAddress: address,
        };

        event('submit_form_generate_report', requestData);
        socket.send(`start ${JSON.stringify(requestData)}`);
      };
    };

    const addAgentResponse = (data: { output: any }) => {
      setAgentOutput((prev) => [...prev, data.output]);
    };

    const writeReport = (data: { output: any }) => {
      setReport((prev) => prev + data.output);
    };

    const updateDownloadLink = (data: { output: any }) => {
      const position = data.output.search('/output');
      const link = 'https://researcher.flock.io' + data.output.slice(position);
      setDownloadLink(link);
      setIsResearching(false);
    };

    return {
      startResearch,
    };
  })();

  const loadReport = async () => {
    setIsLoadingReport(true);
    try {
      const response = await fetch(`/api/getReport?walletAddress=${address}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { data, message } = await response.json();
      if (message) {
        console.log(message);
        setIsLoadingReport(false);
        return;
      }
      setReport(data.report);
    } catch (e) {
      console.log(e);
    }
    setIsLoadingReport(false);
  };

  const handleSubmit = () => {
    setReport('');
    setDownloadLink("");
    setAgentOutput([]);
    GPTResearcher.startResearch();
  };

  const handleDownload = () => {
    window.open(downloadLink, '_blank');
  };

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
    abi: FLOCK_V2_ABI,
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

  useEffect(() => {
    if (address) {
      loadReport();
    }
  }, [address]);

  return (
    <Layout>
      {showPurchase && (
        <Layer>
          <Box pad="large" align="center" gap="small" width="550px">
            <Heading level="2" margin="xsmall">
              Purchase Credits
            </Heading>
            <Text alignSelf="start" weight="bold">
              Minimum deposit (single research price): {price} credits
            </Text>
            <Text alignSelf="start" weight="bold">
              Your current balance: {userBalance} credits
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
                  disabled={
                    purchaseLoading ||
                    approveLoading ||
                    isApproveTxLoading ||
                    isPurchaseTxLoading ||
                    amount < price
                  }
                  onClick={handleApprove}
                  label={
                    purchaseLoading ||
                    approveLoading ||
                    isApproveTxLoading ||
                    isPurchaseTxLoading
                      ? 'Purchasing...'
                      : 'Purchase'
                  }
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
      <Box width="100%" gap="large" align="center" background="#F8FAFB">
        <Box
          background="#F8FAFB"
          align="center"
          justify="center"
          width="70%"
          pad={{ vertical: 'large', horizontal: 'large' }}
          gap="medium"
          round="small"
          margin={{ vertical: 'large' }}
        >
          <Instructions />
          {
            isConnected ? (
              <>
                <Research />
                <Reports reports={[]} />
              </>
            ) : (
              <Heading level="2" margin="xsmall">
                Connect your wallet to continue
              </Heading>
            )
          }
          <Box gap="medium" width="100%">
            <Box>
              <Text>What would you like me to research next?</Text>
              <TextInput onChange={(e) => setTask(e.target.value)} />
            </Box>
            <Box>
              <Text>What type of report would you like me to generate?</Text>
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
            {reportType.value !== 'outline_report' && (
              <Box round="small" background="white" pad="medium">
                <Text alignSelf="start">
                  To use this model you have to deposit FLC as credits which
                  will be used to pay for research.
                </Text>
                <Text alignSelf="start" weight="bold">
                  Minimum deposit (single research price): {price ? price : 0}{' '}
                  credits
                </Text>
                {isConnected && (
                  <Text alignSelf="start" weight="bold">
                    Your current balance: {userBalance} credits
                  </Text>
                )}
              </Box>
            )}
            <Box>
              {isConnected ? (
                <Button
                  alignSelf="start"
                  primary
                  busy={isResearching}
                  onClick={
                    hasAccess || isWhitelisted
                      ? handleSubmit
                      : () => setShowPurchase(true)
                  }
                  label={
                    hasAccess || isWhitelisted ? 'Research' : 'Purchase Credits'
                  }
                />
              ) : (
                <Heading level="2" margin="xsmall">
                  Connect your wallet to continue
                </Heading>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
