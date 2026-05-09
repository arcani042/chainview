// Arc Testnet Configuration
export const ARC_TESTNET = {
  id: 5042002,
  name: 'Arc Testnet',
  network: 'arc-testnet',
  nativeCurrency: {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
  },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network'] },
    public: { http: ['https://rpc.testnet.arc.network'] },
  },
  blockExplorers: {
    default: {
      name: 'ArcScan',
      url: 'https://testnet.arcscan.app',
    },
  },
  testnet: true,
}

export const FAUCET_URL = 'https://faucet.circle.com'
export const EXPLORER_URL = 'https://testnet.arcscan.app'

// EURC token address on Arc Testnet
export const EURC_ADDRESS = '0x808456652fdb597867f38412077A9182bf77671'