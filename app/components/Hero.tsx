import Image from 'next/image'

import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export function Hero() {
  return (
    <Container className="pt-20 pb-16 lg:pt-32">
      <div className="absolute inset-x-0 -top-48 -bottom-14 overflow-hidden bg-indigo-50">
        <Image
          className=""
          src="background.jpg"
          alt=""
          width={918}
          height={1495}
          priority
          unoptimized
        />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white" />
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="px-2 ml-6 sm:pr-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:my-24 z-10">
          <div>
            <h1 className="mx-auto max-w-4xl font-display text-6xl font-medium tracking-tight text-slate-900 sm:text-6xl">
              Invest in your next{' '}
              <span className="relative whitespace-nowrap text-phantom">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 418 42"
                  className="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70"
                  preserveAspectRatio="none"
                >
                  <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                </svg>
                <span className="relative">trade, together</span>
              </span>{' '}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight font-bold text-slate-700">
              Fund the best trades with friends.
            </p>
            <div className="mt-10 flex gap-x-6">
              <WalletMultiButton children={ 'Launch Tanto' }/>
              <a href="#more" className="ml-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Learn more
              </a>
            </div>

            <div className="mt-5 w-full sm:mx-auto sm:max-w-lg lg:ml-0 md:w-1/2 sm:w-1/2">
              <p className="mt-16 py-4 text-sm text-phantom text-opacity-50 uppercase tracking-wide font-bold sm:mt-16">Powered by</p>
              <div className="grid grid-cols-2">
                <div className="">
                  <a className="hover:opacity-70 transition duration-200 ease-in-out" href="https://solana.com/">
                    <img className="" src="solanaLogo.png" alt="Solana" />
                  </a>
                </div>

                <div className="ml-12 -my-1">
                  <a className="hover:opacity-70 transition duration-200 ease-in-out" href="https://mango.markets/">
                    <img className="" src="https://mango.markets/logo_serum.svg" alt="Mango Markets" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 sm:mt-24 mt- lg:-mt-20 lg:col-span-6">
          <div className="z-10 relative pl-4 -mr-40 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full">
            <img className="lg:h-750 lg:w-auto lg:max-w-none opacity-0 transform translate-y-40" src="preview.png" alt="" style={{transform: 'translate(0px, 0px)', opacity: '1'}} />
          </div>
        </div>
      </div>

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

        <hr className="mt-12 mb-12"/>

        <div className="mt-12 px-4 sm:px-6 lg:px-8" id="more">
          <div className="text-lg max-w-prose mx-auto">
            <h1>
              <span className="block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">Introducing</span>
              <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Tanto</span>
              <span className="mt-2 block text-xl text-center leading-8 font-bold text-gray-500">the easiest way to invest in the best trade ideas.</span>
            </h1>
            <p className="mt-8 text-xl text-gray-500 leading-8">
              Tanto allows users to create or invest in short-term trades, typically scalp or swing trades, which take days up to weeks. All powered with the speed and execution of the Solana blockchain!
            </p>
            <p className="mt-8 text-xl text-gray-500 leading-8">
              Every now and then you discover an amazing trading opportunity.
              Until today, all you could do in such a situation was share your trade setup with your friends and followers on Twitter, Discord or Telegram.
              Besides trading your idea yourself, there was no way to share your opportunity directly with others or monetize it.
              Tanto allows you to turn your trade setup into an easily investable vehicle which can be funded by the Solana community.
            </p>
          </div>
        </div>

        <hr className="mt-12 mb-12"/>

        <div className="mt-12 px-4 sm:px-6 lg:px-8">
          <div className="text-lg max-w-prose mx-auto">
            <h1>
              <span className="block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">Tanto for Traders</span>
              <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Earn more on your trades</span>
              <span className="mt-2 block text-xl text-center leading-8 font-bold text-gray-500">Raise funding from the community and earn on execution.</span>
            </h1>
            <p className="mt-8 text-xl text-gray-500 leading-8 text-center">
              With Tanto, you can quickly raise funding for your trade within hours to days and earn a performance fee of 10%. No extra costs or monthly fees required!
            </p>
          </div>
        </div>

        <hr className="mt-12 mb-12"/>

        <div className="mt-12 px-4 sm:px-6 lg:px-8">
          <div className="text-lg max-w-prose mx-auto">
            <h1>
              <span className="block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">Tanto for Investors</span>
              <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Invest in the best trade ideas</span>
              <span className="mt-2 block text-xl text-center leading-8 font-bold text-gray-500">Invest with the best traders.</span>
            </h1>
            <p className="mt-8 text-xl text-gray-500 leading-8 text-center">
              Tanto makes it easier to invest with the best traders. No months of lock-ups. Join your favorite trades in one click. It’s all about just one trade.
            </p>
          </div>
        </div>
      </div>
    </Container>
  )
}
