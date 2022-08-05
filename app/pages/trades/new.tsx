import type { NextPage } from 'next'
import { Button } from '../../components/Button'
import { Container } from '../../components/Container'
import { Trade } from '../../models/Trade'
import { MangoAccount } from '../../models/MangoAccount'
import {
  utils,
  web3 as anchorWeb3
} from '@project-serum/anchor';

import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import idl from '../../idl.json';

const { SystemProgram } = anchorWeb3;
const utf8 = utils.bytes.utf8;

const New: NextPage = () => {
  const anchorWallet = useAnchorWallet();
  const submit = async () => {
    if (!anchorWallet) {
      return;
    }

    const tx = await Trade.createTrade(anchorWallet);
    tx.rpc();

    // const tx = await MangoAccount.create(anchorWallet);
    // tx.rpc();
  };

  return (
    <Container className="pt-20 pb-16">
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
                      <input type="text" name="title" id="title" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="about" className="block text-sm font-medium text-gray-700">Description</label>
                    <div className="mt-1">
                      <textarea id="about" name="about" rows="3" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-1" placeholder="Why will your trade succeed?"></textarea>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Brief description for your trade explaining your thesis. This is important for people to understand what they're funding!</p>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="asset" className="block text-sm font-medium text-gray-700">Asset</label>
                    <select id="asset" name="asset" className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option>Solana (SOL)</option>
                      <option>Bitcoin (BTC)</option>
                      <option>Ethereum (ETH)</option>
                      <option>Mango (MNG)</option>
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="direction" className="block text-sm font-medium text-gray-700">Direction</label>
                    <select id="direction" name="direction" className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option>Long</option>
                      <option>Short</option>
                    </select>
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="tv-url" className="block text-sm font-medium text-gray-700">TradingView Public URL</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"> https:// </span>
                      <input type="text" name="tv-url" id="tv-url" className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300" placeholder="www.example.com" />
                    </div>
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="tv-img" className="block text-sm font-medium text-gray-700">TradingView Image</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"> https:// </span>
                      <input type="text" name="tv-img" id="tv-img" className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300" placeholder="www.example.com" />
                    </div>
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Entry Price</label>
                    <div className="mt-1">
                      <input type="text" name="entry-price" id="entry-price" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Target Price</label>
                    <div className="mt-1">
                      <input type="text" name="target-price" id="target-price" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="leverage" className="block text-sm font-medium text-gray-700">Leverage</label>
                    <select id="leverage" name="leverage" className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option>1x</option>
                      <option>2x</option>
                      <option>3x</option>
                      <option>4x</option>
                      <option>5x</option>
                      <option>6x</option>
                      <option>7x</option>
                      <option>8x</option>
                      <option>9x</option>
                      <option>10x</option>
                    </select>
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Funding Goal (in USDC)</label>
                    <div className="mt-1">
                      <input type="text" name="funding-goal" id="funding-goal" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>
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
