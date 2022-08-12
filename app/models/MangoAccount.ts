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

    const accountNum = new BN(tradeObject.id);
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

    const accountNum = new BN(tradeObject.id);
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
    // const usdcRootKey = 'JBwwKNaqwyWVd5W22m5umAGUrqG4Lf7N6oWrtQEmBg6c'; // devnet.3 group
    const usdcRootKey = 'HUBX4iwWEUK5VrXXXcB7uhuKrfT4fpu2T9iZbg712JrN'; // devnet.2 group

    const rootBank = rootBanks.find((bank) => {
      if (!bank) {
        return false;
      }
      return bank.publicKey.toString() == usdcRootKey;
    });
    console.log(rootBank);
    const nodeBank = rootBank.nodeBankAccounts[0].publicKey;

    const mint = new PublicKey(process.env.NEXT_PUBLIC_USDC_MINT);
    const vault = rootBank.nodeBankAccounts[0].vault;
    const ownerTokenAccount = await getAssociatedTokenAddress(
      mint,
      tradePDA,
      true
    );

    console.log(mangoAccountPk.toBase58(), mangoGroup.mangoCache.toBase58(), rootBank.publicKey.toBase58(), nodeBank.toBase58(), vault.toBase58(), ownerTokenAccount.toBase58());
    return program.methods.depositMangoAccount(
      new BN(tradeObject.totalFunding)
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

  static placePerpOrder = async (anchorWallet, tradeObject, tradePDA, mangoAccountPk) => {
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

    const perpMarket = await Utils.getMangoPerpMarket(tradeObject.asset);
    // console.log(perpMarket.baseLotsToNumber(new BN(5)));
    // console.log(perpMarket);
    // console.log(parseInt(perpMarket.baseLotSize));

    console.log(tradePDA.toBase58(), mangoAccountPk.toBase58(), perpMarket.bids, perpMarket.asks);
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

  static cancelAllOrders = async (anchorWallet, tradeObject, tradePDA, mangoAccountPk) => {
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

    const perpMarket = await Utils.getMangoPerpMarket(tradeObject.asset);

    return program.methods.cancelPerpOrder().accounts({
      mangoProgram: mangoProgramIdPk,
      mangoGroup: mangoGroupKey,
      mangoAccount: mangoAccountPk,
      trade: tradePDA,
      perpMarket: perpMarket.publicKey,
      bids: perpMarket.bids,
      asks: perpMarket.asks,
      systemProgram: SystemProgram.programId,
      payer: anchorWallet.publicKey,
    });
  }

  static marketCloseOrder = async (anchorWallet, tradeObject, tradePDA, mangoAccountPk) => {
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
    const perpMarket = await Utils.getMangoPerpMarket(tradeObject.asset);

    return program.methods.marketClosePerpOrdersMango().accounts({
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

  static withdraw = async (anchorWallet, tradeObject, tradePDA, mangoAccountPk) => {
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
    const perpMarket = await Utils.getMangoPerpMarket(tradeObject.asset);

    const devnetConnection = new Connection(clusterApiUrl('devnet'), 'processed');
    // IDs lookup
    // https://github.com/blockworks-foundation/mango-client-v3/blob/main/src/ids.json
    const rootBanks = await mangoGroup.loadRootBanks(devnetConnection);
    // Mainnet USDC root key
    // const usdcRootKey = 'AMzanZxMirPCgGcBoH9kw4Jzi9LFMomyUCXbpzDeL2T8';
    // Devnet USDC root key
    // const usdcRootKey = 'JBwwKNaqwyWVd5W22m5umAGUrqG4Lf7N6oWrtQEmBg6c'; // devnet.3 group
    const usdcRootKey = 'HUBX4iwWEUK5VrXXXcB7uhuKrfT4fpu2T9iZbg712JrN'; // devnet.2 group

    const rootBank = rootBanks.find((bank) => {
      if (!bank) {
        return false;
      }
      return bank.publicKey.toString() == usdcRootKey;
    });
    const nodeBank = rootBank.nodeBankAccounts[0].publicKey;
    const mint = new PublicKey(process.env.NEXT_PUBLIC_USDC_MINT);
    const vault = rootBank.nodeBankAccounts[0].vault;
    const ownerTokenAccount = await getAssociatedTokenAddress(
      mint,
      tradePDA,
      true
    );
    const [userPDA] = await PublicKey.findProgramAddress(
      [utf8.encode('user-account'), anchorWallet.publicKey.toBuffer()],
      program.programId,
    );

    // Withdraws from both Mango (if required) and sends pro-rata funds to user
    return program.methods.withdrawFromMangoAccount(new BN(1000000000)).accounts({
      mangoProgram: mangoProgramIdPk,
      mangoGroup: mangoGroupKey,
      mangoAccount: mangoAccountPk,
      trade: tradePDA,
      mangoCache: mangoGroup.mangoCache,
      rootBank: rootBank.publicKey,
      nodeBank: nodeBank,
      vault: vault,
      signer: mangoGroup.signerKey,
      ownerTokenAccount: ownerTokenAccount,
      userAccount: userPDA,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      payer: anchorWallet.publicKey,
    })
  }
}
