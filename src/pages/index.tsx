import Head from 'next/head'
import { CounterDemo } from '@/components/CounterDemo'
import { AlephiumConnectButton, useAccount } from '@alephium/web3-react'

export default function Home() {
  return (
    <>
      <div>
        <AlephiumConnectButton />
        <Head>
          <title>Counter Demo</title>
          <meta name="description" content="Counter Demo" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <CounterDemo/>
      </div>
    </>
  )
}
