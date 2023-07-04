import Head from 'next/head'
import { ElectricityDemo } from '@/components/ElectricityDemo'
import { AlephiumConnectButton } from '@alephium/web3-react'

export default function Home() {
  return (
    <>
      <div>
        <AlephiumConnectButton />
        <Head>
          <title>Electricity Demo</title>
          <meta name="description" content="Electricity Demo" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <ElectricityDemo/>
      </div>
    </>
  )
}
