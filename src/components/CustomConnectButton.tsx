import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Box } from 'grommet';
import { PrimaryButton } from './PrimaryButton';

export const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <Box
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <PrimaryButton
                    onClick={openConnectModal}
                    size="medium"
                    pad={{ vertical: 'small', horizontal: 'large' }}
                    label="Connect Wallet"
                  ></PrimaryButton>
                );
              }

              if (chain.unsupported) {
                return (
                  <PrimaryButton
                    size="medium"
                    pad={{ vertical: 'small', horizontal: 'large' }}
                    label="Wrong network"
                    onClick={openChainModal}
                  ></PrimaryButton>
                );
              }

              return (
                <Box style={{ display: 'flex', gap: 12 }}>
                  <PrimaryButton
                    size="medium"
                    pad={{ vertical: 'small', horizontal: 'large' }}
                    onClick={openAccountModal}
                    label={`${account.displayName} ${
                      account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ''
                    }`}
                  ></PrimaryButton>
                </Box>
              );
            })()}
          </Box>
        );
      }}
    </ConnectButton.Custom>
  );
};
