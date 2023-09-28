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
    TextInput 
} from 'grommet';

export default function GptResearcherPage() {

    const handleSubmit = (event: any) => {
        console.log("Form submitted");
    };

    return (
        <Layout>
            <Main pad="large">
                <Box id="form">
                    <Box direction="row" align="center">
                    </Box>

                    <Paragraph className="project-intro">
                        Introducing the "FLock Researcher" - an unparalleled multi-agent engine meticulously crafted by the experts at FLock.io. This isn't just another AI model; it's an amalgamation of domain-specific expertise funneled through our unique FLock platform for collaborative finetuning. The result? An agent that outperforms generic pretrained open-source models in terms of proficiency and precision.
                    </Paragraph>

                    {/* Add more Paragraph components for other text content here */}
                    
                    <Form onSubmit={handleSubmit} className="mt-3">
                    <Box>
                        <label htmlFor="task" className="agent-question">
                            What would you like me to research next?
                        </label>
                        <TextInput id="task" name="task" required />
                    </Box>

                    <Box>
                        <label htmlFor="report_type" className="agent-question">
                        What type of report would you like me to generate?
                        </label>
                        <Select name="report_type" required options={['Research Report', 'Resource Report', 'Outline Report']} />
                    </Box>

                    <Button type="submit" label="Research" primary />
                    </Form>

                    {/* Add more content here */}
                </Box>

                <Box className="margin-div">
                    <Heading level="2">Agents Output</Heading>
                    <Text size="small">An agent tailored specifically to your task will be generated to provide the most precise and relevant research results.</Text>
                    <Box id="output" />
                </Box>

                <Box className="margin-div">
                    <Heading level="2">Research Report</Heading>
                    <Box id="reportContainer" />
                    <Button label="Copy to clipboard" onClick={() => {}} className="mt-3" secondary />
                    <a id="downloadLink" href="#" className="btn btn-secondary mt-3" target="_blank">Download as PDF</a>
                </Box>
            </Main>

            <Footer>
                <Text>
                    Made with love by{' '}
                    <a target="_blank" href="https://flock.io/#/">
                    FLock.io
                    </a>{' '}
                    | Powered by{' '}
                    <a target="_blank" href="https://github.com/assafelovic/gpt-researcher">
                    GPTResearcher
                    </a>
                </Text>
            </Footer>
        </Layout>
    )
}