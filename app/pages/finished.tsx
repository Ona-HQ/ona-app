import { useEffect } from 'react'
import type { NextPage } from 'next'
import { Hero } from '../components/Hero'
import { FinishedTrades } from '../components/FinishedTrades'

import { useAnchorWallet } from '@solana/wallet-adapter-react';

const Finished: NextPage = ({ setAuthenticated }) => {
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
        <FinishedTrades hasAccount={true} />
      ) : (
        <Hero />
      )}
    </>
  )
}

export default Finished
