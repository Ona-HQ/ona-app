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
            <MobileNavLink href="/login">Sign in</MobileNavLink>
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
          <div className="flex gap-x-6 items-center">
            <Link
              href="https://twitter.com"
              className="group"
              aria-label="Tanto on Twitter"
            >
              <a>
                <svg
                  aria-hidden="true"
                  className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 22 5.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 2.8 9.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.093 4.093 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 2 18.407a11.615 11.615 0 0 0 6.29 1.84" />
                </svg>
              </a>
            </Link>
            <Link
              href="https://github.com"
              className="group"
              aria-label="Tanto on GitHub"
            >
              <a>
                <svg
                  aria-hidden="true"
                  className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
                >
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
                </svg>
              </a>
            </Link>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            {authenticated ? (
              <div className="hidden md:block">
                {hasAccount ? ( 
                  <Link href="/trades/new">
                    <a className="mr-4 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Start new trade
                    </a>
                  </Link>
                ) : null}
                {!hasAccount ? (
                  <button
                    type="button"
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setShowCreateAccountModal(true)}
                  >
                    Create an account
                  </button>
                ) : (
                  <span>
                    Logged in as <Link href="/profile"><a className="text-indigo-700 font-bold">@{account.twitter}</a></Link>
                  </span>
                )}
              </div>
            ) : null}
            <span>
              <span className="hidden lg:inline">
                <WalletMultiButton />
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
