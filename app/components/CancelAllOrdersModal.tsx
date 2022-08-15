import { FC, useState, useEffect } from 'react'
import { MangoAccount } from '../models/MangoAccount'

export const CancelAllOrdersModal: FC = ({ anchorWallet, trade, tradePDA, mangoAccount, setShowCancelModal, setTxId, processTransaction }) => {
  const cancel = async () => {
    if (!anchorWallet) {
      return;
    }

    setShowCancelModal(false);
    const tx = await MangoAccount.cancelAllOrders(anchorWallet, trade, tradePDA, mangoAccount);
    await processTransaction(tx);
  }

  return (
    <div className="relative z-10" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
          <div className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
            <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
              <button type="button" onClick={() => setShowCancelModal(false)} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Cancell All Mango Orders</h3>
                <div className="mt-2">
                  <p className="text-md text-gray-500">
                    Are you sure you want to cancel all orders on Mango?
                    This will <span className="font-extrabold">cancel and end the trade</span>.
                    Funds will be made available for withdrawal.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button type="button" onClick={() => cancel()} className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                Cancel and end trade
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
