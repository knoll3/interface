import { Box, Button, type ButtonProps, Image } from 'grommet';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { Close } from 'grommet-icons';
import { Wallet } from './Wallet';

interface MenuItemProps {
  selected: boolean;
  text: string;
}
const MenuItem = ({
  selected,
  text,
  ...rest
}: MenuItemProps & ButtonProps & { onClick?: () => void }) => (
  <Button
    {...rest}
    plain
    hoverIndicator={false}
    color={selected ? '#6c94ec' : '#424242'}
  >
    {selected ? <b>{text}</b> : text}
  </Button>
);

export const BurgerMenu = ({
  setShowSidebar,
} : {
  setShowSidebar: (show: boolean) => void;
}) => {
  const { pathname } = useRouter();
  const [selected, setSelected] = useState(pathname);

  useEffect(() => {
    if (pathname) {
      setSelected(pathname);
    }
  }, [pathname]);
  
  return (
    <Box pad="large">
        <Box direction="row" gap="xlarge" align="center">
          <Button onClick={() => setShowSidebar(false)}><Close /></Button>
          <Box width="small">
            <Image src="logo.png" alt="logo" />
          </Box>
        </Box>
        <Box align="center" gap="large" margin={{ top: "xlarge" }}>
          <Wallet />
          <MenuItem
              href="/"
              onClick={() => setSelected('/')}
              hoverIndicator={false}
              selected={selected === '/'}
              text="Home"
          />

          <MenuItem
              href="/train"
              onClick={() => setSelected('/train')}
              hoverIndicator={false}
              selected={selected === '/train'}
              text="Train"
          />

          <MenuItem
              href="/faucet"
              onClick={() => setSelected('/faucet')}
              hoverIndicator={false}
              selected={selected === '/faucet'}
              text="Faucet"
          />

          <MenuItem
              href="/marketplace"
              onClick={() => setSelected('/marketplace')}
              hoverIndicator={false}
              selected={selected === '/marketplace'}
              text="Marketplace"
          />
          <MenuItem
              //href="/analytics"
              //onClick={() => setSelected('/analytics')}
              hoverIndicator={false}
              selected={selected === '/analytics'}
              text="Analytics"
          />
          <MenuItem
              href="https://flock-io.gitbook.io/flock/"
              target="_blank"
              //onClick={() => setSelected('/aboutUs')}
              hoverIndicator={false}
              selected={selected === '/aboutUs'}
              text="About Us"
          />
        </Box>
    </Box>
  );
};
