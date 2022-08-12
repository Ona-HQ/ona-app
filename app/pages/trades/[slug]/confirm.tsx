import type { NextPage } from 'next'
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { PublicKey } from '@solana/web3.js';

import { Utils } from '../../../common/Utils'
import { Button } from '../../../components/Button'
import { Container } from '../../../components/Container'
import { Trade } from '../../../models/Trade'
import { TxStatus } from '../../../TxStatus'
import { Loading } from '../../../components/Loading'
import { TradeLayout } from '../../../components/TradeLayout';

import { useAnchorWallet } from '@solana/wallet-adapter-react';

const Confirm: NextPage = () => {
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

  const submit = async () => {
    if (!anchorWallet) {
      return;
    }

    const tx = await MangoAccount.create(anchorWallet);
    setTxId(tx);
    tx.rpc().then((response) => {
      router.push('/trades/${slug}/confirm')
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
                      <span className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">Create Mango Account</span>
                      <span className="text-sm font-medium text-gray-500">Register your trade as a depositable Mango Account</span>
                    </span>
                  </span>
                </a>
              </div>
            </li>

            <li className="relative overflow-hidden lg:flex-1">
              <div className="border border-gray-200 overflow-hidden border-t-0 rounded-b-md lg:border-0">
                <a aria-current="step">
                  <span className="absolute top-0 left-0 w-1 h-full bg-indigo-600 lg:w-full lg:h-1 lg:bottom-0 lg:top-auto" aria-hidden="true"></span>
                  <span className="px-6 py-5 flex items-start text-sm font-medium lg:pl-9">
                    <span className="flex-shrink-0">
                      <span className="w-10 h-10 flex items-center justify-center border-2 border-indigo-600 rounded-full">
                        <span className="text-indigo-600">03</span>
                      </span>
                    </span>
                    <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
                      <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Congratulations!</span>
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
                <h3 className="text-lg font-medium leading-6 text-gray-900">Confirmation</h3>
                <p className="mt-1 text-sm text-gray-600">Your trade is now ready to be funded!</p>

                <button className="bg-blue-500 mt-6 px-4 py-2 font-semibold text-white inline-flex items-center space-x-2 rounded">
                  <svg className="w-5 h-5 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  <span>Share on Twitter</span>
                </button>            
              </div>
            </div>
            <div className="md:mt-0 md:col-span-2">
              <div className="sm:overflow-hidden">
                <TradeLayout trade={trade.account} publicKey={trade.publicKey} view='lg' />
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

export default Confirm
