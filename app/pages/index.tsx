import { useEffect } from 'react'
import type { NextPage } from 'next'
import { Hero } from '../components/Hero'
import { Trades } from '../components/Trades'

import { useAnchorWallet } from '@solana/wallet-adapter-react';

const Home: NextPage = ({ setAuthenticated }) => {
  const anchorWallet = useAnchorWallet();

  useEffect(() => {
    if (anchorWallet) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, [anchorWallet]);

  return (
    <>
      {anchorWallet ? (
        <Trades />
      ) : (
        <Hero />
      )}
    </>
  )
}

export default Home
