import { Address, DUST_AMOUNT, NetworkId, SignerProvider, web3 } from '@alephium/web3'
import configuration from 'alephium.config'
import { Increase, Decrease, CounterInstance } from 'artifacts/ts'
import { loadDeployments } from '../../artifacts/ts/deployments'

export interface CounterConfig {
  network: NetworkId
  groupIndex: number
  countDecimals: number
  counter: CounterInstance
  pollingInterval: number
}

function getNetwork(): NetworkId {
  return (process.env.NEXT_PUBLIC_NETWORK ?? 'devnet') as NetworkId
}

function getCounterConfig(): CounterConfig {
  const network = getNetwork()
  const counter = loadDeployments(network).contracts.Counter.contractInstance
  const groupIndex = counter.groupIndex
  const networkConfig = configuration.networks[network]
  const decimals = networkConfig.settings.countDecimals
  web3.setCurrentNodeProvider(networkConfig.nodeUrl)
  const pollingInterval = network === 'devnet' ? 1000 : 10000
  return { network, groupIndex, countDecimals: decimals, counter, pollingInterval }
}

export const counterConfig = getCounterConfig()

export async function increase(signer: SignerProvider, num: bigint) {
  return await Increase.execute(signer, { initialFields: { counter: counterConfig.counter.contractId, num } })
}

export async function decrease(signer: SignerProvider, num: bigint, to: Address) {
  return await Decrease.execute(signer, {
    initialFields: { counter: counterConfig.counter.contractId, num, to },
    attoAlphAmount: DUST_AMOUNT * 2n
  })
}
