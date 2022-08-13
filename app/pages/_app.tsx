import '../styles/globals.css'

import { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import WalletContextProvider from '../components/WalletContextProvider';
import { AutoConnectProvider } from '../components/AutoConnectProvider';
import { Layout } from '../components/Layout'
import { Footer } from '../components/Footer'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <ChakraProvider>
      <AutoConnectProvider>
        <WalletContextProvider>
          <Head>
            <title>Ona - Trading together made easy</title>
            <meta
              name="description"
              content="Solana social trading"
            />
          </Head>
          <Layout authenticated={authenticated}>
            <Component setAuthenticated={setAuthenticated} {...pageProps} />
          </Layout>
          <Footer />
        </WalletContextProvider>
      </AutoConnectProvider>
    </ChakraProvider>
  )
}

export default MyApp
