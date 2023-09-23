import { useContext } from 'react';
import { Box, Image, Text, ResponsiveContext } from 'grommet';
import styled from 'styled-components';

import QuestContextProvider from '../context/questContext';
import useToaster, { IToastContent } from '../hooks/useToaster';

import { Layout } from '../components';
import BroadcastTwitter from '../components/BroadcastTwitter';
import Claim from '../components/Claim';
import ConnectDiscord from '../components/ConnectDiscord';
import ConnectTwitter from '../components/ConnectTwitter';
import ConnectWallet from '../components/ConnectWallet';
import FollowTwitter from '../components/FollowTwitter';
import JoinDiscord from '../components/JoinDiscord';
import QuestDivider from '../components/QuestDivider';
import ToasterList from '../components/ToasterList';

interface IOnSubmitProps {
  error?: boolean;
  toast: IToastContent;
}

export interface IStepProps {
  showToaster(props: IOnSubmitProps): void;
}

const QuestWrapper = styled.div<{ size: string }>`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: ${(props) => (props.size === 'small' ? '100%' : '518px')};
  min-width: ${(props) => (props.size === 'small' ? 'none' : '350px')};
`;

export default function QuestPage() {
  const size = useContext(ResponsiveContext);
  const { toasts, addToast } = useToaster();
  const isMobile = size === 'small';

  const showToaster = ({ toast }: IOnSubmitProps) => addToast(toast);

  return (
    <QuestContextProvider>
      <Layout>
        <Box
          direction={isMobile ? 'column' : 'row'}
          align="center"
          justify="evenly"
          pad={{ vertical: 'large', horizontal: 'xlarge' }}
          background="white"
          gap="30px"
        >
          <ToasterList toasts={toasts} />
          <Box gap="large" width={isMobile ? '300px' : undefined}>
            <Image src="quest.jpg" alt="quest" />
            <Claim showToaster={showToaster} />
          </Box>

          <QuestWrapper size={size}>
            <Box>
              <Text
                color="#000000"
                weight={600}
                margin={{ left: 'medium' }}
                size="16px"
              >
                Complete the tasks to claim $FLC
              </Text>
            </Box>
            <Box gap="xsmall">
              <ConnectWallet showToaster={showToaster} />
              <QuestDivider />
              <ConnectDiscord showToaster={showToaster} />
              <QuestDivider />
              <JoinDiscord showToaster={showToaster} />
              <QuestDivider />
              <ConnectTwitter showToaster={showToaster} />
              <QuestDivider />
              <FollowTwitter showToaster={showToaster} />
              <QuestDivider />
              <BroadcastTwitter showToaster={showToaster} />
            </Box>
          </QuestWrapper>
        </Box>
      </Layout>
    </QuestContextProvider>
  );
}
