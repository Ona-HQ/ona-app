import { useEffect } from 'react'
import type { NextPage } from 'next'
import { Hero } from '../components/Hero'
import { Globals } from '../models/Globals'
import { Container } from '../components/Container'

import { useAnchorWallet } from '@solana/wallet-adapter-react';

const Admin: NextPage = ({ setAuthenticated }) => {
  const anchorWallet = useAnchorWallet();

  const createGlobals = async () => {
    if (!anchorWallet) {
      return;
    }

    const tx = await Globals.createGlobals(anchorWallet);
    tx.rpc();
  }

  useEffect(() => {
    if (anchorWallet) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, [anchorWallet]);

  return (
    <Container>
      {anchorWallet ? (
        <button onClick={() => createGlobals()}>Create Globals</button>
      ) : (
        <Hero />
      )}
    </Container>
  )
}

export default Admin
