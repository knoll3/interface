export const toasts = {
  walletConnectionFailed: {
    type: 'error',
    title: 'Connection Failed',
    message: 'You have declined the transaction.',
  },
  walletConnectionSuccess: {
    type: 'success',
    title: 'Connection Successful',
    message: 'Your wallet is now connected.',
  },
  discordConnectionFailed: {
    type: 'error',
    title: 'Connection Failed',
    message: 'This Discord account is already associated with another address.',
  },
  discordConnectionSuccess: {
    type: 'success',
    title: 'Connection Successful',
    message: 'Your Discord account is now connected.',
  },
  discordJoinFailed: {
    type: 'error',
    title: 'Verification Failed',
    message: 'To proceed, please join the FLock Discord server.',
  },
  discordVerifyFailed: {
    type: 'error',
    title: 'Verification Failed',
    message:
      'Please verify your identity on the FLock Discord server to gain the "FLocker" role.',
  },
  twitterConnectionFailed: {
    type: 'error',
    title: 'Connection Failed',
    message: 'This Twitter account is already associated with another address.',
  },
  twitterConnectionSuccess: {
    type: 'success',
    title: 'Connection Successful',
    message: 'Your Twitter account is now connected.',
  },
  twitterFollowFailed: {
    type: 'error',
    title: 'Verification Failed',
    message: 'To proceed, please follow the FLock Twitter account.',
  },
  twitterPostFailed: {
    type: 'error',
    title: 'Verification Failed',
    message: 'Please post the required tweet.',
  },
  claimSuccess: {
    type: 'success',
    title: 'Transaction Successful',
    message: 'Your transaction has been completed successfully.',
  },
  claimFailed: {
    type: 'error',
    title: 'Transaction Failed',
    message: 'You have declined the transaction.',
  },
};
