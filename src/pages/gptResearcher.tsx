import { Layout } from "../components";
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
} from 'grommet';
import { Key, useEffect, useState, useContext, createContext } from "react";
import showdown from 'showdown';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import { FLOCK_CREDITS_ABI } from "../contracts/flockCredits";
import { FLOCK_V2_ABI } from "../contracts/flockV2";
import { useCreditsData } from "../hooks/useCreditsData";
import { formatUnits, parseEther } from "viem";
import { event } from "nextjs-google-analytics";


export default function GptResearcherPage() {
    const { address } = useAccount();
    const [task, setTask] = useState<string>("");
    const [reportType, setReportType] = useState<string>("Research Report");
    const [report, setReport] = useState<string>("");
    const [agentOutput, setAgentOutput] = useState<string[]>([]);
    const [downloadLink, setDownloadLink] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [showPurchase, setShowPurchase] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        userData,
        researchPrice,
        tokenAllowance,
        isWhitelisted,
    } = useCreditsData({
        userAddress: address
    });
    
    const userBalance = userData
        ? Math.round(Number(userData[3]) * 100) / 100
        : 0;

    const price = researchPrice
        ? Number(researchPrice)
        : 0;

    const tokenAllowanceValue = tokenAllowance
        ? Number(formatUnits(tokenAllowance, 18))
        : 0;

    const hasAccess = userBalance >= price;

    useEffect(() => {
        if (address) {
            setIsConnected(true);
        }
    }, [address]);

    const GPTResearcher = (() => {
        const startResearch = () => {
          addAgentResponse({ output: "🤔 Too many requests right now, you are in the queue, please be patient." });
      
          listenToSockEvents();
        };
      
        const listenToSockEvents = () => {
          // const ws_uri = 'ws://209.20.157.253:8080/ws';
          const ws_uri = 'ws://0.0.0.0:8000/ws'
          const converter = new showdown.Converter();
          const socket = new WebSocket(ws_uri);
          socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'logs') {
              addAgentResponse(data);
            } else if (data.type === 'report') {
              writeReport(data, converter);
            } else if (data.type === 'path') {
              updateDownloadLink(data);
            }
          };
      
          socket.onopen = (event) => {
      
            const requestData = {
              task: task,
              report_type: reportType,
              agent: "Auto Agent",
              walletAddress: address,
            };
      
            socket.send(`start ${JSON.stringify(requestData)}`);
          };
        };
      
        const addAgentResponse = (data: { output: any; }) => {
          setAgentOutput((prev) => [...prev, data.output]);
          updateScroll();
        };
      
        const writeReport = (data: { output: any; }, converter: { makeHtml: (arg0: any) => any; }) => {
            console.log(data.output);
            const markdownOutput = converter.makeHtml(data.output);
            console.log(markdownOutput);
          setReport((prev) => prev + ' ' + markdownOutput);
          updateScroll();
        };
      
        const updateDownloadLink = (data: { output: any; }) => {
          setDownloadLink(data.output);
        };
      
        const updateScroll = () => {
          window.scrollTo(0, document.body.scrollHeight);
        };
      
        return {
          startResearch,
        };
      })();
    

    const handleSubmit = () => {
        setReport("");
        setAgentOutput([]);
        GPTResearcher.startResearch();
    };

    const handleDownload = () => {
        window.open(downloadLink, '_blank');
    };

    const { data: purchaseCredits, writeAsync: writePurchaseCredits, isLoading: purchaseLoading } = useContractWrite({
        address: process.env.NEXT_PUBLIC_FLOCK_CREDITS_ADDRESS as `0x${string}`,
        abi: FLOCK_CREDITS_ABI,
        functionName: 'addCredits',
    });

    const { data: approveTokens, writeAsync: writeApproveTokens, isLoading: approveLoading } = useContractWrite({
        address: process.env.NEXT_PUBLIC_FLOCK_TOKEN_V2_ADDRESS as `0x${string}`,
        abi: FLOCK_V2_ABI,
        functionName: 'approve',
    });

    const { isSuccess: isSuccessApprove } = useWaitForTransaction({
        hash: approveTokens?.hash,
    });

    const { isSuccess: isSuccessPurchase } = useWaitForTransaction({
        hash: purchaseCredits?.hash,
    });

    const handleApprove = async () => {
        await writeApproveTokens?.({ args: [process.env.NEXT_PUBLIC_FLOCK_CREDITS_ADDRESS as `0x${string}`, parseEther(`${amount}`)]});
    }

    const handlePurchase = async () => {
        await writePurchaseCredits?.({ args: [amount]});
        setShowPurchase(false);
    }  

    return (
        <Layout>
            { showPurchase &&
                <Layer>
                    <Box pad="large" align="center" gap="small" width="550px">
                        <Heading level="2" margin="xsmall">Purchase Credits</Heading>
                        <Text alignSelf="start">To use this model you have to deposit FLO as credits which will be used to pay for research.</Text>
                        <Text alignSelf="start" weight="bold">Minimum deposit (single research price): {price} credits</Text>
                        <Text alignSelf="start" weight="bold">Your current balance: {userBalance} credits</Text>
                        <Box direction="row" align="center" gap="small">
                            <Button
                                primary
                                disabled={purchaseLoading || approveLoading || amount < price}
                                onClick={(tokenAllowanceValue >= price) ? handlePurchase : handleApprove}
                                label={
                                    (purchaseLoading || approveLoading) ? 
                                        (tokenAllowanceValue >= price) ? 
                                            "Purchasing..." : "Approving..." 
                                        : (tokenAllowanceValue >= price) ? 
                                            "Purchase" : "Approve Tokens"
                                    }
                            />
                            <TextInput type="number" placeholder="Amount" onChange={(event) => setAmount(Number(event.target.value))} />
                        </Box>
                        <Button
                            margin={{ top: 'medium' }}
                            alignSelf="end"
                            secondary
                            disabled={purchaseLoading || approveLoading}
                            onClick={() => setShowPurchase(false)}
                            label="Close"
                        />
                    </Box>
                </Layer>
            }
            <Box width="100%" gap="large" align="center">
                <Box
                    background="#EEEEEE"
                    align="center"
                    justify="center"
                    width="50%"
                    pad={{ vertical: 'large', horizontal: 'large' }}
                    gap="medium"
                    round="small"
                    margin={{ vertical: 'large' }}
                >
                    <Box
                        round="small"
                        background="white"
                        pad="medium"
                    >
                        <Paragraph fill>
                            Introducing the "FLock Researcher" - an unparalleled multi-agent engine meticulously crafted by the experts at FLock.io. This isn't just another AI model; it's an amalgamation of domain-specific expertise funneled through our unique FLock platform for collaborative finetuning. The result? An agent that outperforms generic pretrained open-source models in terms of proficiency and precision.
                        </Paragraph>
                        <Paragraph fill>
                            At the heart of our innovation lies the agent engine, which transcends the capabilities of traditional pretrained models, offering a more robust, versatile, and dynamic solution. A special thank you to the GPTResearch team for providing the foundational engine that enabled us to deploy our visionary FLock system.
                        </Paragraph>
                        <Paragraph fill>
                            We're inviting you to experience the next evolution in AI. Dive in, try out the FLock Researcher, and witness the future of multi-agent interactions
                        </Paragraph>
                    </Box>
                    <Box gap="medium" width="100%">
                        <Box>
                            <Text>What would you like me to research next?</Text>
                            <TextInput onChange={(e) => setTask(e.target.value)} />
                        </Box>
                        <Box>
                            <Text>What type of report would you like me to generate?</Text>
                            <Select 
                                options={['Research Report', 'Resource Report', 'Outline Report']}
                                value={reportType} 
                                onChange={({option}) => setReportType(option)} 
                            />
                        </Box>
                        <Box>
                            { isConnected ?
                                <Button
                                    alignSelf="start"
                                    primary
                                    onClick={(hasAccess || isWhitelisted) ? handleSubmit : () => setShowPurchase(true)}
                                    label={"Research"}
                                />
                                :
                                <Heading level="2" margin="xsmall">Connect your wallet to continue</Heading>
                            }
                        </Box>
                        {
                            isConnected && (hasAccess || isWhitelisted) &&
                            <Box>
                                <Box width="100%">
                                    <Heading level="2" margin="xsmall">Agents Output</Heading>
                                    <Text>
                                        An agent tailored specifically to your task will be generated to provide the most precise and relevant research results.
                                    </Text>
                                    <Box
                                        height="medium"
                                        overflow="auto" 
                                        width="100%"
                                        border 
                                        round="small"
                                        pad="small"
                                    >
                                        <InfiniteScroll items={agentOutput} show={agentOutput.length}>
                                            { (item: any, index: Key | null | undefined) => (
                                                <Box 
                                                    width="100%" 
                                                    key={index} 
                                                    border 
                                                    round="small" 
                                                    flex={false}
                                                    margin={{ bottom: 'small' }}
                                                    pad="small"
                                                    background='#EEEEEE'
                                                >
                                                    <Text>{item}</Text>
                                                </Box>                                
                                            )}
                                        </InfiniteScroll>
                                    </Box>
                                </Box>
                                <Box width="100%" margin={{ top: 'medium' }} gap="small">
                                    <Heading level="2" margin="xsmall">Research Report</Heading>
                                    <Box width="100%" border height={{min: '30px'}} round="small">
                                        <Text>{report}</Text>
                                    </Box>
                                    <Box direction="row-responsive" gap="small">
                                        <Button
                                            alignSelf="start"
                                            primary
                                            onClick={() => navigator.clipboard.writeText(report)}
                                            label="Copy to clipboard"
                                        />
                                        <Button
                                            alignSelf="start"
                                            primary
                                            onClick={handleDownload}
                                            label="Download as PDF"
                                        />
                                    </Box>
                                </Box>  
                            </Box>
                        }  
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
}