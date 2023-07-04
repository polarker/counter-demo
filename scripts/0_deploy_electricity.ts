import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { Electricity } from '../artifacts/ts'

const deployElectricity: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const encodeString = (str: string): string => Buffer.from(str, 'utf8').toString('hex')
  const result = await deployer.deployContract(Electricity, {
    initialFields: {
      name: encodeString(network.settings.tokenName),
      symbol: encodeString(network.settings.tokenSymbol),
      totalSupply: network.settings.totalSupply,
      rewardPerReduction: network.settings.rewardPerReduction,
      count: 0n,
      countDecimals: BigInt(network.settings.countDecimals)
    },
    issueTokenAmount: network.settings.totalSupply
  })

  console.log('Electricity contract address: ' + result.contractInstance.address)
  console.log('Electricity token id: ' + result.contractInstance.contractId)
}

export default deployElectricity
