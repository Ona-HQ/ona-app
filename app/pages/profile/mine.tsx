import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { Hero } from '../../components/Hero'
import { Globals } from '../../models/Globals'
import { Container } from '../../components/Container'
import { TradeLayout } from '../../components/TradeLayout';
import { Connection } from '@solana/web3.js';
import { Utils } from '../../common/Utils'
import { PublicKey } from '@solana/web3.js';
import { utils } from '@project-serum/anchor';
import { Loading } from '../../components/Loading';
import Link from 'next/link'

import { useAnchorWallet } from '@solana/wallet-adapter-react';

const Mine: NextPage = () => {
  const [account, setAccount] = useState({});
  const [startedTrades, setStartedTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const anchorWallet = useAnchorWallet();
  const utf8 = utils.bytes.utf8;

  useEffect(() => {
    if (!anchorWallet) {
      return;
    }

    const tryLoadUser = async () => {
      const program = Utils.getProgram(anchorWallet);

      const [userPDA] = await PublicKey.findProgramAddress(
        [utf8.encode('user-account'), anchorWallet.publicKey.toBuffer()],
        program.programId,
      );
      const account = await program.account.user.fetch(userPDA);
      if (account && account.id) {
        setAccount(account);
        if (account.startedTrades.length > 0) {
          let trades = await program.account.trade.fetchMultiple(account.startedTrades);
          trades = trades.filter((element) => { return !element.state['awaitingMangoAccount']; });

          setStartedTrades(trades);
        }
      }
      setIsLoading(false);
    };

    tryLoadUser();
  }, [anchorWallet]);

  return (
    <Container className="min-h-full">
      {anchorWallet && isLoading ? (
        <Loading />
      ) : anchorWallet ? (
        <div>
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase mb-4">My Profile</h2>
          </div>
          <div className="sm:hidden">
            <label for="tabs" className="sr-only">Select a tab</label>
            <select id="tabs" name="tabs" className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
              <option selected>Funded Trades</option>
              <option>My Trades</option>
            </select>
          </div>
          <div className="hidden sm:block mb-12">
            <nav className="relative z-0 rounded-lg shadow flex divide-x divide-gray-200" aria-label="Tabs">
              <Link href="/profile">
                <a className="text-gray-500 hover:text-gray-700 group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10">
                  <span>Funded Trades</span>
                  <span aria-hidden="true" className="bg-transparent absolute inset-x-0 bottom-0 h-0.5"></span>
                </a>
              </Link>

              <Link href="/profile/mine">
                <a className="text-gray-900 rounded-l-lg group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10" aria-current="page">
                  <span>Trades I initiated</span>
                  <span aria-hidden="true" className="bg-indigo-500 absolute inset-x-0 bottom-0 h-0.5"></span>
                </a>
              </Link>

              <Link href="/profile/unregistered">
                <a className="text-gray-500 hover:text-gray-700 group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10">
                  <span>My Unregistered Trades</span>
                  <span aria-hidden="true" className="bg-transparent absolute inset-x-0 bottom-0 h-0.5"></span>
                </a>
              </Link>
            </nav>
          </div>

          {startedTrades.length > 0 ? (
            <>
              {startedTrades.map(trade => <TradeLayout trade={trade} publicKey={new PublicKey('6xX6va3gazvrW6YABGh2DVEaKtm3M4qBRRmjj1Vt1XNb')} view='sm' />)}
            </>
          ) : (
            <Link href="/trades/new">
              <a type="button" className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6" />
                </svg>
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Start a new trade
                </span>
              </a>
            </Link>
          )}
        </div>
      ) : (
        <Hero />
      )}
    </Container>
  )
}

export default Mine
