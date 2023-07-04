import { useState } from 'react'
import { useAlephiumConnectContext } from '@alephium/web3-react'
import { produce, consume, globalConfig } from '@/utils'
import { parseUnits } from 'ethers/lib/utils'
import styled from 'styled-components'
import { ElectricityState } from './ElectricityState'
import { EventList } from './Events'

const Input = styled.input`
  margin-top: 10px;
  width: 300px;
  height: 40px;
  font-size: 1.4rem;
  ::placeholder {
    font-size: 1.1rem;
  }
`

const ShowError = styled.div`
  color: red;
  font-size: 1.2rem
`

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`

const Button = styled.button`
  margin-top: 10px;
  margin-bottom: 10px;
  height: 40px;
  width: 310px;
`

function checkNumber(input: string, decimals: number): bigint {
  let result: bigint
  try {
    result = parseUnits(input, decimals).toBigInt()
  } catch (e) {
    throw new Error('invalid number')
  }
  if (result <= 0n) {
    throw new Error('number must be greater than 0')
  }
  return result
}

export const ElectricityDemo = () => {
  const context = useAlephiumConnectContext()
  const [produceNum, setProduceNum] = useState<{ raw: string, value: bigint } | undefined>()
  const [consumeNum, setConsumeNum] = useState<{ raw: string, value: bigint } | undefined>()
  const [error, setError] = useState<string | undefined>()

  const onIncreaseNumChange = (input: string) => {
    if (input === '') {
      setProduceNum(undefined)
      setError(undefined)
      return
    }
    try {
      setProduceNum({ raw: input, value: checkNumber(input, globalConfig.countDecimals) })
      setError(undefined)
    } catch (error) {
      setProduceNum(undefined)
      setError(`${error}`)
    }
  }

  const onDecreaseNumChange = (input: string) => {
    if (input === '') {
      setConsumeNum(undefined)
      setError(undefined)
      return
    }
    try {
      setConsumeNum({ raw: input, value: checkNumber(input, globalConfig.countDecimals) })
      setError(undefined)
    } catch (error) {
      setConsumeNum(undefined)
      setError(`${error}`)
    }
  }

  const onIncreaseButtonClick = () => {
    if (context.signerProvider !== undefined && produceNum !== undefined) {
      produce(context.signerProvider, produceNum.value).then((result) => {
        setProduceNum(undefined)
        console.log(`increase tx id: ${result.txId}`)
      })
    }
  }

  const onDecreaseButtonClick = () => {
    if (context.signerProvider !== undefined && consumeNum !== undefined && context.account?.address !== undefined) {
      consume(context.signerProvider, consumeNum.value).then((result) => {
        setConsumeNum(undefined)
        console.log(`decrease tx id: ${result.txId}`)
      })
    }
  }

  const increaseEnabled = context.account && error === undefined && produceNum !== undefined
  const decreaseEnabled = context.account && error === undefined && consumeNum !== undefined

  return (
    <>
      <PageContainer>
        <Input
          placeholder='Enter a number'
          onChange={(e) => onIncreaseNumChange(e.target.value)}
          value={produceNum !== undefined ? produceNum.raw : ''}
        />
        <Button
          onClick={onIncreaseButtonClick}
          disabled={!increaseEnabled}
        >
          Produce Electricity (kWh)
        </Button>
        <Input
          placeholder='Enter a number'
          onChange={(e) => onDecreaseNumChange(e.target.value)}
          value={consumeNum !== undefined ? consumeNum.raw : ''}
        />
        <Button
          onClick={onDecreaseButtonClick}
          disabled={!decreaseEnabled}
        >
          Consume Electricity (kWh)
        </Button>
        {error && <ShowError>{error}</ShowError>}
        <ElectricityState/>
        <EventList/>
      </PageContainer>
    </>
  )
}
