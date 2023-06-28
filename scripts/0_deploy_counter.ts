import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { Counter } from '../artifacts/ts'

const deployCounter: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const result = await deployer.deployContract(Counter, {
    initialFields: {
      owner: network.settings.owner,
      count: 0n,
      decimals: BigInt(network.settings.decimals)
    }
  })

  console.log('Counter contract address: ' + result.contractInstance.address)
  console.log('Counter token id: ' + result.contractInstance.contractId)
}

export default deployCounter
