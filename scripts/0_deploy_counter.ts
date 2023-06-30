import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { Counter } from '../artifacts/ts'

const deployCounter: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const encodeString = (str: string): string => Buffer.from(str, 'utf8').toString('hex')
  const result = await deployer.deployContract(Counter, {
    initialFields: {
      name: encodeString(network.settings.tokenName),
      symbol: encodeString(network.settings.tokenSymbol),
      totalSupply: network.settings.totalSupply,
      rewardPerReduction: network.settings.rewardPerReduction,
      owner: network.settings.owner,
      count: 0n,
      countDecimals: BigInt(network.settings.countDecimals)
    },
    issueTokenAmount: network.settings.totalSupply
  })

  console.log('Counter contract address: ' + result.contractInstance.address)
  console.log('Counter token id: ' + result.contractInstance.contractId)
}

export default deployCounter
