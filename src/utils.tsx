import { DUST_AMOUNT, NetworkId, SignerProvider, web3 } from '@alephium/web3'
import configuration from 'alephium.config'
import { Produce, Consume, ElectricityInstance } from 'artifacts/ts'
import { loadDeployments } from '../artifacts/ts/deployments'

export interface Config {
  network: NetworkId
  tokenSymbol: string
  groupIndex: number
  countDecimals: number
  electricity: ElectricityInstance
  pollingInterval: number
}

function getNetwork(): NetworkId {
  return (process.env.NEXT_PUBLIC_NETWORK ?? 'devnet') as NetworkId
}

function getConfig(): Config {
  const network = getNetwork()
  const electricity = loadDeployments(network).contracts.Electricity.contractInstance
  const groupIndex = electricity.groupIndex
  const networkConfig = configuration.networks[network]
  const countDecimals = networkConfig.settings.countDecimals
  const tokenSymbol = networkConfig.settings.tokenSymbol
  web3.setCurrentNodeProvider(networkConfig.nodeUrl)
  const pollingInterval = network === 'devnet' ? 1000 : 10000
  return { network, tokenSymbol, groupIndex, countDecimals, electricity, pollingInterval }
}

export const globalConfig = getConfig()

export async function produce(signer: SignerProvider, num: bigint) {
  return await Produce.execute(signer, { initialFields: { electricity: globalConfig.electricity.contractId, num } })
}

export async function consume(signer: SignerProvider, num: bigint) {
  return await Consume.execute(signer, {
    initialFields: { electricity: globalConfig.electricity.contractId, num },
    attoAlphAmount: DUST_AMOUNT
  })
}
