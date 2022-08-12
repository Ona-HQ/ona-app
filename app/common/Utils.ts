import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import {
  Program,
  AnchorProvider,
  BN,
  utils,
  web3 as anchorWeb3
} from '@project-serum/anchor';
import idl from '../idl.json';
import { IDS, MangoClient, Config, getMarketByBaseSymbolAndKind } from "@blockworks-foundation/mango-client";

const getConfirmation = async (connection: Connection, tx: string) => {
  const result = await connection.getSignatureStatus(tx, {
    searchTransactionHistory: true,
  });
  console.log(result);
  return result.value;
};

export class Utils {
  static getConnection() {
    const environment = process.env.NEXT_PUBLIC_NETWORK;
    let network;
    if (environment === 'localnet') {
      network = "http://127.0.0.1:8899";
    } else if (environment === 'devnet') {
      network = clusterApiUrl('devnet');
    } else {
      network = clusterApiUrl('mainnet-beta');
    }

    console.log(network);
    return new Connection(network, "processed");
  }

  static getProgram(anchorWallet) {
    const environment = process.env.NEXT_PUBLIC_NETWORK;
    let network;
    if (environment === 'localnet') {
      network = "http://127.0.0.1:8899";
    } else if (environment === 'devnet') {
      network = clusterApiUrl('devnet');
    } else {
      network = clusterApiUrl('mainnet-beta');
    }
    const connection = new Connection(network, "processed");
    const provider = new AnchorProvider(
      connection, anchorWallet, {"preflightCommitment": "processed"},
    );
    const programID = process.env.NEXT_PUBLIC_PROGRAM_ID;
    const program = new Program(idl, programID, provider);

    return program;
  }

  static getTransactionStatus = async (txId) => {
    const environment = process.env.NEXT_PUBLIC_NETWORK;
    let network;
    if (environment === 'localnet') {
      network = "http://127.0.0.1:8899";
    } else if (environment === 'devnet') {
      network = clusterApiUrl('devnet');
    } else {
      network = clusterApiUrl('mainnet-beta');
    }
    const connection = new Connection(network, "processed");

    if (environment === 'localnet') {
      return true;
    } else {
      const result = await getConfirmation(connection, txId);
      return result?.status['Ok'];
    }
  }

  static getMangoGroupConfig = () => {
    const environment = process.env.NEXT_PUBLIC_NETWORK;
    let network;
    let cluster = 'devnet';
    let group = 'devnet.2';
    if (environment !== 'devnet' && environment !== 'localnet') {
      cluster = 'mainnet';
      group = 'mainnet.1';
    }
    const config = new Config(IDS);
    const groupConfig = config.getGroup(cluster, group);
    if(!groupConfig) {
      throw new Error("unable to get mango group config");
    }
    const clusterData = IDS.groups.find((g) => {
      return g.name == group && g.cluster == cluster;
    });
    const clusterUrl = IDS.cluster_urls[cluster];

    return [groupConfig, clusterData, clusterUrl];
  }

  static getMangoPerpMarket = async (asset) => {
    console.log('Looking for perp market config for', asset);
    const [groupConfig, clusterData, clusterUrl] = Utils.getMangoGroupConfig('devnet.2');
    const mangoGroupKey = groupConfig.publicKey;
    const mangoConnection = new Connection(clusterUrl, 'singleGossip');
    const mangoProgramIdPk = new PublicKey(clusterData.mangoProgramId);
    const client = new MangoClient(mangoConnection, mangoProgramIdPk);
    const mangoGroup = await client.getMangoGroup(mangoGroupKey);

    const perpMarketConfig = getMarketByBaseSymbolAndKind(
      groupConfig,
      asset,
      'perp',
    );
    const perpMarket = await mangoGroup.loadPerpMarket(
      mangoConnection,
      perpMarketConfig.marketIndex,
      perpMarketConfig.baseDecimals,
      perpMarketConfig.quoteDecimals,
    );
    console.log(perpMarketConfig, perpMarket);

    return perpMarket;
  }
};
