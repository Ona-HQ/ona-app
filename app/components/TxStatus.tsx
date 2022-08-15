import React, { FC, Fragment, useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { StyledIcon } from './ui/styled-icon';

export const TxStatus: FC = ({ txId, error, isSuccess, setTxId, setError, setIsSuccess }) => {
  const cluster = process.env.NEXT_PUBLIC_NETWORK;
  const url = `https://explorer.solana.com/tx/${txId}?cluster=${cluster}`;
  const [isShowing, setIsShowing] = useState(false);

  const reset = () => {
    setTxId('');
    setError(null);
    setIsSuccess(false);
  }

  const animate = () => {
    setTimeout(() => {
      setIsShowing(true)
    }, 50);
  }

  useEffect(() => {
    animate();
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end px-4 py-6 mt-16 pointer-events-none sm:p-6 sm:items-start">
        <div className="flex flex-col items-center w-full space-y-4 sm:items-end">
          <Transition
            show={isShowing}
            as={Fragment}
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  {error ? (
                    <>
                      <div className="shrink-0">
                        <StyledIcon
                          as="ExclamationCircleIcon"
                          size={6}
                          onClick={() => reset()}
                          solid={false}
                          className="text-red-400"
                        />
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-red-500">
                          {error.message}
                        </p>
                      </div>
                      <div className="flex ml-4 shrink-0">
                        <button
                          className="inline-flex text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => reset()}
                        >
                          <span className="sr-only">Close</span>
                          <StyledIcon as="XIcon" size={5} />
                        </button>
                      </div>
                    </>
                  ) : isSuccess ? (
                    <>
                      <div className="shrink-0">
                        <StyledIcon
                          as="CheckCircleIcon"
                          size={6}
                          onClick={() => reset()}
                          solid={false}
                          className="text-green-400"
                        />
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-green-500">
                          Successfully confirmed transaction!
                        </p>

                        <a href={url} target="_blank" className="text-sm font-medium text-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600">
                          View transaction on explorer
                        </a>

                      </div>
                      <div className="flex ml-4 shrink-0">
                        <button
                          className="inline-flex text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => reset()}
                        >
                          <span className="sr-only">Close</span>
                          <StyledIcon as="XIcon" size={5} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="shrink-0">
                        <StyledIcon
                          as="CheckCircleIcon"
                          size={6}
                          onClick={() => reset()}
                          solid={false}
                          className="text-green-400"
                        />
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-slate-500">
                          Successfully broadcasted transaction!
                        </p>

                        <p className={`mt-1 text-sm text-gray-800 inline-flex items-center font-semibold transition ease-in-out duration-150`}>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          The page will update automatically when the transaction completes.
                        </p>
                        <a href={url} target="_blank" className="text-sm font-medium text-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600">
                          View transaction on explorer
                        </a>

                      </div>
                      <div className="flex ml-4 shrink-0">
                        <button
                          className="inline-flex text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => reset()}
                        >
                          <span className="sr-only">Close</span>
                          <StyledIcon as="XIcon" size={5} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  )
};
