import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAccount, useBalance } from 'wagmi';
import { web3AuthInstance } from '@/src/hooks/web3AuthInstance';
import { getPublicCompressed } from '@toruslabs/eccrypto';

interface WalletContextProviderProps {
  children: ReactNode;
}

interface IWalletContext {
  FLCTokenBalance: any;
  FLOTokenBalance: any;
  nativeTokenBalance: any;
  userToken: string;
  publicKey: string;
}

export const WalletContext = createContext<IWalletContext>(
  {} as IWalletContext
);

export function WalletContextProvider({
  children,
}: WalletContextProviderProps) {
  const [userToken, setUserToken] = useState<string>('');
  const [publicKey, setPublicKey] = useState<string>('');
  const { address } = useAccount();

  const { data: nativeTokenBalance } = useBalance({
    address: address as `0x${string}`,
    watch: true,
  });

  const { data: FLCTokenBalance } = useBalance({
    address: address as `0x${string}`,
    token: process.env.NEXT_PUBLIC_FLOCK_TOKEN_ADDRESS as `0x${string}`,
    watch: true,
  });

  const { data: FLOTokenBalance } = useBalance({
    address: address as `0x${string}`,
    token: process.env.NEXT_PUBLIC_FLOCK_TOKEN_V2_ADDRESS as `0x${string}`,
    watch: true,
  });
  
  const loadUserData = useCallback(async () => {
    console.log('loadUserData', address);
    if (web3AuthInstance.connectedAdapterName === 'openlogin') {
      const user = await web3AuthInstance.getUserInfo();
      const privateKey = (await web3AuthInstance.provider?.request({
        method: 'eth_private_key',
      })) as string;

      const publicKey = getPublicCompressed(
        Buffer.from(privateKey.padStart(64, '0'), 'hex')
      ).toString('hex');

      setUserToken(user.idToken!);
      setPublicKey(publicKey);
    } else {
      try {
        const authenticateUser = await web3AuthInstance.authenticateUser();
        const idToken = authenticateUser.idToken;

        setUserToken(idToken);
        setPublicKey(address!.toLocaleLowerCase());
      } catch (error) {
        setUserToken('');
        setPublicKey('');
        console.log('error', error);
      }
    }
  }, [web3AuthInstance.connected]);

  const value = useMemo(
    () => ({
      nativeTokenBalance,
      FLCTokenBalance,
      FLOTokenBalance,
      userToken,
      publicKey,
    }),
    [nativeTokenBalance, FLCTokenBalance, FLOTokenBalance, userToken, publicKey]
  );

  useEffect(() => {
    if (web3AuthInstance.connected) loadUserData();
  }, [web3AuthInstance.connected]);

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
