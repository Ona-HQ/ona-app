import { useEffect } from 'react'
import type { NextPage } from 'next'
import { Hero } from '../components/Hero'
import { ActiveTrades } from '../components/ActiveTrades'

import { useAnchorWallet } from '@solana/wallet-adapter-react';

const Active: NextPage = ({ setAuthenticated }) => {
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
        <ActiveTrades hasAccount={true} />
      ) : (
        <Hero />
      )}
    </>
  )
}

export default Active
