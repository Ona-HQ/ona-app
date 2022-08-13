import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { Hero } from '../components/Hero'
import { FundingTrades } from '../components/FundingTrades'
import { Loading } from '../components/Loading';
import { useRouter } from 'next/router'
import { Utils } from '../common/Utils'
import { PublicKey } from '@solana/web3.js';
import { utils } from '@project-serum/anchor';

import { useAnchorWallet } from '@solana/wallet-adapter-react';

const Home: NextPage = ({ setAuthenticated }) => {
  const anchorWallet = useAnchorWallet();
  const router = useRouter();
  const utf8 = utils.bytes.utf8;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAccount = async () => {
      const program = Utils.getProgram(anchorWallet);
      const [userPDA] = await PublicKey.findProgramAddress(
        [utf8.encode('user-account'), anchorWallet.publicKey.toBuffer()],
        program.programId,
      );
      try {
        const account = await program.account.user.fetch(userPDA);
      } catch (e) {
        router.push('/welcome');
      }
      setIsLoading(false);
    };

    if (anchorWallet) {
      setAuthenticated(true);

      if (!localStorage.getItem('ona-skip-welcome')) {
        getAccount();
      } else {
        setIsLoading(false);
      }
    } else {
      setAuthenticated(false);
    }
  }, [anchorWallet]);

  return (
    <>
      {anchorWallet ? (
        <>
          {isLoading ? (
            <Loading />
          ) : (
            <FundingTrades hasAccount={true} />
          )}
        </>
      ) : (
        <Hero />
      )}
    </>
  )
}

export default Home
