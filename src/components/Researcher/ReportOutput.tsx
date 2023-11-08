import { Box, Button, Heading, Markdown, Text } from "grommet";


export const ReportOutput = ({
    report,
    isResearching,
}: {
    report: string;
    isResearching: boolean;
}) => {
    return (
        <>
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
        </>
    );
};
