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
      <div>
        {
          currentCount !== undefined
            ? <span style={{textAlign: 'center', fontSize: '1.4rem', marginTop: '20px'}}>
                Electricity available: {formatUnits(currentCount.toString(), globalConfig.countDecimals)} kWh
              </span>
            : null
        }
      </div>
    </>
  )
}
