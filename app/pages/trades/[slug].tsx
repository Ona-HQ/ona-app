import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { Utils } from '../../common/Utils'

import { PublicKey } from '@solana/web3.js';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Container } from '../../components/Container'
import { TradeLayout } from '../../components/TradeLayout'
import { Loading } from '../../components/Loading';

const TradeDetails: NextPage = () => {
  const router = useRouter()
  const { slug } = router.query
  const [trade, setTrade] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const anchorWallet = useAnchorWallet();

  useEffect(() => {
    if (!anchorWallet) {
      return;
    }

    const tryLoadUser = async () => {
      const program = Utils.getProgram(anchorWallet);

      const account = await program.account.trade.fetch(slug);
      if (account && account.id) {
        setTrade({ account: account, publicKey: new PublicKey(slug) });
      }
      setIsLoading(false);
    };

    tryLoadUser();
  }, [anchorWallet]);

  return (
    <Container>
      {isLoading ? (
        <div className="flex flex-wrap mb-12">
          <Loading />
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl pb-4">Trade {parseInt(trade.account.id)}</h2>
          <TradeLayout trade={trade.account} publicKey={trade.publicKey} view='lg' />
        </>
      )}
    </Container>
  )
};

export default TradeDetails
