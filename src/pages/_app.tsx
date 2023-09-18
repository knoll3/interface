import { type AppType } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { polygonMumbai } from '@wagmi/core/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';

import { Grommet } from 'grommet';
import './global.css';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { Web3Auth } from '@web3auth/modal';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector';
import { WalletContextProvider } from '../context/walletContext';
import { web3AuthInstance } from '../hooks/web3AuthInstance';

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY! })]
);

const chainConfig = {
  chainNamespace: 'eip155',
  chainId: `0x${chains[0].id.toString(16)}`,
  // @ts-ignore
  rpcTarget: process.env.NEXT_PUBLIC_WEB3_AUTH_RPC,
  displayName: chains[0].name,
  tickerName: chains[0].nativeCurrency?.name,
  ticker: chains[0].nativeCurrency?.symbol,
  blockExplorer: chains[0]?.blockExplorers.default?.url,
};

// const web3AuthInstance = new Web3Auth({
//   clientId: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID as string,
//   web3AuthNetwork: 'cyan',
//   // @ts-ignore
//   chainConfig,
//   authMode: 'WALLET',
//   uiConfig: {
//     theme: 'light',
//     appName: 'FLock Client',
//     appLogo:
//       'https://drive.google.com/uc?export=download&id=1Pm_naD3LlamhxkEVv-i2VBVG2RC4DYaZ',
//   },
// });

const privateKeyProvider = new EthereumPrivateKeyProvider({
  // @ts-ignore
  config: { chainConfig },
});
const openloginAdapterInstance = new OpenloginAdapter({
  privateKeyProvider,
  adapterSettings: {
    network: 'cyan',
  },
});
web3AuthInstance.configureAdapter(openloginAdapterInstance);

const configWagmi = createConfig({
  autoConnect: true,
  connectors: [
    new Web3AuthConnector({
      chains,
      options: {
        web3AuthInstance,
      },
    }),
  ],
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
      black: '#000000',
      white: '#FFFFFF',
      disabled: '#879095',
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
      border: { width: '2px', radius: '30px', color: '#000000' },
      font: { weight: 'bold' },
      color: '#FFFFFF',
      background: {
        color: '#6C94EC',
      },
    },
    secondary: {
      border: { width: '2px', radius: '30px', color: '#000000' },
      font: { weight: 'bold' },
      color: '#000000',
      background: {
        color: '#EEEEEE',
      },
    },
  },
  formField: { label: { requiredIndicator: true } },
};

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <Grommet theme={flockTheme}>
      <WagmiConfig config={configWagmi}>
        <WalletContextProvider>
          <GoogleAnalytics trackPageViews />
          <Component {...pageProps} />
        </WalletContextProvider>
      </WagmiConfig>
    </Grommet>
  );
};

export default MyApp;
