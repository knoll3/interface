import { type AppType } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { polygonMumbai } from '@wagmi/core/chains';
import '@rainbow-me/rainbowkit/styles.css';
import { alchemyProvider } from 'wagmi/providers/alchemy';

import { Grommet } from 'grommet';
import './global.css';

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY! })]
);

const { connectors } = getDefaultWallets({
  appName: 'FLock App',
  chains,
});

const configWagmi = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const flockTheme = {
  global: {
    font: {
      family: 'Gilroy',
    },
    focus: {
      border: {
        color: 'transparent',
      },
    },
    colors: {
      brand: '#6C94EC',
    },
  },
  button: {
    default: {
      background: { color: '#6C94EC' },
      border: { color: '#000000' },
    },
    color: '#FFFFFF',
    border: { width: '2px', radius: '8px', color: '#000000' },
    primary: {
      border: { width: '2px', radius: '8px', color: '#000000' },
      font: { weight: 'bold' },
      color: '#FFFFFF',
      background: {
        color: '#6C94EC',
      },
    },
    secondary: {
      border: { width: '2px', radius: '8px', color: '#000000' },
      font: { weight: 'bold' },
      color: '#000000',
      background: {
        color: '#EEEEEE',
      },
    },
  },
};

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <Grommet theme={flockTheme}>
      <WagmiConfig config={configWagmi}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </Grommet>
  );
};

export default MyApp;
