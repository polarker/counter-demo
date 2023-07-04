import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { EventType } from './Events';
import { formatUnits } from 'ethers/lib/utils';
import { globalConfig } from '@/utils';
import { ElectricityTypes } from "artifacts/ts";
import ExternalLink from './StyledLink';
import { Paper } from '@mui/material';

function shorten(str: string): string {
  return str.slice(0, 12) + '...' + str.slice(-12)
}

function Link({ text, type } : { text: string, type: 'transactions' | 'addresses' }) {
  const url = globalConfig.network === 'devnet'
    ? `http://localhost:23000/${type}/${text}`
    : globalConfig.network === 'testnet'
    ? `https://explorer.testnet.alephium.org/${type}/${text}`
    : `https://explorer.alephium.org/${type}/${text}`
  return <ExternalLink to={url}>{shorten(text)}</ExternalLink>
}

function Row({ event } : { event: EventType }) {
  switch (event.name) {
    case 'ElectricityProduced':
      const produceEvent = event as ElectricityTypes.ElectricityProducedEvent
      return (
        <React.Fragment>
          <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell align="center"><Link text={produceEvent.txId} type={'transactions'}/></TableCell>
            <TableCell align="center"><Link text={produceEvent.fields.from} type={'addresses'}/></TableCell>
            <TableCell align="center">{produceEvent.name}</TableCell>
            <TableCell align="center">{formatUnits(produceEvent.fields.num, globalConfig.countDecimals)} kWh</TableCell>
            <TableCell align="center">None</TableCell>
          </TableRow>
        </React.Fragment>
      )
    case 'ElectricityConsumed':
      const consumeEvent = event as ElectricityTypes.ElectricityConsumedEvent
      return (
        <React.Fragment>
          <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell align="center"><Link text={consumeEvent.txId} type={'transactions'}/></TableCell>
            <TableCell align="center"><Link text={consumeEvent.fields.to} type={'addresses'}/></TableCell>
            <TableCell align="center">{consumeEvent.name}</TableCell>
            <TableCell align="center">{formatUnits(consumeEvent.fields.num, globalConfig.countDecimals)} kWh</TableCell>
            <TableCell align="center">{formatUnits(consumeEvent.fields.rewardAmount, 18)} {globalConfig.tokenSymbol}</TableCell>
          </TableRow>
        </React.Fragment>
      )
    default:
      throw new Error('unknown event')
  }
}

export default function ListEvents({ events } : { events: EventType[] }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Tx Id</TableCell>
            <TableCell align="center">Caller Address</TableCell>
            <TableCell align="center">Event Type</TableCell>
            <TableCell align="center">Electricity</TableCell>
            <TableCell align="center">Reward</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (<Row key={event.txId} event={event} />))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}