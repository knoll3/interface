import { Box, Heading, Text } from 'grommet';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Layout, PrimaryButton, SecondaryButton } from '../components';

export default function IndexPage() {
  return (
    <Layout>
      <Box
        width="xxlarge"
        align="center"
        justify="center"
        alignSelf="center"
        gap="xlarge"
        height="100%"
      >
        <Box>
          <Heading size="large" color="black" textAlign="center">
            The On-Chain Decentralized Machine Learning Platform
          </Heading>
          <Text size="xxlarge" textAlign="center" color="black">
            <b>F</b>ederated <b>L</b>earning on Bl<b>ock</b>chain{' '}
          </Text>
        </Box>
        <Box direction="row-responsive" gap="xlarge">
          <SecondaryButton
            margin={{ top: 'large' }}
            label="Download App"
            size="xlarge"
            pad={{ vertical: 'medium', horizontal: 'xlarge' }}
          />
          <PrimaryButton
            margin={{ top: 'large' }}
            label="Start Training"
            size="xlarge"
            pad={{ vertical: 'medium', horizontal: 'xlarge' }}
          />
        </Box>
      </Box>
    </Layout>
  );
}
