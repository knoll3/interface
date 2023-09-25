export const MIGRATE_TOKENS_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_oldTokenAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_newTokenAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "migrate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];