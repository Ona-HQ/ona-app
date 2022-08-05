import { Connection, PublicKey } from '@solana/web3.js';
import * as web3 from '@solana/web3.js'
import { FC, useEffect, useState } from 'react'
import {
  Program,
  AnchorProvider,
  BN,
  utils,
  web3 as anchorWeb3
} from '@project-serum/anchor';
import { Container } from '../components/Container'
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import idl from '../idl.json';
import { Trade } from '../components/Trade';

const { SystemProgram } = anchorWeb3;
const utf8 = utils.bytes.utf8;
const PROGRAM_ID = "68i2xmU7bZUjXLzkjXrmXc1SgmjHX2jKKKCGKrTB6aAE";

export const Trades: FC = () => {
  // const connection = new web3.Connection('http://localhost:8899');
  const anchorWallet = useAnchorWallet();
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const fetchAllTrades = async () => {
      const network = "http://127.0.0.1:8899";
      const connection = new Connection(network, "processed");
      const provider = new AnchorProvider(
        connection, anchorWallet, {"preflightCommitment": "processed"},
      );
      const programID = "68i2xmU7bZUjXLzkjXrmXc1SgmjHX2jKKKCGKrTB6aAE";
      const program = new Program(idl, programID, provider);
      console.log(program.account['trade']);
      const trades = await program.account['trade'].all();
      setTrades(trades);
    };

    if (!anchorWallet) {
      return;
    }
    fetchAllTrades();

    // connection.getProgramAccounts(new web3.PublicKey(PROGRAM_ID)).then(async (accounts) => {
    //   const studentIntros: StudentIntro[] = accounts.map(({ account }) => {
    //     return StudentIntro.deserialize(account.data)
    //   })

    //   console.log(studentIntros);

    //   // setStudentIntros(studentIntros);
    // })
  }, [anchorWallet])

  return (
    <Container className="pb-16 pt-4">
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl pb-4">Latest Trades</h2>
      

      <div className="flex flex-wrap">
        {trades.map(trade => <Trade trade={trade} />)}        

        <div className="container max-w-lg bg-white rounded shadow-lg transform duration-200 easy-in-out m-12">
          <div className="h-2/4 sm:h-64 overflow-hidden">
            <img className="w-full rounded-t"
              src="https://s3.tradingview.com/snapshots/h/hGSj7jeP.png"
              alt="Photo by aldi sigun on Unsplash" />
          </div>
          <div className="flex justify-center px-5 -mt-12 mb-5">
            <span clspanss="block relative h-32 w-32">
              <img alt="Photo by aldi sigun on Unsplash"
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                className="mx-auto object-cover rounded-full border-gray-700 h-24 w-24 bg-white p-1" />
            </span>
          </div>
          <div>
            <div className="px-7 mb-8">
              <h2 className="text-3xl font-bold text-phantom text-center">Beth J. Greene</h2>
              <p className="text-gray-400 mt-2 dark:text-gray-400 text-center">52% trade success</p>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Asperiores molestiae vitae odio non commodi itaque quisquam incidunt doloribus fugit nesciunt.</p>
              <div className="px-4 py-2 cursor-pointer bg-green-900 max-w-min mx-auto mt-8 rounded-lg text-gray-300 hover:bg-green-800 hover:text-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-200">
                TradingView Link
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
