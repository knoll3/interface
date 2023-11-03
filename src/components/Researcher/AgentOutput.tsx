import { Box, Heading, InfiniteScroll, Text } from "grommet";
import { Key } from "react";

export const AgentOutput = ({
    agentOutput
}: {
    agentOutput: string[];
}) => {
    return (
        <>
        <Box
          pad={{ vertical: 'large', horizontal: 'large' }}
          gap="medium"
          fill="horizontal"
        >
            <Box direction="row">
                <Heading level="2" margin="none" weight="bold">Agent Output</Heading>
            </Box>
            <Box
                height="medium"
                overflow="auto"
                border
                round="small"
                fill="horizontal"
            >
            <InfiniteScroll
                items={agentOutput}
                show={agentOutput.length}
            >
                {(item: any, index: Key | null | undefined) => (
                    <Box
                        width="100%"
                        key={index}
                        border
                        round="small"
                        flex={false}
                        margin={{ bottom: 'small' }}
                        pad="small"
                        background="#EEEEEE"
                    >
                        <Text>{item}</Text>
                    </Box>
                )}
                </InfiniteScroll>
            </Box>
        </Box>
        </>
    )
};