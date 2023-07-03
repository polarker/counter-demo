import { counterConfig } from '@/services/utils'
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

export const CounterState = () => {
  const [currentCount, setCurrentCount] = useState<bigint | undefined>()

  const { data: blockNumber } = useSWR(
    'block-number',
    () => {
      return web3.getCurrentNodeProvider().blockflow
        .getBlockflowChainInfo({
          fromGroup: counterConfig.groupIndex,
          toGroup: counterConfig.groupIndex
        })
        .then((chainInfo) => chainInfo.currentHeight)
    },
    { refreshInterval: counterConfig.pollingInterval }
  )

  useEffect(() => {
    if (blockNumber !== undefined) {
      counterConfig.counter.fetchState().then((result) => setCurrentCount(result.fields.count))
    }
  }, [blockNumber])

  return (
    <>
      <div>
        <Space/>
        {
          currentCount !== undefined
            ? <StyledText>Electricity available: {formatUnits(currentCount.toString(), counterConfig.countDecimals)} kWh</StyledText>
            : null
        }
      </div>
    </>
  )
}
