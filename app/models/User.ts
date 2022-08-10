import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import {
  Program,
  AnchorProvider,
  BN,
  utils,
  web3 as anchorWeb3
} from '@project-serum/anchor';
import idl from '../idl.json';
import { Utils } from '../common/Utils'

const { SystemProgram } = anchorWeb3;
const utf8 = utils.bytes.utf8;

export class User {
  static createUser = async (anchorWallet, twitterHandle) => {
    const program = Utils.getProgram(anchorWallet);

    const [userPDA] = await PublicKey.findProgramAddress(
      [utf8.encode('user-account'), anchorWallet.publicKey.toBuffer()],
      program.programId,
    );
    const [globalsPDA] = await PublicKey.findProgramAddress(
      [utf8.encode('globals')],
      program.programId,
    );
    return program.methods.createUser(twitterHandle).accounts({
      userAccount: userPDA,
      globals: globalsPDA,
      user: anchorWallet.publicKey,
      systemProgram: SystemProgram.programId
    });
  }
}
