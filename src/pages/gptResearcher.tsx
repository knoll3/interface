import { Layout } from "../components";
import {
    Box,
    Button,
    Footer,
    Form,
    Heading,
    Main,
    Paragraph,
    Select,
    Text,
    TextArea,
    TextInput,
    InfiniteScroll, 
} from 'grommet';
import { Key, useState } from "react";
import showdown from 'showdown';

export default function GptResearcherPage() {
    const [task, setTask] = useState<string>("");
    const [reportType, setReportType] = useState<string>("Research Report");
    const [report, setReport] = useState<string>("");
    const [agentOutput, setAgentOutput] = useState<string[]>([]);
    const [downloadLink, setDownloadLink] = useState<string>("");

    const GPTResearcher = (() => {
        const startResearch = () => {
          addAgentResponse({ output: "🤔 Too many requests right now, you are in the queue, please be patient." });
      
          listenToSockEvents();
        };
      
        const listenToSockEvents = () => {
          const ws_uri = 'ws://209.20.157.253:8080/ws';
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
    }

    return (
        <Layout>
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
                    <Box width="100%">
                        <Text>What would you like me to research next?</Text>
                        <TextInput onChange={(e) => setTask(e.target.value)} />
                    </Box>
                    <Box width="100%">
                        <Text>What type of report would you like me to generate?</Text>
                        <Select 
                            options={['Research Report', 'Resource Report', 'Outline Report']}
                            value={reportType} 
                            onChange={({option}) => setReportType(option)} 
                        />
                    </Box>
                    <Button
                        alignSelf="start"
                        primary
                        onClick={handleSubmit}
                        label="Research"
                    />
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
                    <Box width="100%" margin={{ top: 'medium'}} gap="small">
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
            </Box>
        </Layout>
    )
}