import { Box, Heading, Text, Image } from 'grommet';

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
                <Image src="dollar-chat.svg" alt="icon" />
                <Text size="large">Follow <a href='/quest'>FLock.io</a> and claim your test tokens ($FLC and $MATIC)</Text>
            </Box>
            <Box direction='row' align="center" gap="medium">
                <Image src="report-board.svg" alt="icon" />
                <Text size="large">Use $FLC to ask questions and create 5 reports. You can claim the <b>FLock News Agent NFT, FLock Maths Agent NFT, FLock Financial Analyst Agent NFT, FLock Physicist Agent NFT, and FLock Real Estate Agent NFT </b> based on how many reports you will create.</Text>
            </Box>
            <Box direction='row' align="center" gap="medium">
                <Image src="sphere.svg" alt="icon" />
                <Text size="large">You can use one of the Agent NFTs to participate in a guess-off and vote on the identity of the FLock Researcher V2.0. After voting, you'll have the opportunity to split the USDT rewards and receive <b> FLock Agent Specialist NFT </b> airdrops.</Text>
            </Box>
            <Box>
                <Text><b>Please note that you must follow the instructions, complete all three steps, and finish the voting process in order to be eligible to receive the FLock Agent Specialist airdrop.</b></Text>
            </Box>
        </Box>
    </Box>
  </>
  );
};
