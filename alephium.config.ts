import { Configuration } from '@alephium/cli'
import { Address } from '@alephium/web3'
import { testAddress } from '@alephium/web3-test'

export type Settings = {
  decimals: number,
  owner: Address
}

const configuration: Configuration<Settings> = {
  networks: {
    devnet: {
      nodeUrl: 'http://localhost:22973',
      privateKeys: ['a642942e67258589cd2b1822c631506632db5a12aabcf413604e785300d762a5'],
      settings: {
        decimals: 9,
        owner: testAddress
      }
    },

    testnet: {
      nodeUrl: (process.env.NODE_URL as string) ?? 'https://wallet-v20.testnet.alephium.org',
      privateKeys: process.env.PRIVATE_KEYS === undefined ? [] : process.env.PRIVATE_KEYS.split(','),
      settings: undefined as any as Settings
    },

    mainnet: {
      nodeUrl: (process.env.NODE_URL as string) ?? 'https://wallet-v20.mainnet.alephium.org',
      privateKeys: process.env.PRIVATE_KEYS === undefined ? [] : process.env.PRIVATE_KEYS.split(','),
      settings: undefined as any as Settings
    }
  }
}

export default configuration
