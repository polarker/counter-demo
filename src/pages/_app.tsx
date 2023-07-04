import type { AppProps } from 'next/app'
import { AlephiumConnectProvider } from '@alephium/web3-react'
import { globalConfig } from '@/utils'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AlephiumConnectProvider
      useTheme="web95"
      network={globalConfig.network}
      addressGroup={globalConfig.groupIndex}
    >
      <Component {...pageProps} />
    </AlephiumConnectProvider>
  )
}
