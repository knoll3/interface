import { useState, useEffect } from 'react';
import { web3AuthInstance } from '@/src/hooks/web3AuthInstance';
import { getPublicCompressed } from '@toruslabs/eccrypto';
import { useAccount } from 'wagmi';

export const userDataHook = () => {
  const [userToken, setUserToken] = useState<string>('');
  const [publicKey, setPublicKey] = useState<string>('');
  const { address } = useAccount();

  const loadUserData = async () => {
    if (web3AuthInstance.connectedAdapterName == 'OPENLOGIN') {
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
        console.log('error', error);
      }
    }
  };

  useEffect(() => {
    if (web3AuthInstance.connected && address) loadUserData();
  }, [web3AuthInstance.connected, address]);

  return { userToken, publicKey };
};
