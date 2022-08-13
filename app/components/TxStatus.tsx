import React, { FC, Fragment, useContext } from 'react';
import { Transition } from '@headlessui/react';
import { StyledIcon } from './ui/styled-icon';

export const TxStatus: FC = ({ txId, error, setTxId, setError }) => {
  const cluster = process.env.NEXT_PUBLIC_NETWORK;
  const url = `https://solscan.io/tx/${txId}?cluster=${cluster}`;

  const reset = () => {
    setTxId('');
    setError(null);
  }

  return (
    <>
      <div aria-live="assertive"
        className="fixed inset-0 z-50 flex items-end px-4 py-6 mt-16 pointer-events-none sm:p-6 sm:items-start"
      >
        <div className="flex flex-col items-center w-full space-y-4 sm:items-end">
          <Transition
            show={true}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
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
                      <div className="ml-3 w-0 flex-1 pt-0.5">
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
                      <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-green-500">
                          Successfully broadcasted transaction!
                        </p>

                        <p className={`mt-1 text-sm text-gray-800`}>The page will update automatically when the transaction completes.</p>
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
