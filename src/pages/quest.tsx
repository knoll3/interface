import { Box, Image, Button, Text } from 'grommet';
import { Layout } from '../components';
import ConnectWallet from '../components/ConnectWallet';

const data = [
  {
    step: 1,
    label: 'Get your Wallet Ready',
    actions: [<ConnectWallet />],
  },
  {
    step: 2,
    label: 'Connect your Discord account',
    actions: [<Button primary label="Connect Now" />],
  },
  {
    step: 3,
    label: 'Join our Discord and acquire a role',
    actions: [
      <Button primary label="Join Now" />,
      <Button secondary label="Verify" />,
    ],
  },
  {
    step: 4,
    label: 'Connect your Twitter account',
    actions: [<Button primary label="Connect Now" />],
  },
  {
    step: 5,
    label: 'Follow @flock_io on Twitter',
    actions: [
      <Button primary label="Follow Now" />,
      <Button secondary label="Verify" />,
    ],
  },
  {
    step: 6,
    label: 'Broadcast your Journey to your mate',
    actions: [
      <Button primary label="Broadcast Now" />,
      <Button secondary label="Verify" />,
    ],
  },
];
export default function QuestPage() {
  return (
    <Layout>
      <Box
        direction="row"
        align="center"
        justify="evenly"
        pad={{ vertical: 'large', horizontal: 'xlarge' }}
        background="#FFFFFF"
      >
        <Box gap="large">
          <Image src="quest.jpg" alt="quest" />
          <Box align="center" gap="small">
            <Button secondary size="large" label="Step 1: Claim $MATIC" />
            <Button secondary size="large" label="Step2: Claim $FLC" />
          </Box>
        </Box>

        <Box gap="small">
          <Text color="#000000" weight={600} margin={{ left: 'medium' }}>
            Complete the tasks to claim $FLC
          </Text>
          <Box gap="medium">
            {data.map(({ label, actions, step }, index) => (
              <Box
                direction="row"
                align="center"
                gap="small"
                border={{ color: 'black', size: 'small' }}
                pad="small"
                round="large"
                key={`step-${step}`}
              >
                <Box
                  align="center"
                  justify="center"
                  border={{ color: 'black', size: 'small' }}
                  round="large"
                  width="24px"
                  height="24px"
                >
                  <Text weight={600} size='16px' style={{lineHeight: '14px', verticalAlign: 'centerq'}} textAlign='center'>{index + 1}</Text>
                </Box>
                <Text weight={600}>{label}</Text>
                <Box direction="row" gap="xsmall" margin={{ left: 'auto' }}>
                  {actions.map((action) => action)}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
