import { Layout } from '../components';
import {
  Box,
  Heading,
} from 'grommet';
import { useEffect, useState, useContext, createContext } from 'react';
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
import { ReportOutput } from '../components/Researcher/ReportOutput';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_ANON_KEY as string,
)

type ReportProps = {
  reportType: string;
  reportTitle: string;
  reportLink: string;
}

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

  const [loadedReports, setLoadedReports] = useState<ReportProps[]>([]);

  const { userToken, publicKey } = useContext(WalletContext);

  const { userData, researchPrice, isWhitelisted } = useCreditsData({
    userAddress: address,
  });

  const agentLabels = [
    'News Agent',
    'Maths Agent',
    'Physicist Agent',
    'Financial Analyst Agent',
    'Real Estate Agent',
  ];

  async function getReports() {

    const reports : ReportProps[] = [];

    agentLabels.forEach(async (agentLabel) => {

      const { data, error } = await supabase.storage.from('researcher-reports').list(address + '/' + agentLabel, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });
      if (data?.length === 0 || error) {
        return;
      }
      reports.push({
        reportType: "Research Report",
        reportTitle: "Research",
        reportLink: data[0].name,
      });
    })
    setLoadedReports(reports);
  }

  useEffect(() => {
    if (address) {
      setIsConnected(true);
      getReports();
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
      getReports();
      setIsResearching(false);
    };

    return {
      startResearch,
    };
  })();

  const handleSubmit = (task: string, reportType: string) => {
    setReport('');
    setDownloadLink("");
    setAgentOutput([]);
    GPTResearcher.startResearch(task, reportType);
  };

  useEffect(() => {
    setReport('');
  }, [reportType]);

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
          {isConnected ? (
            <>
              <Research 
                isResearching={isResearching}
                reportType={reportType}
                setReportType={setReportType}
                handleSubmit={handleSubmit}
              />
              { reportType.value === "outline_report" ? (
                <ReportOutput
                  report={report}
                  isResearching={isResearching}
                />
              ) : (
                <Reports 
                supabase={supabase}
                  userAddress={address}
                  reports={loadedReports}
                />
              )}
            </>
          ) : (
            <Heading level="2" margin="xsmall">
              Connect your wallet to continue
            </Heading>
          )}
        </Box>
      </Box>
    </Layout>
  );
}
