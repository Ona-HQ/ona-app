import type { NextPage } from 'next'
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { PublicKey } from '@solana/web3.js';
import { utils, BN } from '@project-serum/anchor';

import { Button } from '../../components/Button'
import { Container } from '../../components/Container'
import { Trade } from '../../models/Trade'
import { TxStatus } from '../../components/TxStatus'
import { Utils } from '../../common/Utils'

import { useAnchorWallet } from '@solana/wallet-adapter-react';

const New: NextPage = () => {
  const router = useRouter()
  const anchorWallet = useAnchorWallet();
  const utf8 = utils.bytes.utf8;
  const [state, setState] = useState({ asset: 'SOL', leverage: '1', direction: 'Long' });
  const [txId, setTxId] = useState('');

  useEffect(() => {
    if (!anchorWallet) {
      return;
    }

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
    };

    getAccount();
  }, [anchorWallet]);

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setState(prevState => { return { ...prevState, [name]: value } });
  }

  const submit = async () => {
    if (!anchorWallet) {
      return;
    }

    const goToNextStep = async (tx) => {
      const program = Utils.getProgram(anchorWallet);
      setTxId(tx);

      if (Utils.getTransactionStatus(tx)) {
        const [globalsPDA] = await PublicKey.findProgramAddress(
          [utf8.encode('globals')],
          program.programId,
        );
        const globals = await program.account.global.fetch(globalsPDA);
        const [tradePDA] = await PublicKey.findProgramAddress(
          [utf8.encode('new-trade'), anchorWallet.publicKey.toBuffer(), new BN(globals.lastTradeId - 1).toArrayLike(Buffer, 'be', 8)],
          program.programId,
        );

        router.push(`/trades/${tradePDA}/create`)
      } else {
        console.log('show bad error!');
      }
    }

    const tx = await Trade.createTrade(anchorWallet, state);
    const response = await tx.rpc();
    goToNextStep(tx);
  };

  return (
    <Container>
      {txId ? (
        <TxStatus txId={txId} />
      ) : null}
      <div className="lg:border-t lg:border-b lg:border-gray-200 bp-16 mb-16">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Progress">
          <ol role="list" className="rounded-md overflow-hidden lg:flex lg:border-l lg:border-r lg:border-gray-200 lg:rounded-none">
            <li className="relative overflow-hidden lg:flex-1">
              <div className="border border-gray-200 overflow-hidden lg:border-0">
                <a aria-current="step">
                  <span className="absolute top-0 left-0 w-1 h-full bg-indigo-600 lg:w-full lg:h-1 lg:bottom-0 lg:top-auto" aria-hidden="true"></span>
                  <span className="px-6 py-5 flex items-start text-sm font-medium">
                    <span className="flex-shrink-0">
                      <span className="w-10 h-10 flex items-center justify-center border-2 border-indigo-600 rounded-full">
                        <span className="text-indigo-600">01</span>
                      </span>
                    </span>
                    <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
                      <span className="text-xs font-semibold tracking-wide uppercase">Trade Information</span>
                      <span className="text-sm font-medium text-gray-500">Provide information such as asset, direction, size, ...</span>
                    </span>
                  </span>
                </a>
              </div>
            </li>

            <li className="relative overflow-hidden lg:flex-1">
              <div className="border border-gray-200 overflow-hidden lg:border-0">
                <a aria-current="step">
                  <span className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-gray-200 lg:w-full lg:h-1 lg:bottom-0 lg:top-auto" aria-hidden="true"></span>
                  <span className="px-6 py-5 flex items-start text-sm font-medium lg:pl-9">
                    <span className="flex-shrink-0">
                      <span className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full">
                        <span className="text-gray-500">02</span>
                      </span>
                    </span>
                    <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
                      <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Create Mango Account</span>
                      <span className="text-sm font-medium text-gray-500">Register your trade as a depositable Mango Account</span>
                    </span>
                  </span>
                </a>

                <div className="hidden absolute top-0 left-0 w-3 inset-0 lg:block" aria-hidden="true">
                  <svg className="h-full w-full text-gray-300" viewBox="0 0 12 82" fill="none" preserveAspectRatio="none">
                    <path d="M0.5 0V31L10.5 41L0.5 51V82" stroke="currentcolor" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
              </div>
            </li>

            <li className="relative overflow-hidden lg:flex-1">
              <div className="border border-gray-200 overflow-hidden border-t-0 rounded-b-md lg:border-0">
                <a className="group">
                  <span className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-gray-200 lg:w-full lg:h-1 lg:bottom-0 lg:top-auto" aria-hidden="true"></span>
                  <span className="px-6 py-5 flex items-start text-sm font-medium lg:pl-9">
                    <span className="flex-shrink-0">
                      <span className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full">
                        <span className="text-gray-500">03</span>
                      </span>
                    </span>
                    <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
                      <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Confirmation</span>
                      <span className="text-sm font-medium text-gray-500">An overview of your trade and a way to share on socials</span>
                    </span>
                  </span>
                </a>

                <div className="hidden absolute top-0 left-0 w-3 inset-0 lg:block" aria-hidden="true">
                  <svg className="h-full w-full text-gray-300" viewBox="0 0 12 82" fill="none" preserveAspectRatio="none">
                    <path d="M0.5 0V31L10.5 41L0.5 51V82" stroke="currentcolor" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div>
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Trade Information</h3>
              <p className="mt-1 text-sm text-gray-600">This information will be displayed publicly about your trade.</p>
            </div>
          </div>
          <div className="md:mt-0 md:col-span-2">
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 bg-white space-y-6 sm:p-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <div className="mt-1">
                      <input
                        type="text" name="title" id="title"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        onChange={handleInputChange}
                        value={state.title}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <div className="mt-1">
                      <textarea id="description" name="description" rows="3"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-1"
                        placeholder="Why will your trade succeed?"
                        onChange={handleInputChange}
                        value={state.description}
                      >
                      </textarea>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Brief description for your trade explaining your thesis. This is important for people to understand what they're funding!</p>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="asset" className="block text-sm font-medium text-gray-700">Asset</label>
                    <select
                      id="asset" name="asset"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={handleInputChange}
                      value={state.asset}
                    >
                      <option value="SOL">Solana (SOL)</option>
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="ETH">Ethereum (ETH)</option>
                      <option value="MNG">Mango (MNG)</option>
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="direction" className="block text-sm font-medium text-gray-700">Direction</label>
                    <select
                      id="direction" name="direction"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={handleInputChange}
                      value={state.direction}
                    >
                      <option value="Long">Long</option>
                      <option value="Short">Short</option>
                    </select>
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="tv-url" className="block text-sm font-medium text-gray-700">TradingView Public URL</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"> https:// </span>
                      <input
                        type="text" name="tv-url" id="tv-url"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300" placeholder="www.example.com"
                        onChange={handleInputChange}
                        value={state.tvUrl}
                      />
                    </div>
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="tv-img" className="block text-sm font-medium text-gray-700">TradingView Image</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"> https:// </span>
                      <input
                        type="text" name="tv-img" id="tv-img"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300" placeholder="www.example.com"
                        onChange={handleInputChange}
                        value={state.tvImg}
                      />
                    </div>
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Entry Price</label>
                    <div className="mt-1">
                      <input
                        type="text" name="entry-price" id="entry-price"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        onChange={handleInputChange}
                        value={state.entryPrice}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">A limit order will be opened with the entry price as soon as your trade is registered on Mango</p>
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Target Price</label>
                    <div className="mt-1">
                      <input
                        type="text" name="target-price" id="target-price"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        onChange={handleInputChange}
                        value={state.targetPrice}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">A limit order will be opened with the target price as soon as your trade is registered on Mango</p>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="leverage" className="block text-sm font-medium text-gray-700">Leverage</label>
                    <select
                      id="leverage" name="leverage"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={handleInputChange}
                      value={state.leverage}
                    >
                      <option value="1">1x</option>
                      <option value="2">2x</option>
                      <option value="3">3x</option>
                      <option value="4">4x</option>
                      <option value="5">5x</option>
                      <option value="6">6x</option>
                      <option value="7">7x</option>
                      <option value="8">8x</option>
                      <option value="9">9x</option>
                      <option value="10">10x</option>
                    </select>
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Funding Goal (in USDC)</label>
                    <div className="mt-1">
                      <input
                        type="text" name="funding-goal" id="funding-goal"
                        placeholder="e.g. 100,000 USDC"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        onChange={handleInputChange}
                        value={state.fundingGoal}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Do not use commas or dots (e.g. 100000 and not 100,000 or 100.000)</p>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button onClick={() => submit()} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Create Trade</button>
                </div>
              </div>
          </div>
        </div>
      </div>


      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200"></div>
        </div>
      </div>
    </Container>
  )
};

export default New
