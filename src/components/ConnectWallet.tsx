import { useIsMounted } from '@/src/hooks';
import { Button } from 'grommet';
import { useAccount, useConnect } from 'wagmi';
import { web3AuthInstance } from '@/src/hooks/web3AuthInstance';
import ClaimStep from './ClaimStep';
import { useState } from 'react';

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const mounted = useIsMounted();

  const [token, setToken] = useState('');
  const [status, setStatus] = useState("active");

  const handleConnectButton = async () => {
    const connection = await connectAsync({
      connector: connectors[0],
    });
    const { idToken } = await web3AuthInstance.authenticateUser();
    if (idToken) {
      setToken(idToken);
      setStatus("complete")
    }

    const params = {
      wallet_address: connection.account,
      chain_id: connection.chain.id,
      timestamp: Date.now(),
      signature: idToken,
    };
    
    // send to api
    console.log({ connection, params });
  };

  if (!mounted) {
    return <></>;
  }

  return (
    <ClaimStep label="Get your Wallet Ready" status={status} step={1}>
      {!token && (
        <Button primary label="Connect Now" onClick={handleConnectButton} style={{boxShadow: '3px 4px 0px 0px #000'}} />
      )}
    </ClaimStep>
  );
}
