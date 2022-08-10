import { FC, useState, useEffect } from 'react'
import { Utils } from '../common/Utils'
import { User } from '../models/User'

export const CreateUserAccountModal: FC = ({ anchorWallet, setShowCreateAccountModal }) => {
  const [twitterHandle, setTwitterHandle] = useState('');

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setTwitterHandle(value);
  }

  const createAccount = async () => {
    if (!anchorWallet || !twitterHandle) {
      return;
    }

    try {
      const tx = await User.createUser(anchorWallet, twitterHandle);
      tx.rpc().then((res) => {
        if (Utils.getTransactionStatus(res)) {
          window.location.href = '/';
        } else {
          console.log('show bad error!');
        }
      });

    } catch (e) {
      console.log(e);
      console.log('user cancelled or something went wrong');
    }
  };

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
          <div className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 max-w-lg sm:w-full sm:p-6">
            <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
              <button type="button" onClick={() => setShowCreateAccountModal(false)} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Create Account</h3>
                <div className="mt-2">
                  <label for="username" className="block text-sm text-left font-medium text-gray-700 sm:mt-px pt-4 mb-2 sm:border-t sm:border-gray-200"> Enter your Twitter handle </label>
                  <div className="mt-4 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"> https://www.twitter.com/ </span>
                      <input type="text" name="username" id="username"
                        className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                        onChange={handleInputChange}
                        value={twitterHandle}
                      />
                   </div>
                 </div>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button type="button" onClick={() => createAccount()} className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                Create account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
