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
    TextInput 
} from 'grommet';
import { useState } from "react";

export default function GptResearcherPage() {

    const [report, setReport] = useState<string>("");
    const [agentOutput, setAgentOutput] = useState<string>("");

    const GPTResearcher = (() => {
        const startResearch = () => {
          addAgentResponse({ output: "🤔 Too many requests right now, you are in the queue, please be patient." });
      
          listenToSockEvents();
        };
      
        const listenToSockEvents = () => {
          const { protocol, host, pathname } = window.location;
          const ws_uri = `${protocol === 'https:' ? 'wss:' : 'ws:'}//${host}${pathname}ws`;
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
            const task = document.querySelector('input[name="task"]').value;
            const report_type = document.querySelector('select[name="report_type"]').value;
            const agent = document.querySelector('input[name="agent"]:checked').value;
      
            const requestData = {
              task: task,
              report_type: report_type,
              agent: agent,
            };
      
            socket.send(`start ${JSON.stringify(requestData)}`);
          };
        };
      
        const addAgentResponse = (data) => {
          const output = document.getElementById("output");
          output.innerHTML += '<div class="agent_response">' + data.output + '</div>';
          output.scrollTop = output.scrollHeight;
          output.style.display = "block";
          updateScroll();
        };
      
        const writeReport = (data, converter) => {
          const reportContainer = document.getElementById("reportContainer");
          const markdownOutput = converter.makeHtml(data.output);
          reportContainer.innerHTML += markdownOutput;
          updateScroll();
        };
      
        const updateDownloadLink = (data) => {
          const path = data.output;
          const downloadLink = document.getElementById("downloadLink");
          downloadLink.href = path;
        };
      
        const updateScroll = () => {
          window.scrollTo(0, document.body.scrollHeight);
        };
      
        const copyToClipboard = () => {
          const textarea = document.createElement('textarea');
          textarea.id = 'temp_element';
          textarea.style.height = 0;
          document.body.appendChild(textarea);
          textarea.value = document.getElementById('reportContainer').innerText;
          const selector = document.querySelector('#temp_element');
          selector.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        };
      
        return {
          startResearch,
          copyToClipboard,
        };
      })();
    

    const handleSubmit = () => {
        setReport("");
        setAgentOutput("");
        GPTResearcher.startResearch();
    };

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
                        <TextInput />
                    </Box>
                    <Box width="100%">
                        <Text>What type of report would you like me to generate?</Text>
                        <Select options={['Research Report', 'Resource Report', 'Outline Report']} />
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
                        <Box height="300px">
                            <TextArea resize={false} fill value={agentOutput}/>
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
                                onClick={handleSubmit}
                                label="Copy to clipboard"
                            />
                            <Button
                                alignSelf="start"
                                primary
                                onClick={handleSubmit}
                                label="Download as PDF"
                            />
                        </Box>
                    </Box>    
                </Box>
            </Box>
        </Layout>
    )
}