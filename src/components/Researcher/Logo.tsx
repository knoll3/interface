import { Box, Header, Heading, Image, Text } from 'grommet';
import { Add, Copy } from 'grommet-icons';

export const Logo = () => {

  return (
    <>
    <Box
          pad={{ vertical: 'large', horizontal: 'large' }}
          gap="medium"
    >
        <Box alignSelf="center" justify="center" width="80%">
            <Image src="ResearcherLogo.png" alt="logo" />
        </Box>
        <Box alignSelf="center" justify="center" width="80%">
            <Heading textAlign="center" level="3" margin="none">An on-chain multi-agent framework finetuned with FLock SDK</Heading>
        </Box>
    </Box>
  </>
  );
};
