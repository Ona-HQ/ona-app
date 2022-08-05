import { FC, useEffect, useState } from 'react';

export const Trade: FC = ({ title, description, twitterName }) => {
  console.log(title);
  return (
    <div className="container max-w-lg bg-white rounded shadow-lg transform duration-200 easy-in-out m-12">
      <div className="h-2/4 sm:h-64 overflow-hidden">
        <img className="w-full rounded-t" src="https://s3.tradingview.com/snapshots/h/hGSj7jeP.png" />
      </div>
      <div className="flex justify-center px-5 -mt-12 mb-5">
        <span clspanss="block relative h-32 w-32">
          <img src={`https://unavatar.io/twitter/${twitterName}`} className="mx-auto object-cover rounded-full border-gray-700 h-24 w-24 bg-white p-1" />
        </span>
      </div>
      <div>
        <div className="px-7 mb-8">
          <h2 className="text-3xl font-bold text-phantom text-center">{title}</h2>
          <p className="text-gray-400 mt-2 dark:text-gray-400 text-center">52% trade success</p>
          <p className="mt-2 text-phantom">{description}</p>
          <div className="px-4 py-2 cursor-pointer bg-green-900 max-w-min mx-auto mt-8 rounded-lg text-gray-300 hover:bg-green-800 hover:text-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-200">
            TradingView Link
          </div>
        </div>
      </div>
    </div>
  );
};
