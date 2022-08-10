import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import {
  Program,
  AnchorProvider,
  BN,
  utils,
  web3 as anchorWeb3
} from '@project-serum/anchor';
import { Utils } from '../common/Utils'

const { SystemProgram } = anchorWeb3;
const utf8 = utils.bytes.utf8;

export class Globals {
  static createGlobals = async (anchorWallet) => {
    const program = Utils.getProgram(anchorWallet);

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
