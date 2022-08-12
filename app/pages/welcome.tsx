import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import { CreateUserAccountModal } from '../components/CreateUserAccountModal'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/router'

const Welcome: NextPage = () => {
  const router = useRouter();
  const anchorWallet = useAnchorWallet();
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);

  const browsePlatform = async () => {
    localStorage.setItem('tanto-skip-welcome', true);
    router.push('/');
  };

  return (
    <>
      {showCreateAccountModal ? (
        <CreateUserAccountModal anchorWallet={anchorWallet} setShowCreateAccountModal={setShowCreateAccountModal} />
      ) : null}

      <div className="relative py-12 bg-white overflow-hidden">
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
          <div className="relative h-full text-lg max-w-prose mx-auto" aria-hidden="true">
            <svg className="absolute top-12 left-full transform translate-x-32" width="404" height="384" fill="none" viewBox="0 0 404 384">
              <defs>
                <pattern id="74b3fd99-0a6f-4271-bef2-e80eeafdf357" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="384" fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)" />
            </svg>
            <svg className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32" width="404" height="384" fill="none" viewBox="0 0 404 384">
              <defs>
                <pattern id="f210dbf6-a58d-4871-961e-36d5016a0f49" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="384" fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
            </svg>
            <svg className="absolute bottom-12 left-full transform translate-x-32" width="404" height="384" fill="none" viewBox="0 0 404 384">
              <defs>
                <pattern id="d3eb07ae-5182-43e6-857d-35c643af9034" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="384" fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)" />
            </svg>
          </div>
        </div>
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="text-lg max-w-prose mx-auto">
            <h1>
              <span className="block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">Introducing</span>
              <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Tanto</span>
              <span className="mt-2 block text-xl text-center leading-8 font-bold text-gray-500">the easiest way to invest in the best trade ideas.</span>
            </h1>
            <p className="mt-8 text-xl text-gray-500 leading-8">
              Tanto allows users to create or invest in short-term single trades, typically scalp or swing trades, which take days up to weeks.
            </p>
            <p className="mt-8 text-xl text-gray-500 leading-8">
              Every now and then you discover an amazing trading opportunity.
              Until today, all you could do in such a situation was share your trade setup with your friends and followers on Twitter, Discord or Telegram.
              Besides trading your idea yourself, there was no way to share your opportunity directly with others or monetize it.
              Tanto allows you to turn your trade setup into an easily investable vehicle which can be funded by the community in minutes.
            </p>
            <p className="mt-8 text-xl text-gray-500 leading-8">
              Thanks for trying Tanto and we hope you have a marvellous time trading and investing!
            </p>
            <p className="mt-8 text-xl text-gray-500 leading-8 text-center">
              <button onClick={() => setShowCreateAccountModal(true) } className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Create a Tanto Account
              </button>
              <a href="#" target="_blank" className="ml-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Read the docs
              </a>
            </p>
            <p className="mt-4 text-sm text-gray-500 leading-8 text-center">
              <button onClick={() => browsePlatform()}>Let me browse the platform first</button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome
