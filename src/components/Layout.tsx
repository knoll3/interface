import { Box, Header, Image, Main, ResponsiveContext, Button, Layer } from 'grommet';
import { Menu as MenuIcon } from 'grommet-icons';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { Menu } from './Menu';
import { Wallet } from './Wallet';
import { BurgerMenu } from './BurgerMenu';
import { useState } from 'react';
import { borderRadius } from 'polished';


interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const { push, pathname } = useRouter();
  const size = useContext(ResponsiveContext);
  const [showSidebar, setShowSidebar] = useState(false);

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
        {size !== 'large' && 
          <Button onClick={() => setShowSidebar(!showSidebar)}><MenuIcon /></Button>
        }
        <Box width="small">
          <Image src="logo.png" onClick={() => void push('/')} alt="logo" />
        </Box>
        {size === 'large' && <Menu />}
        {size !== 'small' && <Wallet />}
      </Header>
      {showSidebar &&
        <Layer
          onEsc={() => setShowSidebar(false)}
          onClickOutside={() => setShowSidebar(false)}
          animation="slide" 
          position='left'
        >
          <Box>
            <BurgerMenu setShowSidebar={setShowSidebar} />
          </Box>
        </Layer>
      }
      <Main background={pathname === '/' ? 'url(main-bg.png)' : ''} fill>
        <Box fill>{children}</Box>
      </Main>
    </Box>
  );
};
