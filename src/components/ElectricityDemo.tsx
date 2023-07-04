import { useState } from 'react'
import { useAlephiumConnectContext } from '@alephium/web3-react'
import { produce, consume, globalConfig } from '@/utils'
import { parseUnits } from 'ethers/lib/utils'
import styled from 'styled-components'
import { ElectricityState } from './ElectricityState'
import { EventList } from './Events'

const MaximumElectricity = 1000n * (10n ** BigInt(globalConfig.countDecimals))

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
  if (result > MaximumElectricity) {
    throw new Error('number must be less than 1000.0')
  }
  return result
}

export const ElectricityDemo = () => {
  const context = useAlephiumConnectContext()
  const [produceNumInput, setProduceNumInput] = useState<string | undefined>()
  const [produceNum, setProduceNum] = useState<bigint | undefined>()
  const [consumeNumInput, setConsumeNumInput] = useState<string | undefined>()
  const [consumeNum, setConsumeNum] = useState<bigint | undefined>()
  const [error, setError] = useState<string | undefined>()

  const onProduceNumChange = (input: string) => {
    if (input === '') {
      setProduceNumInput(undefined)
      setProduceNum(undefined)
      setError(undefined)
      return
    }
    try {
      setProduceNumInput(input)
      setProduceNum(checkNumber(input, globalConfig.countDecimals))
      setError(undefined)
    } catch (error) {
      setError(`${error}`)
    }
  }

  const onConsumeNumChange = async (input: string) => {
    if (input === '') {
      setConsumeNumInput(undefined)
      setConsumeNum(undefined)
      setError(undefined)
      return
    }
    try {
      setConsumeNumInput(input)
      setConsumeNum(checkNumber(input, globalConfig.countDecimals))
      setError(undefined)
    } catch (error) {
      setError(`${error}`)
    }
  }

  const onProduceButtonClick = () => {
    if (context.signerProvider !== undefined && produceNum !== undefined) {
      produce(context.signerProvider, produceNum).then((result) => {
        setProduceNum(undefined)
        setProduceNumInput(undefined)
        console.log(`produce tx id: ${result.txId}`)
      })
    }
  }

  const onConsumeButtonClick = () => {
    if (context.signerProvider !== undefined && consumeNum !== undefined && context.account?.address !== undefined) {
      consume(context.signerProvider, consumeNum).then((result) => {
        setConsumeNum(undefined)
        setConsumeNumInput(undefined)
        console.log(`consume tx id: ${result.txId}`)
      })
    }
  }

  const produceEnabled = context.account && error === undefined && produceNum !== undefined
  const consumeEnabled = context.account && error === undefined && consumeNum !== undefined

  return (
    <>
      <PageContainer>
        <InputContainer>
          <Input
            placeholder='Enter a number'
            onChange={(e) => onProduceNumChange(e.target.value)}
            value={produceNumInput !== undefined ? produceNumInput : ''}
          />
          <Button
            onClick={onProduceButtonClick}
            disabled={!produceEnabled}
          >
            Produce Electricity (kWh)
          </Button>
          <Input
            placeholder='Enter a number'
            onChange={(e) => onConsumeNumChange(e.target.value)}
            value={consumeNumInput !== undefined ? consumeNumInput : ''}
          />
          <Button
            onClick={onConsumeButtonClick}
            disabled={!consumeEnabled}
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