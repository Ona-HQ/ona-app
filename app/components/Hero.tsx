import Image from 'next/image'

const myLoader = ({ src, width, quality }) => {
  return `${src}`
}

import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export function Hero() {
  return (
    <>
      <Container className="pt-20 pb-16 lg:pt-32">
        <div className="absolute inset-x-0 -top-48 -bottom-14 overflow-hidden bg-indigo-50">
          <Image
            loader={myLoader}
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

        <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-8">
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
                  <span className="relative break-all lg:break-normal">
                    trade, together
                  </span>
                </span>{' '}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight font-bold text-slate-700">
                Fund the best trades with friends.
              </p>
              <div className="mt-10 flex gap-x-6 sm:items-center sm:justify-center lg:justify-start">
                {false ? (
                  <WalletMultiButton children={ 'Launch Ona' }/>
                ) : (
                  <button className="wallet-adapter-button wallet-adapter-button-trigger bg-phantom" tabindex="0" type="button">Launching Sept 2022</button>
                )}
                <a href="#more" className="ml-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Learn more
                </a>
              </div>

              <div className="mt-5 w-full sm:mx-auto sm:max-w-lg lg:ml-0 md:w-1/2 sm:w-1/2">
                <div className="hidden sm:block">
                  <p className="mt-16 py-4 text-sm text-phantom text-opacity-50 uppercase tracking-wide font-bold sm:mt-16">Powered by</p>
                  <div className="grid grid-cols-2">
                    <div className="">
                      <a className="hover:opacity-70 transition duration-200 ease-in-out" href="https://solana.com/">
                        <img className="" src="solanaLogo.png" alt="Solana" />
                      </a>
                    </div>

                    <div className="ml-12 -my-2">
                      <a className="hover:opacity-70 transition duration-200 ease-in-out" href="https://mango.markets/">
                        <img className="w-96" src="Logo_Mango.svg" alt="Mango Markets" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 sm:mt-24 mt- lg:-mt-20 lg:col-span-6">
            <div className="z-10 relative pl-4 -mr-40 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full">
              <img className="lg:h-750 lg:w-auto lg:max-w-none opacity-0 transform translate-y-40" src="trade_preview_cut.png" alt="" style={{transform: 'translate(0px, 0px)', opacity: '1'}} />
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
                <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Ona</span>
                <span className="mt-2 block text-xl text-center leading-8 font-bold text-gray-500">the easiest way to invest in the best trade ideas.</span>
              </h1>
              <p className="mt-8 text-xl text-gray-500 leading-8">
                Ona allows users to create or invest in short-term trades, typically scalp or swing trades, which take days up to weeks. All powered with the speed and execution of the Solana blockchain!
              </p>
              <p className="mt-8 text-xl text-gray-500 leading-8">
                Every now and then you discover an amazing trading opportunity.
                Until today, all you could do in such a situation was share your trade setup with your friends and followers on Twitter, Discord or Telegram.
                Besides trading your idea yourself, there was no way to share your opportunity directly with others or monetize it.
                Ona allows you to turn your trade setup into an easily investable vehicle which can be funded by the Solana community.
              </p>
            </div>
          </div>

          <hr className="mt-12 mb-12"/>

          <div className="mt-12 px-4 sm:px-6 lg:px-8">
            <div className="text-lg max-w-prose mx-auto">
              <h1>
                <span className="block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">Ona for Traders</span>
                <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Earn more on your trades</span>
                <span className="mt-2 block text-xl text-center leading-8 font-bold text-gray-500">Raise funding from the community and earn on execution.</span>
              </h1>
              <p className="mt-8 text-xl text-gray-500 leading-8 text-center">
                With Ona, you can quickly raise funding for your trade within hours to days and earn a performance fee of 10%. No extra costs or monthly fees required!
              </p>
            </div>
          </div>

          <hr className="mt-12 mb-12"/>

          <div className="mt-12 px-4 sm:px-6 lg:px-8">
            <div className="text-lg max-w-prose mx-auto">
              <h1>
                <span className="block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">Ona for Investors</span>
                <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Invest in the best trade ideas</span>
                <span className="mt-2 block text-xl text-center leading-8 font-bold text-gray-500">Invest with the best traders.</span>
              </h1>
              <p className="mt-8 text-xl text-gray-500 leading-8 text-center">
                Ona makes it easier to invest with the best traders. No months of lock-ups. Join your favorite trades in one click. It’s all about just one trade.
              </p>
            </div>
          </div>

          <hr className="mt-12"/>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-8">
          <span className="mb-12 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Roadmap</span>
          <section className="md:flex">
            <h2 className="pl-7 text-sm leading-6 text-slate-500 md:w-1/4 md:pl-0 md:pr-12 md:text-right">
              <a href="#2022-08">August, 2022</a>
            </h2>
            <div className="relative pt-2 pl-7 md:w-3/4 md:pt-0 md:pl-12 pb-16">
              <div className="absolute bottom-0 left-0 w-px bg-slate-200 -top-3 md:top-2.5"></div>
              <div className="absolute -top-[1.0625rem] -left-1 h-[0.5625rem] w-[0.5625rem] rounded-full border-2 border-slate-300 bg-white md:top-[0.4375rem]"></div>
              <div className="max-w-none prose-h3:mb-4 prose-h3:text-base prose-h3:leading-6 prose-sm prose prose-slate prose-a:font-semibold prose-a:text-sky-500 hover:prose-a:text-sky-600">
                <p>We are participating in <a href="https://solana.com/summercamp">Solana's Summer Camp Hackathon</a>! If you like what we're doing, consider giving us a shout-out on Twitter :)</p>

                <h3 className="font-semibold mt-4 mb-2">New additions</h3>
                <ul className="list-disc">
                  <li>Devnet Launch with Mango integration on SOL, BTC and ETH</li>
                  <li>Community Discord & Twitter Launch</li>
                </ul>
              </div>
            </div>
          </section>
          <section className="md:flex">
            <h2 className="pl-7 text-sm leading-6 text-slate-500 md:w-1/4 md:pl-0 md:pr-12 md:text-right">
              <a href="#2022-09">September, 2022</a>
            </h2>
            <div className="relative pt-2 pl-7 md:w-3/4 md:pt-0 md:pl-12 pb-16">
              <div className="absolute bottom-0 left-0 w-px bg-slate-200 -top-6 md:top-0"></div>
              <div className="absolute -top-[1.0625rem] -left-1 h-[0.5625rem] w-[0.5625rem] rounded-full border-2 border-slate-300 bg-white md:top-[0.4375rem]"></div>
              <div className="max-w-none prose-h3:mb-4 prose-h3:text-base prose-h3:leading-6 prose-sm prose prose-slate prose-a:font-semibold prose-a:text-sky-500 hover:prose-a:text-sky-600">
                <h3 className="font-semibold mb-2">New additions</h3>
                <ul className="list-disc">
                  <li>Mainnet Launch</li>
                  <li>Improve search on users and trades</li>
                  <li>Reputation System for traders</li>
                  <li>Governance Token Launch with token rewards for investors and traders</li>
                  <li>Verified Accounts</li>
                </ul>
              </div>
            </div>
          </section>
          <section className="md:flex">
            <h2 className="pl-7 text-sm leading-6 text-slate-500 md:w-1/4 md:pl-0 md:pr-12 md:text-right">
              <a href="#2022-q4">Q4 2022</a>
            </h2>
            <div className="relative pt-2 pl-7 md:w-3/4 md:pt-0 md:pl-12 pb-16">
              <div className="absolute bottom-0 left-0 w-px bg-slate-200 -top-6 md:top-0"></div>
                <div className="absolute -top-[1.0625rem] -left-1 h-[0.5625rem] w-[0.5625rem] rounded-full border-2 border-slate-300 bg-white md:top-[0.4375rem]"></div>
                <div className="max-w-none prose-h3:mb-4 prose-h3:text-base prose-h3:leading-6 prose-sm prose prose-slate prose-a:font-semibold prose-a:text-sky-500 hover:prose-a:text-sky-600">
                <h3 className="font-semibold mb-2">New additions</h3>
                <ul className="list-disc">
                  <li>Public Leaderboards</li>
                  <li>Twitter and Discord Bot</li>
                  <li>Partial bids & asks</li>
                  <li>Follow Users</li>
                  <li>Comment threads for Trades</li>
                  <li>Like and Follow Trades</li>
                  <li>Seed Round Raised</li>
                </ul>
              </div>
            </div>
          </section>
          <section className="md:flex">
            <h2 className="pl-7 text-sm leading-6 text-slate-500 md:w-1/4 md:pl-0 md:pr-12 md:text-right">
              <a href="#2023">2023</a>
            </h2>
            <div className="relative pt-2 pl-7 md:w-3/4 md:pt-0 md:pl-12 pb-16">
              <div className="absolute bottom-0 left-0 w-px bg-slate-200 -top-6 md:top-0"></div>
                <div className="absolute -top-[1.0625rem] -left-1 h-[0.5625rem] w-[0.5625rem] rounded-full border-2 border-slate-300 bg-white md:top-[0.4375rem]"></div>
                <div className="max-w-none prose-h3:mb-4 prose-h3:text-base prose-h3:leading-6 prose-sm prose prose-slate prose-a:font-semibold prose-a:text-sky-500 hover:prose-a:text-sky-600">
                <h3 className="font-semibold mb-2">New additions</h3>
                <ul className="list-disc">
                  <li>Continuous Funds for Verified Accounts</li>
                  <li>Drift.Trade integration</li>
                  <li>Vault Analytics</li>
                  <li>Trading Competitions (Gamefied trading)</li>
                  <li>Spot & Options Trading</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </Container>

      <section className="relative overflow-hidden bg-phantom py-32 mb-12">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Frequently Asked Questions?
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            Read our documentation on Gitbook!
          </p>
          <a href="https://docs.ona.so" target="_blank" className="ml-4 mt-8 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Read docs
          </a>
        </div>
      </section>
    </>
  )
}
