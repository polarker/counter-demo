import { useState } from 'react'
import { TxStatus } from './TxStatus'
import { useAlephiumConnectContext } from '@alephium/web3-react'
import { add, counterConfig } from '@/services/utils'
import { parseUnits } from 'ethers/lib/utils'
import styled from 'styled-components'
import { node } from '@alephium/web3'
import { CounterState } from './CounterState'

const Input = styled.input`
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

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Button = styled.button`
  height: 40px;
  width: 100px;
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
  const [ongoingTxId, setOngoingTxId] = useState<string>()
  const [num, setNum] = useState<bigint | undefined>()
  const [error, setError] = useState<string | undefined>()

  const onInputChange = (input: string) => {
    if (input === '') {
      setNum(undefined)
      setError(undefined)
      return
    }
    try {
      setNum(checkNumber(input, counterConfig.decimals))
      setError(undefined)
    } catch (error) {
      setNum(undefined)
      setError(`${error}`)
    }
  }

  const onButtonClick = () => {
    if (context.signerProvider !== undefined && num !== undefined) {
      add(context.signerProvider, num).then((result) => {
        console.log(`tx id: ${result.txId}`)
        setOngoingTxId(result.txId)
      })
    }
  }

  const txStatusCallback = async (status: node.TxStatus) => {
    if (status.type === 'MemPooled') return
    setOngoingTxId(undefined)
  }

  const enabled = context.account && error === undefined && num !== undefined

  return (
    <>
      <PageContainer>
        <Container>
          <Input
            placeholder='Enter a number'
            onChange={(e) => onInputChange(e.target.value)}
          />
          <Button
            onClick={onButtonClick}
            disabled={!enabled}
          >
            Add
          </Button>
        </Container>
        {error && <ShowError>{error}</ShowError>}
        {ongoingTxId && <TxStatus txId={ongoingTxId} txStatusCallback={txStatusCallback}/>}
        <CounterState/>
      </PageContainer>
    </>
  )
}
