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

export default function GptResearcherPage() {

    const handleSubmit = (event: any) => {
        console.log("Form submitted");
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
                            <TextArea resize={false} fill/>
                        </Box>
                    </Box>
                    <Box width="100%" margin={{ top: 'medium'}} gap="small">
                        <Heading level="2" margin="xsmall">Research Report</Heading>
                        <Box width="100%" border height={{min: '30px'}} round="small">
                            <Text></Text>
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