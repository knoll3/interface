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
import { useCreditsData } from '../hooks/useCreditsData';
import { WalletContext } from '../context/walletContext';
import { event } from 'nextjs-google-analytics';
import { Instructions } from '../components/Researcher/Instructions';
import { Research } from '../components/Researcher/Research';
import { Reports } from '../components/Researcher/Reports';
import { Logo } from '../components/Researcher/Logo';

export default function GptResearcherPage() {
  const { address } = useAccount();
  const [report, setReport] = useState<string>('');
  const [reportType, setReportType] = useState({
    label: 'Research Report',
    value: 'research_report',
  });
  const [agentOutput, setAgentOutput] = useState<string[]>([]);
  const [downloadLink, setDownloadLink] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);
  const [isResearching, setIsResearching] = useState<boolean>(false);

  const { userToken, publicKey } = useContext(WalletContext);

  const { userData, researchPrice, isWhitelisted } = useCreditsData({
    userAddress: address,
  });

  useEffect(() => {
    if (address) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [address]);

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
          <Logo />
          <Instructions />
          {isConnected && (
            <>
              <Research 
                isResearching={isResearching}
                reportType={reportType}
                setReportType={setReportType}
                handleSubmit={handleSubmit}
              />
              { reportType.value === "outline_report" ? (
                <Box 
                    pad={{ vertical: 'large', horizontal: 'large' }}
                    gap="medium"
                    fill="horizontal"              
                >
                    <Heading level="2" margin="xsmall">
                      Research Report
                    </Heading>
                    <Box
                      width="100%"
                      border
                      height={{ min: '30px' }}
                      round="small"
                    >
                      <Box pad="small">
                        <Markdown components={{ p: Text }}>
                          {report ? report : ''}
                        </Markdown>
                      </Box>
                    </Box>
                    <Button
                      alignSelf="end"
                      disabled={!report || isResearching}
                      primary
                      onClick={() => navigator.clipboard.writeText(report)}
                      label="Copy to clipboard"
                    />
                </Box>
              ) : (
                <Reports reports={[]} />
              )}
            </>
          )}
          {!isConnected && (
              <Heading level="2" margin="xsmall">
                Connect your wallet to continue
              </Heading>
          )}
        </Box>
      </Box>
    </Layout>
  );
}
