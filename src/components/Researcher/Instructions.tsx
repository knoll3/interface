import { Box, Heading, Text } from 'grommet';
import { Add, Copy } from 'grommet-icons';

export const Instructions = () => {

  return (
    <>
    <Box
          pad={{ vertical: 'large', horizontal: 'large' }}
          gap="medium"
    >
        <Box>
            <Box direction="row">
                <Heading level="2" margin="none" color="brand" weight="bold">Instructions</Heading>
            </Box>
        </Box>
        <Box gap="small">
            <Box direction='row' align="center" gap="medium">
                <Copy size="medium"/>
                <Text size="large">Follow <a href='/quest'>FLock.io</a> and claim your test tokens ($FLC and $MATIC)</Text>
            </Box>
            <Box direction='row' align="center" gap="medium">
                <Copy size="medium"/>
                <Text size="large">Use $FLC to ask questions and create 5 reports. You can claim the <b>FLock News Agent NFT, FLock Mathematical Agent NFT, FLock Financial Agent NFT, FLock Economics Agent NFT, and FLock Industrial Agent NFT</b> based on how many reports you will create.</Text>
            </Box>
            <Box direction='row' align="center" gap="medium">
                <Copy size="medium"/>
                <Text size="large">Guess the agent behind Researcher V2.0. Use the NFT to cast your vote. All participants will get an <b>FLock Agent Specialist NFT</b> airdrop, while winners will take part in a prize draw.</Text>
            </Box>
        </Box>
    </Box>
  </>
  );
};
