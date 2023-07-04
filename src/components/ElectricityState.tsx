import { useBlockNumber } from '@/hooks/useBlockNumber'
import { globalConfig } from '@/utils'
import { formatUnits } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'

export const ElectricityState = () => {
  const [currentCount, setCurrentCount] = useState<bigint | undefined>()
  const { data: blockNumber } = useBlockNumber()

  useEffect(() => {
    if (blockNumber !== undefined) {
      globalConfig.electricity.fetchState().then((result) => setCurrentCount(result.fields.count))
    }
  }, [blockNumber])

  return (
    <>
      <div style={{marginTop: '20px'}}>
        {
          currentCount !== undefined
            ? <span style={{textAlign: 'center', fontSize: '1.4rem'}}>
                Electricity available: {formatUnits(currentCount.toString(), globalConfig.countDecimals)} kWh
              </span>
            : null
        }
      </div>
    </>
  )
}
