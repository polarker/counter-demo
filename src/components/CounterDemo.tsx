import { useState } from 'react'
import { useAlephiumConnectContext } from '@alephium/web3-react'
import { increase, decrease, counterConfig } from '@/services/utils'
import { parseUnits } from 'ethers/lib/utils'
import styled from 'styled-components'
import { CounterState } from './CounterState'
import { Address, isBase58 } from '@alephium/web3'
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

export const CounterDemo = () => {
  const context = useAlephiumConnectContext()
  const [increaseNum, setIncreaseNum] = useState<{ raw: string, value: bigint } | undefined>()
  const [decreaseNum, setDecreaseNum] = useState<{ raw: string, value: bigint } | undefined>()
  // const [toAddress, setToAddress] = useState<Address | undefined>()
  const [error, setError] = useState<string | undefined>()

  const onIncreaseNumChange = (input: string) => {
    if (input === '') {
      setIncreaseNum(undefined)
      setError(undefined)
      return
    }
    try {
      setIncreaseNum({ raw: input, value: checkNumber(input, counterConfig.countDecimals) })
      setError(undefined)
    } catch (error) {
      setIncreaseNum(undefined)
      setError(`${error}`)
    }
  }

  const onDecreaseNumChange = (input: string) => {
    if (input === '') {
      setDecreaseNum(undefined)
      setError(undefined)
      return
    }
    try {
      setDecreaseNum({ raw: input, value: checkNumber(input, counterConfig.countDecimals) })
      setError(undefined)
    } catch (error) {
      setDecreaseNum(undefined)
      setError(`${error}`)
    }
  }

  // const onAddressChange = (input: string) => {
  //   if (input === '') {
  //     setToAddress(undefined)
  //     setError(undefined)
  //   } else if (isBase58(input)) {
  //     setToAddress(input)
  //   } else {
  //     setError('Invalid to address')
  //   }
  // }

  const onIncreaseButtonClick = () => {
    if (context.signerProvider !== undefined && increaseNum !== undefined) {
      increase(context.signerProvider, increaseNum.value).then((result) => {
        setIncreaseNum(undefined)
        console.log(`increase tx id: ${result.txId}`)
      })
    }
  }

  const onDecreaseButtonClick = () => {
    if (context.signerProvider !== undefined && decreaseNum !== undefined && context.account?.address !== undefined) {
      decrease(context.signerProvider, decreaseNum.value, context.account.address).then((result) => {
        setDecreaseNum(undefined)
        console.log(`decrease tx id: ${result.txId}`)
      })
    }
  }

  const increaseEnabled = context.account && error === undefined && increaseNum !== undefined
  const decreaseEnabled = context.account && error === undefined && decreaseNum !== undefined

  return (
    <>
      <PageContainer>
        <Input
          placeholder='Enter a number'
          onChange={(e) => onIncreaseNumChange(e.target.value)}
          value={increaseNum !== undefined ? increaseNum.raw : ''}
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
          value={decreaseNum !== undefined ? decreaseNum.raw : ''}
        />
        {/* <Input
          placeholder='Enter an address'
          onChange={(e) => onAddressChange(e.target.value)}
        /> */}
        <Button
          onClick={onDecreaseButtonClick}
          disabled={!decreaseEnabled}
        >
          Consume Electricity (kWh)
        </Button>
        {error && <ShowError>{error}</ShowError>}
        <CounterState/>
        <EventList/>
      </PageContainer>
    </>
  )
}
