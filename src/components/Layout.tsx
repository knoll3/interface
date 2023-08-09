import { Box, Header, Image, Main } from 'grommet';

import { useRouter } from 'next/router';
import { Menu } from './Menu';
import Wallet from './Wallet';

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const { push, pathname } = useRouter();

  return (
    <Box background="#F8FAFB">
      <Header
        direction="row"
        align="center"
        justify="evenly"
        pad={{ vertical: 'small', horizontal: 'xlarge' }}
        border="bottom"
        gap="xlarge"
        background="#FFFFFF"
        height="xsmall"
      >
        <Box width="small">
          <Image src="logo.png" onClick={() => void push('/')} alt="logo" />
        </Box>
        <Menu />
        <Wallet />
      </Header>
      <Main background={pathname === '/' ? 'url(main-bg.png)' : ''} fill>
        <Box fill>{children}</Box>
      </Main>
    </Box>
  );
};
