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
  const [report, setReport] = useState<string>('');
  const [agentOutput, setAgentOutput] = useState<string[]>([]);
  const [downloadLink, setDownloadLink] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [showPurchase, setShowPurchase] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);
  const [isResearching, setIsResearching] = useState<boolean>(false);

  const { userToken, publicKey } = useContext(WalletContext);

  const { userData, researchPrice, isWhitelisted } = useCreditsData({
    userAddress: address,
  });

  const userBalance = userData
    ? Math.round(Number(userData[3]) * 100) / 100
    : 0;

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
    const startResearch = (task: string, reportType: string) => {
      setIsResearching(true);
      addAgentResponse({
        output:
          '🤔 Too many requests right now, you are in the queue, please be patient.',
      });

      listenToSockEvents(task, reportType);
    };

    const listenToSockEvents = (task: string, reportType: string) => {
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
          report_type: reportType,
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

  const handleSubmit = (task: string, reportType: string) => {
    setReport('');
    setDownloadLink("");
    setAgentOutput([]);
    GPTResearcher.startResearch(task, reportType);
  };

  const handleDownload = () => {
    window.open(downloadLink, '_blank');
  };

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
                <Research 
                  isResearching={isResearching}
                  handleSubmit={handleSubmit}
                />
                <Reports reports={[]} />
              </>
            ) : (
              <Heading level="2" margin="xsmall">
                Connect your wallet to continue
              </Heading>
            )
          }
        </Box>
      </Box>
    </Layout>
  );
}
