import { Box, Button, type ButtonProps } from 'grommet';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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

export const Menu = () => {
  const { pathname } = useRouter();
  const [selected, setSelected] = useState(pathname);

  useEffect(() => {
    if (pathname) {
      setSelected(pathname);
    }
  }, [pathname]);
  return (
    <Box direction="row" align="center" gap="large">
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
        //href="/marketplace"
        //onClick={() => setSelected('/marketplace')}
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
        //href="/aboutUs"
        //onClick={() => setSelected('/aboutUs')}
        hoverIndicator={false}
        selected={selected === '/aboutUs'}
        text="About Us"
      />
    </Box>
  );
};
