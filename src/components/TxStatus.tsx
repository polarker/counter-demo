import { node } from '@alephium/web3'
import { useTxStatus } from '@alephium/web3-react'
import styled from 'styled-components'

const StyledText = styled.p`
  text-align: center;
  font-size: 1rem;
`

const Space = styled.div`
  flex: 1,
  width: 100vw,
`

interface TxStatusAlertProps {
  txId: string
  txStatusCallback(status: node.TxStatus): Promise<any>
}


export const TxStatus = ({ txId, txStatusCallback }: TxStatusAlertProps) => {
  const { txStatus } = useTxStatus(txId, txStatusCallback)

  return (
    <>
      <Space/>
      {txStatus?.type === 'MemPooled' ? <StyledText>Waiting for tx confirmation...</StyledText> : null}
    </>
  )
}
