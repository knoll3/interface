import { useIsMounted } from '@/src/hooks';
import { Button } from 'grommet';
import { useAccount, useConnect } from 'wagmi';
import { web3AuthInstance } from '@/src/hooks/web3AuthInstance';

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const mounted = useIsMounted();

  const handleConnectButton = async () => {
    const connection = await connectAsync({
      connector: connectors[0],
    });
    const { idToken } = await web3AuthInstance.authenticateUser();
    console.log({ idToken });

    const params = {
      wallet_address: connection.account,
      chain_id: connection.chain.id,
      timestamp: Date.now(),
      signature: idToken,
    };

    console.log({ connection, params });
  };

  if (!mounted || address) {
    return <></>;
  }

  return <Button primary label="Connect Now" onClick={handleConnectButton} />;
}
