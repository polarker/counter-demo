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
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
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
  const [produceNum, setProduceNum] = useState<string | undefined>()
  const [consumeNum, setConsumeNum] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()

  const onProduceNumChange = (input: string) => {
    if (input === '') {
      setProduceNum(undefined)
      setError(undefined)
      return
    }
    try {
      setProduceNum(input)
      checkNumber(input, globalConfig.countDecimals)
      setError(undefined)
    } catch (error) {
      setError(`${error}`)
    }
  }

  const onConsumeNumChange = async (input: string) => {
    if (input === '') {
      setConsumeNum(undefined)
      setError(undefined)
      return
    }
    try {
      setConsumeNum(input)
      checkNumber(input, globalConfig.countDecimals)
      setError(undefined)
    } catch (error) {
      setError(`${error}`)
    }
  }

  const onIncreaseButtonClick = () => {
    if (context.signerProvider !== undefined && produceNum !== undefined) {
      produce(context.signerProvider, checkNumber(produceNum, globalConfig.countDecimals)).then((result) => {
        setProduceNum(undefined)
        console.log(`increase tx id: ${result.txId}`)
      })
    }
  }

  const onDecreaseButtonClick = () => {
    if (context.signerProvider !== undefined && consumeNum !== undefined && context.account?.address !== undefined) {
      consume(context.signerProvider, checkNumber(consumeNum, globalConfig.countDecimals)).then((result) => {
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
        <InputContainer>
          <Input
            placeholder='Enter a number'
            onChange={(e) => onProduceNumChange(e.target.value)}
            value={produceNum !== undefined ? produceNum : ''}
          />
          <Button
            onClick={onIncreaseButtonClick}
            disabled={!increaseEnabled}
          >
            Produce Electricity (kWh)
          </Button>
          <Input
            placeholder='Enter a number'
            onChange={(e) => onConsumeNumChange(e.target.value)}
            value={consumeNum !== undefined ? consumeNum : ''}
          />
          <Button
            onClick={onDecreaseButtonClick}
            disabled={!decreaseEnabled}
          >
            Consume Electricity (kWh)
          </Button>
          {error && <ShowError>{error}</ShowError>}
          <ElectricityState/>
        </InputContainer>
        <EventList/>
      </PageContainer>
    </>
  )
}