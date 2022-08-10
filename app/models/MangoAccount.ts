import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import BN from 'bn.js';
import {
  Program,
  AnchorProvider,
  utils,
  web3 as anchorWeb3
} from '@project-serum/anchor';
import idl from '../idl.json';
import { IDS, MangoClient, Config, getMarketByBaseSymbolAndKind } from "@blockworks-foundation/mango-client";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { Utils } from '../common/Utils'

const { SystemProgram } = anchorWeb3;
const utf8 = utils.bytes.utf8;

export class MangoAccount {
  static create = async (anchorWallet, tradeObject) => {
    const program = Utils.getProgram(anchorWallet);

    const cluster = 'devnet';
    const group = 'devnet.2';
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
      [utf8.encode('new-trade'), tradeObject.owner.toBuffer(), new BN(tradeObject.id).toArrayLike(Buffer, 'be', 8)],
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

  static deposit = async (anchorWallet, tradeObject) => {
    const program = Utils.getProgram(anchorWallet);

    const cluster = 'devnet';
    const group = 'devnet.2';
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
      [utf8.encode('new-trade'), tradeObject.owner.toBuffer(), new BN(tradeObject.id).toArrayLike(Buffer, 'be', 8)],
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

    const devnetConnection = new Connection(clusterApiUrl('devnet'), 'processed');
    // IDs lookup
    // https://github.com/blockworks-foundation/mango-client-v3/blob/main/src/ids.json
    const rootBanks = await mangoGroup.loadRootBanks(devnetConnection);
    // Mainnet USDC root key
    // const usdcRootKey = 'AMzanZxMirPCgGcBoH9kw4Jzi9LFMomyUCXbpzDeL2T8';
    // Devnet USDC root key
    const usdcRootKey = 'JBwwKNaqwyWVd5W22m5umAGUrqG4Lf7N6oWrtQEmBg6c';

    const rootBank = rootBanks.find((bank) => {
      if (!bank) {
        return false;
      }
      return bank.publicKey.toString() == usdcRootKey;
    });
    const nodeBank = rootBank.nodeBankAccounts[0].publicKey;

    const mint = new PublicKey("S6PfGEDTqmG3fxYATnXKhRLGNk1XExikwFfJXTrm38o"); // fUSDC localnet
    const usdcMint = new PublicKey("8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN");
    const vault = rootBank.nodeBankAccounts[0].vault;
    const ownerTokenAccount = await getAssociatedTokenAddress(
      mint, // TODO: change for usdcMint in devnet/mainnet
      tradePDA,
      true
    );

    console.log(mangoGroup.mangoCache, rootBank.publicKey, nodeBank, vault, ownerTokenAccount);
    return program.methods.depositMangoAccount(
      new BN(100)
    ).accounts({
      mangoProgram: mangoProgramIdPk,
      mangoGroup: mangoGroupKey,
      mangoAccount: mangoAccountPk,
      trade: tradePDA,
      mangoCache: mangoGroup.mangoCache,
      rootBank: rootBank.publicKey,
      nodeBank: nodeBank,
      vault: vault,
      ownerTokenAccount: ownerTokenAccount,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      payer: anchorWallet.publicKey,
    })
  }

  static placePerpOrder = async (anchorWallet, tradeObject) => {
    const program = Utils.getProgram(anchorWallet);

    const cluster = 'devnet';
    const group = 'devnet.2';
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
      [utf8.encode('new-trade'), tradeObject.owner.toBuffer(), new BN(tradeObject.id).toArrayLike(Buffer, 'be', 8)],
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

    // const perpMarkets = await Promise.all(
    //   mangoGroup.perpMarkets.map((perpMarket) => {
    //     return mangoGroup.loadPerpMarket(
    //       mangoConnection,
    //       perpMarket.marketIndex,
    //       perpMarket.baseDecimals,
    //       perpMarket.quoteDecimals,
    //     );
    //   }),
    // );
    // console.log(perpMarkets);

    const perpMarketConfig = getMarketByBaseSymbolAndKind(
      groupConfig,
      'SOL',
      'perp',
    );
    console.log(perpMarketConfig);

    const perpMarket = await mangoGroup.loadPerpMarket(
      mangoConnection,
      perpMarketConfig.marketIndex,
      perpMarketConfig.baseDecimals,
      perpMarketConfig.quoteDecimals,
    );
    console.log(perpMarket);

    console.log(perpMarket.bids, perpMarket.asks);
    return program.methods.placePerpOrder2().accounts({
      mangoProgram: mangoProgramIdPk,
      mangoGroup: mangoGroupKey,
      mangoAccount: mangoAccountPk,
      trade: tradePDA,
      mangoCache: mangoGroup.mangoCache,
      perpMarket: perpMarket.publicKey,
      bids: perpMarket.bids,
      asks: perpMarket.asks,
      eventQueue: perpMarket.eventQueue,
      systemProgram: SystemProgram.programId,
      payer: anchorWallet.publicKey,
    })
  }
}
