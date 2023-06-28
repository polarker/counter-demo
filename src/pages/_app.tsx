import type { AppProps } from 'next/app'
import { AlephiumConnectProvider } from '@alephium/web3-react'
import { counterConfig } from '@/services/utils'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AlephiumConnectProvider
      useTheme="web95"
      network={counterConfig.network}
      addressGroup={counterConfig.groupIndex}
    >
      <Component {...pageProps} />
    </AlephiumConnectProvider>
  )
}
