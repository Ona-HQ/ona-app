import { FC, useEffect, useState } from 'react';
import { Trade } from '../models/Trade'
import { MangoAccount } from '../models/MangoAccount'
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { utils, BN } from '@project-serum/anchor';
import { Utils } from '../common/Utils'
import { Connection, PublicKey } from '@solana/web3.js';
import Link from 'next/link'
import { useRouter } from 'next/router'

import { FundTradeModal } from '../components/FundTradeModal'
import { DepositToMangoModal } from '../components/DepositToMangoModal'
import { CancelAllOrdersModal } from '../components/CancelAllOrdersModal'
import { MarketCloseModal } from '../components/MarketCloseModal'

import { MangoClient } from "@blockworks-foundation/mango-client";
import { TxStatus } from '../components/TxStatus'

export const TradeLayout: FC = ({ trade, publicKey, view }) => {
  const router = useRouter();

  const [showFundModal, setShowFundModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showMarketCloseModal, setShowMarketCloseModal] = useState(false);

  const [tradeObject, setTrade] = useState(trade);
  const [hasFundedTrade, setHasFundedTrade] = useState(false);
  const [account, setAccount] = useState({});
  const [tradeFunding, setTradeFunding] = useState({});
  const [totalTrades, setTotalTrades] = useState(0);

  const [percentageFunded, setPercentageFunded] = useState(100 * parseFloat(trade.totalFunding) / parseFloat(trade.fundingGoal));
  const [minPercentage, setMinPercentage] = useState(Math.max(5, percentageFunded));
  const [tradeSuccessPercentage, setTradeSuccessPercentage] = useState();

  const [tradePDA, setTradePDA] = useState('');
  const [userPDA, setUserPDA] = useState('');
  const [mangoAccount, setMangoAccount] = useState('');
  const [mangoUrl, setMangoUrl] = useState('');
  const [tx, setTx] = useState({});
  const [txId, setTxId] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const anchorWallet = useAnchorWallet();
  const utf8 = utils.bytes.utf8;
  const startTime = new Date(1000 * parseInt(trade.createdAt.toString(), 10));
  const tradeSuccessful = trade.resultAmount > trade.totalFunding;

  const processTransaction = async (tx) => {
    try {
      const response = await tx.rpc();
      setTxId(response);
      if (Utils.getTransactionStatus(response)) {
        setIsSuccess(true);
        await reloadTrade();
      } else {
        setError({ message: 'An error with the transaction occurred. Check the transaction and try again.' });
      }
    } catch (error) {
      setError(error);
    }
  };

  const reloadTrade = async () => {
    if (!anchorWallet) {
      return;
    }

    const program = Utils.getProgram(anchorWallet);
    const newTrade = await program.account.trade.fetch(publicKey);
    setTrade(newTrade);
    setPercentageFunded(100 * parseFloat(newTrade.totalFunding) / parseFloat(newTrade.fundingGoal));
    setMinPercentage(Math.max(5, percentageFunded));
  };

  useEffect(() => {
    if (!anchorWallet) {
      return;
    }

    const loadMangoAccount = async (tradePDA) => {
      const [groupConfig, clusterData, clusterUrl] = Utils.getMangoGroupConfig();
      const mangoGroupKey = groupConfig.publicKey;

      const mangoConnection = new Connection(clusterUrl, 'singleGossip');
      const client = new MangoClient(mangoConnection, mangoProgramIdPk);
      const mangoGroup = await client.getMangoGroup(mangoGroupKey);
      const mangoProgramIdPk = new PublicKey(clusterData.mangoProgramId);

      const [mangoAccountPk] = await PublicKey.findProgramAddress(
        [
          mangoGroup.publicKey.toBytes(),
          tradePDA.toBytes(),
          trade.id.toArrayLike(Buffer, 'le', 8) //.toBuffer('le', 8)
        ],
        mangoProgramIdPk,
      );

      setMangoAccount(mangoAccountPk);
      if (process.env.NEXT_PUBLIC_NETWORK === 'devnet') {
        setMangoUrl(`https://devnet.mango.markets/account?pubkey=${mangoAccountPk}`);
      }  else {
        setMangoUrl(`https://trade.mango.markets/account?pubkey=${mangoAccountPk}`);
      }
    };

    const loadFunding = async (tradePDA) => {
      try {
        const [fundingPDA] = await PublicKey.findProgramAddress(
          [utf8.encode('new-funding'), tradePDA.toBuffer(), anchorWallet.publicKey.toBuffer()],
          program.programId
        )
        const funding = await program.account.tradeFunding.fetch(fundingPDA);
        setTradeFunding(funding);
        setHasFundedTrade(true);
      } catch (_e) {
        setHasFundedTrade(false);
      }
    };

    const loadTradePDA = async () => {
      const [tradePDA] = await PublicKey.findProgramAddress(
        [utf8.encode('new-trade'), trade.owner.toBuffer(), new BN(trade.id).toArrayLike(Buffer, 'be', 8)],
        program.programId,
      );

      setTradePDA(tradePDA);
      loadMangoAccount(tradePDA);
      loadFunding(tradePDA);
    };

    const tryLoadUser = async () => {
      const [userPDA] = await PublicKey.findProgramAddress(
        [utf8.encode('user-account'), trade.owner.toBuffer()],
        program.programId,
      );
      const account = await program.account.user.fetch(userPDA);
      if (account && account.id) {
        setAccount(account);
        setUserPDA(userPDA);
        const totalTrades = parseInt(account.successfulTrades) + parseInt(account.failedTrades);
        setTotalTrades(totalTrades);
        if (totalTrades > 0) {
          setTradeSuccessPercentage(100 * parseInt(account.successfulTrades) / totalTrades);
        } else {
          setTradeSuccessPercentage(0);
        }
      }
      setIsLoading(false);
    };

    const program = Utils.getProgram(anchorWallet);
    tryLoadUser();
    loadTradePDA();
  }, [anchorWallet]);

  const createMangoAccount = async () => {
    if (!anchorWallet) {
      return;
    }

    const tx = await MangoAccount.create(anchorWallet, trade);
    await processTransaction(tx);
  };

  const placeOrder = async () => {
    if (!anchorWallet) {
      return;
    }

    const tx = await MangoAccount.placePerpOrder(anchorWallet, trade, tradePDA, mangoAccount);
    await processTransaction(tx);
  }

  const settleTrade = async () => {
    if (!anchorWallet) {
      return;
    }

    const tx = await MangoAccount.settleTrade(anchorWallet);
    await processTransaction(tx);
  }

  const withdraw = async () => {
    if (!anchorWallet) {
      return;
    }

    const tx = await MangoAccount.withdraw(anchorWallet, trade, tradePDA, mangoAccount);
    await processTransaction(tx);
  }

  const withdrawLeftover = async () => {
    if (!anchorWallet) {
      return;
    }

    const tx = await Trade.withdrawLeftover(anchorWallet, trade, tradePDA, mangoAccount);
    await processTransaction(tx);
  }

  return (
    <>
      {txId || error ? (
        <TxStatus txId={txId} error={error} isSuccess={isSuccess} setTxId={setTxId} setError={setError} setIsSuccess={setIsSuccess} />
      ) : null}

      <div className="wrapper pt-10 px-8 flex flex-col border dark:border-0 mb-12 mr-4">
        <article className="mb-4 break-inside p-4 rounded-xl bg-white dark:bg-slate-800 flex flex-col place-self-center bg-clip-border w-full">
          {showFundModal ? (
            <FundTradeModal
              anchorWallet={anchorWallet}
              trade={tradeObject}
              userPDA={userPDA}
              setShowFundModal={setShowFundModal}
              setTxId={setTxId}
              processTransaction={processTransaction}
            />
          ) : null}
          {showDepositModal ? (
            <DepositToMangoModal
              anchorWallet={anchorWallet}
              trade={tradeObject}
              setShowDepositModal={setShowDepositModal}
              setTxId={setTxId}
              processTransaction={processTransaction}
            />
          ) : null}

          {showCancelModal ? (
            <CancelAllOrdersModal
              anchorWallet={anchorWallet}
              trade={tradeObject}
              tradePDA={tradePDA}
              mangoAccount={mangoAccount}
              setShowCancelModal={setShowCancelModal}
              setTxId={setTxId}
              processTransaction={processTransaction}
            />
          ) : null}

          {showMarketCloseModal ? (
            <MarketCloseModal
              anchorWallet={anchorWallet}
              trade={tradeObject}
              tradePDA={tradePDA}
              mangoAccount={mangoAccount}
              setShowMarketCloseModal={setShowMarketCloseModal}
              setTxId={setTxId}
              processTransaction={processTransaction}
            />
          ) : null}
          
          <div className="flex pb-6 items-center justify-between">
            <div className="flex">
              <a target="_blank" className="inline-block mr-4" href={`https://www.twitter.com/${account.twitter}`}>
                <img className="rounded-full max-w-none w-12 h-12" src={`https://unavatar.io/twitter/${account.twitter}`} />
              </a>
              <div className="flex flex-col">
                <div>
                  <a className="inline-block text-lg font-bold dark:text-white" href={`https://www.twitter.com/${account.twitter}`}>@{account.twitter}</a>
                  <span className="dark:text-white ml-4 mr-4">&bull;</span>
                  <span className="inline-block text-sm font-bold dark:text-white">
                    {tradeSuccessPercentage}% <span className="mr-4 ml-4">&bull;</span> {totalTrades} trade(s)
                  </span>
                </div>
                <div onClick={() => showTx()} className="text-slate-500 dark:text-slate-300 dark:text-slate-400">
                  {startTime.toLocaleDateString()} 
                </div>
              </div>
            </div>
          </div>
          <span className="grid grid-cols-8">
            <Link href={`/trades/${publicKey.toBase58()}`}>
              <a className="col-span-7 text-3xl font-extrabold dark:text-white">
                {trade.title}
              </a>
            </Link>
            <span className={`items-center self-center p-2 font-bold rounded text-center text-sm font-medium ${trade.direction ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {trade.direction ? 'Long' : 'Short'}
            </span>
          </span>
          {tradeObject.state['awaitingMangoAccount'] ? (
            <div className="py-4">
              <div class="rounded-md bg-red-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">Register your trade as a Mango account below for it to be eligible for funding</h3>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <div className="flex justify-between gap-1 mb-1">
                 <Link target="_blank" href={`${trade.chart}`}>
                  <a className="flex" href="#">
                    <img className="max-w-full rounded-tl-lg" src={`${trade.chartImageUrl}`} />
                  </a>
                </Link>
              </div>
            </div>
          )}
          <p className="dark:text-slate-200">
            {trade.description}
          </p>

          <div className="mt-10 bg-white sm:pb-12 dark:bg-slate-800">
            <div className="relative">
              <div className="absolute inset-0 h-1/2 bg-gray-50"></div>
              <div className="relative max-w-full mx-auto">
                <div className="text-center mx-auto">
                  <dl className="rounded-lg dark:rounded-none bg-white dark:bg-slate-800 sm:grid sm:grid-cols-5">
                    <div className="flex flex-col border-b border-gray-100 dark:border-white p-2 text-center sm:border-0 sm:border-r">
                      <dt className="order-2 mt-2 text-sm leading-6 font-medium text-gray-500 dark:text-gray-300">Asset</dt>
                      <dd className="order-1 text-md font-extrabold text-indigo-600 dark:text-white">{trade.asset}</dd>
                    </div>
                    <div className="flex flex-col border-t border-b border-gray-100 p-2 text-center sm:border-0 sm:border-l sm:border-r">
                      <dt className="order-2 mt-2 text-sm leading-6 font-medium text-gray-500 dark:text-gray-300">Entry Price</dt>
                      <dd className="order-1 text-md font-extrabold text-indigo-600 dark:text-white">${parseFloat(trade.entryPrice / 1000000)}</dd>
                    </div>
                    <div className="flex flex-col border-t border-gray-100 p-2 text-center sm:border-0 sm:border-l">
                      <dt className="order-2 mt-2 text-sm leading-6 font-medium text-gray-500 dark:text-gray-300">Target Price</dt>
                      <dd className="order-1 text-md font-extrabold text-indigo-600 dark:text-white">${parseFloat(trade.targetPrice / 1000000)}</dd>
                    </div>
                    <div className="flex flex-col border-t border-gray-100 p-2 text-center sm:border-0 sm:border-l">
                      <dt className="order-2 mt-2 text-sm leading-6 font-medium text-gray-500 dark:text-gray-300">{view == 'sm' ? 'Lvg' : 'Leverage'}</dt>
                      <dd className="order-1 text-md font-extrabold text-indigo-600 dark:text-white">{trade.leverage}x</dd>
                    </div>
                    <div className="flex flex-col border-t border-gray-100 p-2 text-center sm:border-0 sm:border-l">
                      <dt className="order-2 mt-2 text-sm leading-6 font-medium text-gray-500 dark:text-gray-300">{view == 'sm' ? 'Liq. Price' : 'Liquidation Price'}</dt>
                      <dd className="order-1 text-md font-extrabold text-indigo-600 dark:text-white">N/A</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full pb-12">
            <div>
              <div className="text-white float-left ml-4">${parseFloat(tradeObject.totalFunding / 1000000)}</div>
              <div className="text-gray-600 float-right mr-4 dark:text-white">${parseFloat(trade.fundingGoal / 1000000)}</div>
            </div>
            <div className="mb-4 w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700">
              <div className="h-6 bg-indigo-600 rounded-full dark:bg-blue-500 font-medium text-center text-white" style={{width: `${minPercentage}%`}}></div>
            </div>
          </div>

          <div className="grid grid-cols-3">
            <Link target="_blank" href={`${trade.chart}`}>
              <a className="inline-flex items-center" target="_blank">
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="dark:text-white h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </span>
                <span className="text-md font-bold dark:text-white">View on TradingView</span>
              </a>
            </Link>

            {!tradeObject.state['awaitingMangoAccount'] ? (
              <Link href={mangoUrl}>
                <a target="_blank" className="inline-flex items-center text-center content-center justify-self-center">
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="dark:text-white h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </span>
                  <span className="text-md font-bold dark:text-white">View Mango Account</span>
                </a>
              </Link>
            ) : (
              <button onClick={() => {createMangoAccount()}}>
                <a className="inline-flex items-center text-center content-center justify-self-center" href="#">
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="dark:text-white h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </span>
                  <span className="text-md font-bold dark:text-white">Create Mango Account</span>
                </a>
              </button>
            )}

            <Link href={`/trades/${publicKey.toBase58()}`}>
              <a className="inline-flex justify-right float-right justify-self-end pr-1">
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="dark:text-white h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </span>
                <span className="text-md font-bold dark:text-white">Permalink</span>
              </a>
            </Link>
          </div>

          <div className="mt-6">
            {tradeObject.state['funding'] && parseFloat(tradeObject.totalFunding) < parseFloat(tradeObject.fundingGoal) ? (
              <div className="w-full">
                <button onClick={() => setShowFundModal(true)} className="py-3 px-4 w-full block bg-slate-100 dark:bg-slate-700 dark:text-white text-center rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition ease-in-out delay-75">
                  Fund trade
                </button>
              </div>
            ) : null}
            {(tradeObject.state['cancelledTrade'] || tradeObject.state['finishedTrade']) && tradeObject.owner.toBase58() === anchorWallet.publicKey.toBase58() ? (
              <div className="w-full">
                <button onClick={() => withdraw()} className="mb-4 py-3 px-4 w-full block bg-slate-100 dark:bg-slate-700 dark:text-white text-center rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition ease-in-out delay-75">
                  Finish Trade & Withdraw Funds from Mango
                </button>
              </div>
            ) : null}
            {tradeObject.state['withdrawnFunds'] && hasFundedTrade && tradeFunding.amount > 0 ? (
              <div className="w-full">
                <button onClick={() => withdrawLeftover()} className="py-3 px-4 w-full block bg-slate-100 dark:bg-slate-700 dark:text-white text-center rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition ease-in-out delay-75">
                  Take profits
                </button>
              </div>
            ) : null}

            {
              // admin functions
            }
            <hr className="mb-4 mt-4"/>
            {!tradeObject.state['cancelledTrade'] ? (
              <>
                <h3 className="text-base font-semibold text-indigo-600 tracking-wide uppercase mb-4 dark:text-white">Only visible to you (trade owner):</h3>
                {tradeObject.state['awaitingMangoAccount'] && trade.owner.toBase58() === anchorWallet.publicKey.toBase58() ? (
                  <div className="w-full">
                    <button onClick={() => createMangoAccount()} className="py-3 px-4 w-full block bg-slate-100 dark:bg-slate-700 dark:text-white text-center rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition ease-in-out delay-75">
                      Create Mango Account
                    </button>
                  </div>
                ) : null}
                {(tradeObject.state['funding'] || tradeObject.state['fundingComplete']) && trade.owner.toBase58() === anchorWallet.publicKey.toBase58() && tradeObject.totalFunding > 0 ? (
                  <div className="w-full mt-4">
                    <button onClick={() => setShowDepositModal(true)} className="py-3 px-4 w-full block bg-slate-100 dark:bg-slate-700 dark:text-white text-center rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition ease-in-out delay-75">
                      Deposit Funds to Mango Account
                    </button>
                  </div>
                ) : null}
                {(tradeObject.state['fundingDeposited']) && trade.owner.toBase58() === anchorWallet.publicKey.toBase58() ? (
                  <div className="w-full mb-4">
                    <button onClick={() => placeOrder()} className="py-3 px-4 w-full block bg-slate-100 dark:bg-slate-700 dark:text-white text-center rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition ease-in-out delay-75">
                      Place Perp Order on {trade.asset}/USDC Mango Perp Market
                    </button>
                  </div>
                ) : null}
                {(tradeObject.state['initiatedTrade']) && trade.owner.toBase58() === anchorWallet.publicKey.toBase58() ? (
                  <div className="w-full mb-4">
                    <button onClick={() => setShowMarketCloseModal(true)} className="py-3 px-4 w-full block bg-slate-100 dark:bg-slate-700 dark:text-white text-center rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition ease-in-out delay-75">
                      Market Close
                    </button>
                  </div>
                ) : null}
                {(tradeObject.state['initiatedTrade'] || tradeObject.state['finishedTrade']) && trade.owner.toBase58() === anchorWallet.publicKey.toBase58() ? (
                  <div className="w-full mb-4">
                    <button onClick={() => setShowCancelModal(true)} className="py-3 px-4 w-full block bg-slate-100 dark:bg-slate-700 dark:text-white text-center rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition ease-in-out delay-75">
                      Cancel all open orders
                    </button>
                  </div>
                ) : null}
                 {tradeObject.state['withdrawnFunds'] && tradeSuccessful && trade.owner.toBase58() === anchorWallet.publicKey.toBase58() ? (
                  <div className="w-full mb-4">
                    <button onClick={() => setShowCancelModal(true)} className="py-3 px-4 w-full block bg-slate-100 dark:bg-slate-700 dark:text-white text-center rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition ease-in-out delay-75">
                      Take performance fee
                    </button>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </article>
      </div>
    </>
  );
};
