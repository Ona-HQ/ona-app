import Image from 'next/future/image'

import { Button } from '../components/Button'
import { Container } from '../components/Container'

export function Hero() {
  return (
    <Container className="pt-20 pb-16 lg:pt-32">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="px-2 ml-6 sm:pr-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:my-24 z-10">
          <div>
            <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
              Fund your next{' '}
              <span className="relative whitespace-nowrap text-phantom">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 418 42"
                  className="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70"
                  preserveAspectRatio="none"
                >
                  <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                </svg>
                <span className="relative">trade together</span>
              </span>{' '}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
              Invest in the best trades with friends. Built on Solana, powered by Mango.
            </p>
            <div className="mt-10 flex gap-x-6">
              <Button color='phantom'>Invest in the best trades now</Button>
            </div>

            <div className="mt-5 w-full sm:mx-auto sm:max-w-lg lg:ml-0 md:w-1/2 sm:w-1/2">
              <p className="mt-16 py-4 text-sm text-slate-700 text-opacity-50 uppercase tracking-wide font-semibold sm:mt-16">Powered by</p>
              <div className="flex">
                <div className="flex justify-center">
                  <a className="hover:opacity-70 transition duration-200 ease-in-out" href="https://solana.com/">
                    <img className="h-8 sm:h-8" src="solanaWordMark.png" alt="Solana" />
                  </a>
                </div>
                <div className="flex justify-center -my-1 mx-10">
                  <a className="hover:opacity-70 transition duration-200 ease-in-out" href="https://mango.markets/">
                    <img className="h-8 sm:h-8" src="1628669861_mango-markets_full.png" alt="Mango Markets" />
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 sm:mt-24 mt- lg:-mt-20 lg:col-span-6">
          <div className="z-10 relative pl-4 -mr-40 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full">
            <img className="lg:h-750 lg:w-auto lg:max-w-none opacity-0 transform translate-y-40" src="herp_image_main_flat.png" alt="" style={{transform: 'translate(0px, 0px)', opacity: '1'}} />
          </div>
        </div>
      </div>
    </Container>
  )
}
