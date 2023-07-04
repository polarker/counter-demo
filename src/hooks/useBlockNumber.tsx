import { globalConfig } from '@/utils'
import { web3 } from '@alephium/web3'
import useSWR from 'swr'

export function useBlockNumber() {
  return useSWR(
    'block-number',
    () => {
      return web3.getCurrentNodeProvider().blockflow
        .getBlockflowChainInfo({
          fromGroup: globalConfig.groupIndex,
          toGroup: globalConfig.groupIndex
        })
        .then((chainInfo) => chainInfo.currentHeight)
    },
    { refreshInterval: globalConfig.pollingInterval }
  )
}
