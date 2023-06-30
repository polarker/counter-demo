import { Configuration } from '@alephium/cli'
import { Address } from '@alephium/web3'
import { testAddress } from '@alephium/web3-test'

export type Settings = {
  tokenSymbol: string,
  tokenName: string,
  totalSupply: bigint,
  rewardPerReduction: bigint

  countDecimals: number,
  owner: Address
}

const devnetSettings: Settings = {
  tokenSymbol: 'CounterToken',
  tokenName: 'CT',
  totalSupply: 1n << 255n,
  rewardPerReduction: (10n ** 18n) / (100n * (10n ** 9n)), // the decimals of the token is 18, reward 1 token for every decrease of 100

  countDecimals: 9,
  owner: testAddress
}

const configuration: Configuration<Settings> = {
  networks: {
    devnet: {
      nodeUrl: 'http://localhost:22973',
      privateKeys: ['a642942e67258589cd2b1822c631506632db5a12aabcf413604e785300d762a5'],
      settings: devnetSettings
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
