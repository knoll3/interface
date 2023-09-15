import { Box, Button, Heading, Layer, Text } from 'grommet';
import { useContext, useState } from 'react';
import truncateEthAddress from 'truncate-eth-address';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { WalletContext } from '../context/walletContext';
import { useIsMounted } from '../hooks';

export function Wallet() {
  const { address } = useAccount();
  const [showWalletSettings, setShowWalletSettings] = useState(false);
  const { connectAsync, connectors } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { nativeTokenBalance, flockTokenBalance } = useContext(WalletContext);
  const mounted = useIsMounted();
  const [isClaiming, setIsClaiming] = useState(false);

  const handleConnect = async () => {
    await connectAsync({
      connector: connectors[0],
    });
  };

  const handleDisconnect = async () => {
    wagmiDisconnect();
  };

  const handleClaim = async () => {
    setIsClaiming(true);
    const result = await fetch('/api/claimReward', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress: address }),
    });
    const data = await result.json();
    console.log(data);
    setIsClaiming(false);
  };

  const roundedFLCBalance = flockTokenBalance
    ? Math.round(Number(flockTokenBalance.formatted) * 100) / 100
    : 0;

  const roundedMaticBalance = nativeTokenBalance
    ? Math.round(Number(nativeTokenBalance.formatted) * 10000) / 10000
    : 0;

  if (!mounted) {
    return <></>;
  }

  if (showWalletSettings) {
    return (
      <Layer onEsc={() => setShowWalletSettings(false)}>
        <Box align="center" justify="center" pad="large" gap="medium">
          <Heading level="3">Wallet Settings</Heading>
          <Box align="start" gap="xsmall">
            <Text>
              <b>Wallet Address:</b> {address}
            </Text>
            <Text>
              <b>FLock(FLC) Balance: </b>
              {roundedFLCBalance} $F
            </Text>
            <Text>
              <b>MATIC Balance: </b>
              {roundedMaticBalance} $MATIC
            </Text>
          </Box>
          <Box direction="row" alignSelf="end" gap="small">
            <Button
              secondary
              label="Go Back"
              onClick={() => setShowWalletSettings(false)}
            />
            <Button
              primary
              label="Disconnect"
              onClick={() => {
                handleDisconnect();
                setShowWalletSettings(false);
              }}
            />
            <Button
              secondary
              disabled={isClaiming}
              label={isClaiming ? 'Claiming...' : 'Claim Rewards'}
              onClick={handleClaim}
            />
          </Box>
        </Box>
      </Layer>
    );
  }

  return (
    <Button
      primary
      label={
        !address
          ? 'Connect Wallet'
          : `(${roundedFLCBalance} $F) ${truncateEthAddress(address)}`
      }
      pad="xsmall"
      onClick={
        address
          ? () => {
              setShowWalletSettings(true);
            }
          : () => {
              handleConnect();
            }
      }
    />
  );
}

export default Wallet;
