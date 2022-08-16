import { FC, Fragment, useState, useEffect } from 'react'
import Link from 'next/link'
import { Popover, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { Logo } from '../components/Logo'
import { NavLink } from '../components/NavLink'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { Utils } from '../common/Utils'
import { PublicKey } from '@solana/web3.js';
import { utils } from '@project-serum/anchor';
import { CreateUserAccountModal } from '../components/CreateUserAccountModal'

function MobileNavLink({ href, children }) {
  return (
    <Popover.Button as={Link} href={href} className="block w-full p-2">
      {children}
    </Popover.Button>
  )
}

function MobileNavIcon({ open }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          'origin-center transition',
          open && 'scale-90 opacity-0'
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          'origin-center transition',
          !open && 'scale-90 opacity-0'
        )}
      />
    </svg>
  )
}

function MobileNavigation() {
  return (
    <Popover>
      <Popover.Button
        className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
          >
            <hr className="m-2 border-slate-300/40" />
            <MobileNavLink href="/trades/new">New Trade</MobileNavLink>
            <MobileNavLink href="/profile">Profile</MobileNavLink>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  )
}

export const Header: FC = ({ authenticated }) => {
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [account, setAccount] = useState({});

  const anchorWallet = useAnchorWallet();
  const utf8 = utils.bytes.utf8;

  useEffect(() => {
    if (!anchorWallet) {
      return;
    }

    const tryLoadUser = async () => {
      const program = Utils.getProgram(anchorWallet);

      const [userPDA] = await PublicKey.findProgramAddress(
        [utf8.encode('user-account'), anchorWallet.publicKey.toBuffer()],
        program.programId,
      );
      try {
        const account = await program.account.user.fetch(userPDA);
        if (account && account.id) {
          setAccount(account);
          setHasAccount(true);
        }
      } catch (e) {
        setHasAccount(false);
      }
    };

    tryLoadUser();
  }, [anchorWallet, authenticated]);

  return (
    <header className="py-10">
      {showCreateAccountModal ? (
        <CreateUserAccountModal anchorWallet={anchorWallet} setShowCreateAccountModal={setShowCreateAccountModal} />
      ) : null}
      <Container>
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center">
            <Link href="/" aria-label="Home">
              <a><Logo className="h-10 w-auto" /></a>
            </Link>
          </div>
          {!authenticated ? (
            <div className="flex gap-x-6 items-center">
              <Link
                href="https://twitter.com/Ona_HQ"
                className="group"
                aria-label="Ona on Twitter"
              >
                <a target="_blank">
                  <svg
                    aria-hidden="true"
                    className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 22 5.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 2.8 9.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.093 4.093 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 2 18.407a11.615 11.615 0 0 0 6.29 1.84" />
                  </svg>
                </a>
              </Link>
              <Link
                href="https://github.com/Ona-HQ"
                className="group"
                aria-label="Ona on GitHub"
              >
                <a target="_blank">
                  <svg
                    aria-hidden="true"
                    className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
                  >
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
                  </svg>
                </a>
              </Link>
              <Link
                href="https://docs.ona.so/product-docs/"
                className="group"
                aria-label="Ona on Gitbook"
              >
                <a target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                </a>
              </Link>
              {false ? (
                <Link
                  href="#"
                  className="group"
                  aria-label="Ona on Discord"
                >
                  <a target="_blank">
                    <svg className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700" viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_517_202)" className="jsx-3610316232">
                        <path d="M30.4755 6.73845C28.1805 5.70345 25.7205 4.93845 23.148 4.50345C23.1251 4.49905 23.1014 4.50188 23.0801 4.51156C23.0589 4.52123 23.0412 4.53727 23.0295 4.55745C22.7145 5.11095 22.3635 5.83245 22.1175 6.40245C19.3891 5.9948 16.6153 5.9948 13.887 6.40245C13.613 5.77074 13.304 5.15479 12.9615 4.55745C12.9499 4.53702 12.9323 4.52062 12.9111 4.51044C12.89 4.50025 12.8662 4.49677 12.843 4.50045C10.272 4.93545 7.81199 5.70045 5.51549 6.73695C5.49573 6.74524 5.47898 6.75937 5.46749 6.77745C0.799489 13.6399 -0.480011 20.3329 0.148489 26.9419C0.150237 26.9581 0.155262 26.9738 0.163256 26.988C0.17125 27.0022 0.182047 27.0146 0.194989 27.0244C2.91958 29.0081 5.95849 30.5192 9.18449 31.4944C9.20698 31.5014 9.23103 31.5014 9.25351 31.4944C9.27599 31.4874 9.29584 31.4739 9.31049 31.4554C10.0047 30.5271 10.6198 29.5421 11.1495 28.5109C11.1568 28.4968 11.1611 28.4813 11.1619 28.4655C11.1627 28.4496 11.1602 28.4337 11.1543 28.4189C11.1485 28.4041 11.1396 28.3908 11.1281 28.3797C11.1167 28.3687 11.103 28.3602 11.088 28.3549C10.119 27.99 9.18012 27.5497 8.27999 27.0379C8.26381 27.0287 8.25019 27.0156 8.24032 26.9998C8.23046 26.984 8.22468 26.966 8.22349 26.9474C8.2223 26.9288 8.22574 26.9103 8.23351 26.8933C8.24128 26.8764 8.25312 26.8617 8.26799 26.8504C8.45699 26.7109 8.64599 26.5654 8.82599 26.4199C8.84219 26.4069 8.86171 26.3985 8.88236 26.3959C8.90302 26.3932 8.92401 26.3964 8.94299 26.4049C14.8335 29.0509 21.213 29.0509 27.0345 26.4049C27.0535 26.3959 27.0747 26.3923 27.0957 26.3947C27.1166 26.3971 27.1365 26.4053 27.153 26.4184C27.333 26.5654 27.5205 26.7109 27.711 26.8504C27.726 26.8614 27.738 26.876 27.7461 26.8927C27.7541 26.9095 27.7578 26.928 27.7569 26.9466C27.756 26.9652 27.7505 26.9833 27.7409 26.9992C27.7314 27.0151 27.718 27.0285 27.702 27.0379C26.805 27.5539 25.872 27.9904 24.8925 28.3534C24.8774 28.3589 24.8637 28.3675 24.8523 28.3787C24.8408 28.3899 24.8319 28.4034 24.8261 28.4183C24.8203 28.4332 24.8177 28.4492 24.8185 28.4651C24.8194 28.4811 24.8236 28.4967 24.831 28.5109C25.371 29.5414 25.989 30.5224 26.6685 31.4539C26.6826 31.4731 26.7023 31.4874 26.7248 31.4949C26.7474 31.5024 26.7717 31.5028 26.7945 31.4959C30.026 30.5234 33.0699 29.0116 35.7975 27.0244C35.8108 27.0151 35.822 27.0031 35.8302 26.9891C35.8385 26.9752 35.8437 26.9596 35.8455 26.9434C36.5955 19.3024 34.5885 12.6634 30.522 6.78045C30.512 6.76133 30.4955 6.74643 30.4755 6.73845ZM12.03 22.9174C10.257 22.9174 8.79449 21.3139 8.79449 19.3474C8.79449 17.3794 10.2285 15.7774 12.03 15.7774C13.845 15.7774 15.294 17.3929 15.2655 19.3474C15.2655 21.3154 13.8315 22.9174 12.03 22.9174ZM23.9925 22.9174C22.218 22.9174 20.757 21.3139 20.757 19.3474C20.757 17.3794 22.1895 15.7774 23.9925 15.7774C25.8075 15.7774 27.2565 17.3929 27.228 19.3474C27.228 21.3154 25.809 22.9174 23.9925 22.9174Z"></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_517_202">
                          <rect width="36" height="36"></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                </Link>
              ) : null}
            </div>
          ) : null}
          <div className="flex items-center gap-x-5 md:gap-x-8">
            {authenticated ? (
              <div className="hidden md:block">
                {hasAccount ? ( 
                  <div className="grid grid-cols-2 items-center">
                    <Link href="/trades/new">
                      <a className="mr-4 px-2.5 py-1.5 border border-transparent text-md text-center font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        New trade
                      </a>
                    </Link>

                    <Link href="/profile">
                      <button type="button" className="group w-full bg-gray-100 rounded-md px-3.5 py-2 text-sm text-left font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-purple-500">
                        <span className="flex w-full justify-between items-center">
                          <span className="flex min-w-0 items-center justify-between space-x-3">
                            <img className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" src={`https://unavatar.io/twitter/${account.twitter}`} alt="" />
                            <span className="flex-1 flex flex-col min-w-0">
                              <span className="text-gray-500 text-sm truncate">@{account.twitter}</span>
                            </span>
                          </span>
                          <svg className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" x-description="Heroicon name: solid/selector" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                          </svg>
                        </span>
                      </button>
                    </Link>
                  </div>
                ) : null}
                {!hasAccount ? (
                  <button
                    type="button"
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setShowCreateAccountModal(true)}
                  >
                    Create an account
                  </button>
                ) : null}
              </div>
            ) : null}
            <span>
              <span className="hidden lg:inline">
                {false ? (
                  <WalletMultiButton />
                ) : (
                  <button className="wallet-adapter-button wallet-adapter-button-trigger bg-phantom" tabIndex="0" type="button">
                    <span class="hidden sm:inline">Launching Sept 2022</span>
                    <span class="sm:hidden">Sept 2022</span>
                  </button>
                )}
              </span>
            </span>
            <div className="-mr-1 md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  )
}
