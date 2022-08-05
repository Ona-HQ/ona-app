import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import {
  Program,
  AnchorProvider,
  BN,
  utils,
  web3 as anchorWeb3
} from '@project-serum/anchor';
import idl from '../idl.json';

const { SystemProgram } = anchorWeb3;
const utf8 = utils.bytes.utf8;

export class Globals {
  static createGlobals = async (anchorWallet) => {
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, "processed");
    const provider = new AnchorProvider(
      connection, anchorWallet, {"preflightCommitment": "processed"},
    );
    const programID = "68i2xmU7bZUjXLzkjXrmXc1SgmjHX2jKKKCGKrTB6aAE";
    const program = new Program(idl, programID, provider);

    const [globalsPDA] = await PublicKey.findProgramAddress(
      [utf8.encode('globals')],
      program.programId,
    );
    return program.methods.createGlobals().accounts({
      globals: globalsPDA,
      payer: anchorWallet.publicKey,
      systemProgram: SystemProgram.programId
    });
  }
}
