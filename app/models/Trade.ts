import { Connection, PublicKey, clusterApiUrl, TransactionInstruction } from '@solana/web3.js';
import {
  Program,
  AnchorProvider,
  BN,
  utils,
  web3 as anchorWeb3
} from '@project-serum/anchor';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount, getAssociatedTokenAddress } from '@solana/spl-token';
import idl from '../idl.json';
import { IDS, MangoClient, Config, getMarketByBaseSymbolAndKind } from "@blockworks-foundation/mango-client";
import { Utils } from '../common/Utils'

const { SystemProgram } = anchorWeb3;
const utf8 = utils.bytes.utf8;

export class Trade {
  static createTrade = async (anchorWallet, formData) => {
    const program = Utils.getProgram(anchorWallet);    
    const [globalsPDA] = await PublicKey.findProgramAddress(
      [utf8.encode('globals')],
      program.programId,
    );
    const globals = await program.account.global.fetch(globalsPDA);
    let id = globals.lastTradeId;
    if (globals.lastTradeId === 0) {
      id += 1;
    }
    const [tradePDA] = await PublicKey.findProgramAddress(
      [utf8.encode('new-trade'), anchorWallet.publicKey.toBuffer(), new BN(id).toArrayLike(Buffer, 'be', 8)],
      program.programId,
    );
    const [userPDA] = await PublicKey.findProgramAddress(
      [utf8.encode('user-account'), anchorWallet.publicKey.toBuffer()],
      program.programId,
    );
    const depositMint = new PublicKey(process.env.NEXT_PUBLIC_USDC_MINT);

    const [groupConfig, clusterData, clusterUrl] = Utils.getMangoGroupConfig();
    const perpMarket = await Utils.getMangoPerpMarket(clusterUrl, clusterData, groupConfig, formData['asset']);

    console.log(formData);
    return program.methods.createTrade(
      formData['title'],
      formData['description'],
      formData['asset'],
      formData['direction'] === 'Long',
      formData['tv-url'],
      formData['tv-img'],
      new BN(formData['entry-price']),
      new BN(formData['target-price']),
      new BN(parseInt(formData['leverage'], 10)),
      new BN(parseInt(new Date().getTime() / 1000)), // start time
      new BN(48), // 48 hours to raise default
      new BN(formData['funding-goal']),
      depositMint,
      perpMarket.publicKey
    ).accounts({
      trade: tradePDA,
      globals: globalsPDA,
      userAccount:userPDA,
      trade_owner: anchorWallet.publicKey,
      systemProgram: SystemProgram.programId
    })
  }

  static fund = async (anchorWallet, tradeObject) => {
    const program = Utils.getProgram(anchorWallet);

    const mint = new PublicKey("S6PfGEDTqmG3fxYATnXKhRLGNk1XExikwFfJXTrm38o"); // fUSDC localnet
    const [tradePDA] = await PublicKey.findProgramAddress(
      [utf8.encode('new-trade'), tradeObject.owner.toBuffer(), new BN(tradeObject.id).toArrayLike(Buffer, 'be', 8)],
      program.programId,
    );
    const [fundingPDA] = await PublicKey.findProgramAddress(
      [utf8.encode('new-funding'), tradePDA.toBuffer(), anchorWallet.publicKey.toBuffer()],
      program.programId
    )
    const senderATA = await getAssociatedTokenAddress(
      mint,
      anchorWallet.publicKey,
      false
    );
    console.log(tradePDA.toString(), senderATA);
    const recipientATA = await getAssociatedTokenAddress(
      mint,
      tradePDA,
      true
    );
    let instructions: TransactionInstruction[] = [];
    if (senderATA.instruction) instructions.push(senderATA.instruction);
    if (recipientATA.instruction) instructions.push(recipientATA.instruction);
    if (instructions.length === 0) instructions = undefined;
    const amount = 1000;

    return program.rpc.fundTrade(new BN(amount), {
      accounts: {
        trade: tradePDA,
        tradeFunding: fundingPDA,
        vault: recipientATA,
        walletToWithdrawFrom: senderATA,
        payer: anchorWallet.publicKey,
        usdcMint: mint,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchorWeb3.SYSVAR_RENT_PUBKEY,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
      }
    });
  }
}
