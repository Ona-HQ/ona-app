import { useEffect } from 'react'
import type { NextPage } from 'next'
import { Hero } from '../components/Hero'
import { Globals } from '../models/Globals'
import { Container } from '../components/Container'
import { Connection } from '@solana/web3.js';

import { useAnchorWallet } from '@solana/wallet-adapter-react';

const Admin: NextPage = ({ setAuthenticated }) => {
  const anchorWallet = useAnchorWallet();

  const getStatus = async () => {
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, "processed");
    const txId = '3qayaKMCCHAN3pUphvdmsMHRFGYGzcRFGw6mzU9GvGdiKDaL8WNBL53F3JcNiqdnL6Hs3GBNTmM3XGVCXQRXnqCa';

    const getConfirmation = async (connection: Connection, tx: string) => {
      const result = await connection.getSignatureStatus(tx, {
        searchTransactionHistory: true,
      });
      console.log(result);
      return result.value?.confirmationStatus;
    };

    getConfirmation(connection, txId);
  }

  const createGlobals = async () => {
    if (!anchorWallet) {
      return;
    }

    // getStatus();
    const tx = await Globals.createGlobals(anchorWallet);
    tx.rpc().then((response) => {
      console.log(response);
    });
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
