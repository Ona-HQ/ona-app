import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import BN from 'bn.js';
import {
  Program,
  AnchorProvider,
  utils,
  web3 as anchorWeb3
} from '@project-serum/anchor';
import idl from '../idl.json';
import { IDS, MangoClient, Config } from "@blockworks-foundation/mango-client";

const { SystemProgram } = anchorWeb3;
const utf8 = utils.bytes.utf8;

export class MangoAccount {
  static create = async (anchorWallet) => {
    const network = clusterApiUrl('devnet'); // "http://127.0.0.1:8899";
    const connection = new Connection(network, "processed");
    const provider = new AnchorProvider(
      connection, anchorWallet, {"preflightCommitment": "processed"},
    );
    const programID = "68i2xmU7bZUjXLzkjXrmXc1SgmjHX2jKKKCGKrTB6aAE";
    const program = new Program(idl, programID, provider);

    const cluster = 'devnet';
    const group = 'devnet.3';
    const config = new Config(IDS);
    const groupConfig = config.getGroup(cluster, group);
    if(!groupConfig) {
      throw new Error("unable to get mango group config");
    }
    const mangoGroupKey = groupConfig.publicKey;

    const clusterData = IDS.groups.find((g) => {
      return g.name == group && g.cluster == cluster;
    });
    const mangoProgramIdPk = new PublicKey(clusterData.mangoProgramId);

    const clusterUrl = IDS.cluster_urls[cluster];
    const mangoConnection = new Connection(clusterUrl, 'singleGossip');
    const client = new MangoClient(mangoConnection, mangoProgramIdPk);
    const mangoGroup = await client.getMangoGroup(mangoGroupKey);

    const accountNum = new BN(1);
    const [tradePDA] = await PublicKey.findProgramAddress(
      [utf8.encode('new-trade'), anchorWallet.publicKey.toBuffer()],
      program.programId,
    );
    const [mangoAccountPk] = await PublicKey.findProgramAddress(
      [
        mangoGroup.publicKey.toBytes(),
        tradePDA.toBytes(),
        accountNum.toArrayLike(Buffer, 'le', 8) //.toBuffer('le', 8)
      ],
      mangoProgramIdPk,
    );
    const [globalsPDA] = await PublicKey.findProgramAddress(
      [utf8.encode('globals')],
      program.programId,
    );

    return program.methods.createMangoAccount(
    ).accounts({
      mangoProgram: mangoProgramIdPk,
      mangoGroup: mangoGroupKey,
      mangoAccount: mangoAccountPk,
      trade: tradePDA,
      systemProgram: SystemProgram.programId,
      payer: anchorWallet.publicKey,
    })
  }
}
