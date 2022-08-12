import type { NextPage } from 'next'
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Utils } from '../../../common/Utils'
import { Button } from '../../../components/Button'
import { Container } from '../../../components/Container'
import { Trade } from '../../../models/Trade'
import { TxStatus } from '../../../TxStatus'
import { MangoAccount } from '../../../models/MangoAccount'
import { Loading } from '../../../components/Loading'

import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

const Create: NextPage = () => {
  const router = useRouter()
  const { slug } = router.query
  const anchorWallet = useAnchorWallet();
  const [trade, setTrade] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [txId, setTxId] = useState('');

  useEffect(() => {
    if (!anchorWallet) {
      return;
    }

    const loadTrade = async () => {
      const program = Utils.getProgram(anchorWallet);

      const account = await program.account.trade.fetch(slug);
      if (account && account.id) {
        setTrade({ account: account, publicKey: new PublicKey(slug) });
      }
      setIsLoading(false);
    };

    loadTrade();
  }, [anchorWallet]);

  const submit = async () => {
    if (!anchorWallet) {
      return;
    }

    const tx = await MangoAccount.create(anchorWallet, trade.account);
    setTxId(tx);
    tx.rpc().then((response) => {
      if (Utils.getTransactionStatus(response)) {
        router.push(`/trades/${slug}/confirm`);
      } else {
        console.log('show bad error!');
      }
    });
  };

  return (
    <Container>
      <div className="lg:border-t lg:border-b lg:border-gray-200 bp-16 mb-16">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Progress">
          <ol role="list" className="rounded-md overflow-hidden lg:flex lg:border-l lg:border-r lg:border-gray-200 lg:rounded-none">
            <li className="relative overflow-hidden lg:flex-1">
              <div className="border border-gray-200 overflow-hidden border-b-0 rounded-t-md lg:border-0">
                <a className="group">
                  <span className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-gray-200 lg:w-full lg:h-1 lg:bottom-0 lg:top-auto" aria-hidden="true"></span>
                  <span className="px-6 py-5 flex items-start text-sm font-medium">
                    <span className="flex-shrink-0">
                      <span className="w-10 h-10 flex items-center justify-center bg-indigo-600 rounded-full">
                        <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
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
                  <span className="absolute top-0 left-0 w-1 h-full bg-indigo-600 lg:w-full lg:h-1 lg:bottom-0 lg:top-auto" aria-hidden="true"></span>
                  <span className="px-6 py-5 flex items-start text-sm font-medium lg:pl-9">
                    <span className="flex-shrink-0">
                      <span className="w-10 h-10 flex items-center justify-center border-2 border-indigo-600 rounded-full">
                        <span className="text-indigo-600">02</span>
                      </span>
                    </span>
                    <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
                      <span className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">Create Mango Account</span>
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

      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Mango Account Registration</h3>
                <p className="mt-1 text-sm text-gray-600">Register your trade as a Mango account to make it tradeable on the {trade.account.asset}/USDC perp market.</p>
              </div>
            </div>
            <div className="md:mt-0 md:col-span-2">
              <div className="sm:overflow-hidden">
                <div className="px-12 bg-white space-y-6 sm:p-6">
                  <button onClick={() => submit()} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200"></div>
        </div>
      </div>
    </Container>
  )
};

export default Create
