import { Connection, PublicKey, clusterApiUrl, TransactionInstruction } from '@solana/web3.js';
import {
  Program,
  AnchorProvider,
  BN,
  utils,
  web3 as anchorWeb3
} from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import idl from '../idl.json';
import { IDS, MangoClient, Config } from "@blockworks-foundation/mango-client";

const { SystemProgram } = anchorWeb3;
const utf8 = utils.bytes.utf8;

export class Trade {
  static createTrade = async (anchorWallet) => {
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, "processed");
    const provider = new AnchorProvider(
      connection, anchorWallet, {"preflightCommitment": "processed"},
    );
    const programID = "68i2xmU7bZUjXLzkjXrmXc1SgmjHX2jKKKCGKrTB6aAE";
    const program = new Program(idl, programID, provider);

    const [tradePDA] = await PublicKey.findProgramAddress(
      [utf8.encode('new-trade'), anchorWallet.publicKey.toBuffer()],
      program.programId,
    );
    const [globalsPDA] = await PublicKey.findProgramAddress(
      [utf8.encode('globals')],
      program.programId,
    );

    return program.methods.createTrade(
      'Amazing trade', 'description', 'SOL', true, 'chart_url_here',
      new BN(23000), new BN(28000), 1, new BN(1669539761), 15, new BN(100000)
    ).accounts({
      trade: tradePDA,
      globals: globalsPDA,
      trade_owner: anchorWallet.publicKey,
      systemProgram: SystemProgram.programId
    })
  }

  static fund = async (anchorWallet) => {
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, "processed");
    const provider = new AnchorProvider(
      connection, anchorWallet, {"preflightCommitment": "processed"},
    );
    const programID = "68i2xmU7bZUjXLzkjXrmXc1SgmjHX2jKKKCGKrTB6aAE";
    const program = new Program(idl, programID, provider);
    
    const mint = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"); // USDC devnet
    const sender = program.provider.wallet.publicKey;
    const recipient = new PublicKey(otherPublicKey);
    const senderATA = await getOrCreateAssociatedTokenAccount(
      connection,
      sender,
      mint,
      sender
    );
    const [tradePDA] = await PublicKey.findProgramAddress(
      [utf8.encode('new-trade'), anchorWallet.publicKey.toBuffer()],
      program.programId,
    );
    const recipientATA = await getOrCreateAssociatedTokenAccount(
      connection,
      sender,
      mint,
      tradePDA
    );
    let instructions: TransactionInstruction[];
    if (senderATA.instruction) instructions.push(senderATA.instruction);
    if (recipientATA.instruction) instructions.push(recipientATA.instruction);
    if (instructions.length === 0) instructions = undefined;
    const amount = 1000;

    await program.rpc.transferTokens(new BN(amount), {
      accounts: {
        sender: sender,
        senderTokens: senderATA.address,
        recipientTokens: recipientATA.address,
        mint,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID
      },
      instructions
    }); 
  }
}
