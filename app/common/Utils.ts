import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import {
  Program,
  AnchorProvider,
  BN,
  utils,
  web3 as anchorWeb3
} from '@project-serum/anchor';

export class Utils {
  static getProgram(anchorWallet) {
    console.log(process.ENV);
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, "processed");
    const provider = new AnchorProvider(
      connection, anchorWallet, {"preflightCommitment": "processed"},
    );
    const programID = "68i2xmU7bZUjXLzkjXrmXc1SgmjHX2jKKKCGKrTB6aAE";
    const program = new Program(idl, programID, provider);
  }
};
