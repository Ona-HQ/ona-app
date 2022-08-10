import { Connection, PublicKey } from '@solana/web3.js';
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { Container } from '../components/Container'
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { TradeLayout } from '../components/TradeLayout';
import { Loading } from '../components/Loading';
import { Utils } from '../common/Utils'
import { useRouter } from 'next/router'
import bs58 from 'bs58';

export const ActiveTrades: FC = ({ hasAccount }) => {
  const router = useRouter()
  const anchorWallet = useAnchorWallet();
  const [isLoading, setIsLoading] = useState(true);
  const [trades, setTrades] = useState([]);

  const redirectNewTrade = () => {
    router.push('/trades/new')
  }

  useEffect(() => {
    const fetchAllTrades = async () => {
      const program = Utils.getProgram(anchorWallet);
      let trades = await program.account['trade'].all();
      // TODO: turn into query?
      trades = trades.filter((element) => { return element.account.state['initiatedTrade']; });

      setTrades(trades);
      setIsLoading(false);
    };

    if (!anchorWallet) {
      return;
    }
    fetchAllTrades();
  }, [anchorWallet])

  return (
    <Container className="pb-16 pt-4 h-full">  
      {isLoading ? (
        <div className="flex flex-wrap">
          <Loading />
        </div>
      ) : (
        <div>
          <div class="text-center">
            <h2 class="text-base font-semibold text-indigo-600 tracking-wide uppercase mb-4">Home</h2>
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
              <Link href="/">
                <a className="text-gray-500 hover:text-gray-700 group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10">
                  <span>Trades raising funding</span>
                  <span aria-hidden="true" className="bg-transparent absolute inset-x-0 bottom-0 h-0.5"></span>
                </a>
              </Link>

              <Link href="/active">
                <a className="text-gray-900 rounded-l-lg group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10" aria-current="page">
                  <span>Active Trades</span>
                  <span aria-hidden="true" className="bg-indigo-500 absolute inset-x-0 bottom-0 h-0.5"></span>
                </a>
              </Link>

              <Link href="/finished">
                <a className="text-gray-500 hover:text-gray-700 group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10">
                  <span>Recently finished Trades</span>
                  <span aria-hidden="true" className="bg-transparent absolute inset-x-0 bottom-0 h-0.5"></span>
                </a>
              </Link>
            </nav>
          </div>
          
          {trades.length > 0 ? (
            <div className="grid grid-cols-2 mt-2 mb-2">
              {trades.map(trade => <TradeLayout trade={trade.account} publicKey={trade.publicKey} view='sm' />)}
            </div>
          ) : hasAccount ? (
            <button type="button" onClick={() => redirectNewTrade()} className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6" />
              </svg>
              <span className="mt-2 block text-sm font-medium text-gray-900">
                No trades are currently active. Start a new trade
              </span>
            </button>
          ) : (
            <button type="button" className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6" />
              </svg>
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Use the create account button above to get started
              </span>
            </button>
          )}
        </div>
      )}
    </Container>
  )
}
