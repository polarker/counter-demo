import { globalConfig } from '@/utils'
import { web3 } from '@alephium/web3'
import { formatUnits } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

const StyledText = styled.p`
  text-align: center;
  font-size: 1.4rem;
`

const Space = styled.div`
  flex: 1,
  width: 100vw,
`

export const ElectricityState = () => {
  const [currentCount, setCurrentCount] = useState<bigint | undefined>()

  const { data: blockNumber } = useSWR(
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

  useEffect(() => {
    if (blockNumber !== undefined) {
      globalConfig.electricity.fetchState().then((result) => setCurrentCount(result.fields.count))
    }
  }, [blockNumber])

  return (
    <>
      <div>
        <Space/>
        {
          currentCount !== undefined
            ? <StyledText>Electricity available: {formatUnits(currentCount.toString(), globalConfig.countDecimals)} kWh</StyledText>
            : null
        }
      </div>
    </>
  )
}
