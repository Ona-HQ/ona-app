require('dotenv').config();

// Run with
// ANCHOR_PROVIDER_URL="http://localhost:8899" ANCHOR_WALLET=/Users/philip/.config/solana/id.json node airdrop.js

// Output
// Current balance is 1993535920 8CCZ5pomNyotkib8TMr2GGSx52QLNwyY6kp8juZ11bNt
// Creating mint...
// Got mint: S6PfGEDTqmG3fxYATnXKhRLGNk1XExikwFfJXTrm38o
// Token Account: 9Rv7iqZrADmAk7b9m4UuF1DqBsfeAkwyBPj2KLetcU5e
// Token Account Mint: S6PfGEDTqmG3fxYATnXKhRLGNk1XExikwFfJXTrm38o
// Token Account Owner: FUpzwqzu9zy2cgTuYGjMsyCsW2Z1npnMitT3JT4tT44e
// 5r5eR5fJ3BbTuVK6ctPcaXqVTj87FKXiNtvgWrwsrVwNjYPt3xJc2jijMraiwvbmmpA7ZPWsnUHvmzVPkaxo4Rk

const anchor = require('@project-serum/anchor');
const { createMint, TOKEN_PROGRAM_ID, getAssociatedTokenAddress, mintTo, getOrCreateAssociatedTokenAccount, ASSOCIATED_TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const { SystemProgram, PublicKey } = anchor.web3;
const { Connection, clusterApiUrl, TransactionInstruction, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const fs = require('fs');

let provider = anchor.AnchorProvider.local("http://localhost:8899");
anchor.setProvider(provider);
const program = anchor.workspace.Ona;
const network = "http://127.0.0.1:8899";
const connection = new Connection(network, "processed");
const amount = 100000;

async function initializeKeypair(connection) {
  if (!process.env.PRIVATE_KEY) {
    console.log("Creating .env file")
    const signer = Keypair.generate()
    fs.writeFileSync(".env", `PRIVATE_KEY=[${signer.secretKey.toString()}]`)
    await airdropSolIfNeeded(signer, connection)
    return signer
  }

  const secret = JSON.parse(process.env.PRIVATE_KEY ?? "");
  const secretKey = Uint8Array.from(secret)
  const keypairFromSecretKey = Keypair.fromSecretKey(secretKey)
  await airdropSolIfNeeded(keypairFromSecretKey, connection)
  return keypairFromSecretKey
}

async function airdropSolIfNeeded(signer, connection) {
  const balance = await connection.getBalance(signer.publicKey)
  console.log("Current balance is", balance, signer.publicKey.toString())
  if (balance < LAMPORTS_PER_SOL) {
    console.log("Airdropping 1 SOL...")
    const res = await connection.requestAirdrop(signer.publicKey, LAMPORTS_PER_SOL);
    console.log(res);
  }
}

async function airdrop() {
  const user = await initializeKeypair(connection);
  const mint = new PublicKey('S6PfGEDTqmG3fxYATnXKhRLGNk1XExikwFfJXTrm38o');
  const owner = new PublicKey('4gkBdp25hjdZr7ZjShLRXeC58QgV872LmumoFGmy9J41');

  console.log('Sending', amount, mint.toString(), 'tokens to', owner.toString());
  // connection: web3.Connection,
  // payer: web3.Keypair,
  // mint: web3.PublicKey,
  // owner: web3.PublicKey
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    mint,
    owner
  );

  // connection,
  // payer,
  // mint,
  // destination,
  // authority,
  // amount
  const transactionSignature = await mintTo(
     connection,
     user,
     mint,
     tokenAccount.address,
     user,
     amount
  );

  console.log(transactionSignature);
}

async function createAndAirdrop() {
  const user = await initializeKeypair(connection);
  console.log('Creating mint...');
  const mint = await createMint(
    connection,
    user,
    user.publicKey,
    user.publicKey,
    2
  );
  console.log('Got mint:', mint.toString());

  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    mint,
    provider.wallet.publicKey,
  );
  console.log('Token Account:', tokenAccount.address.toString());
  console.log('Token Account Mint:', tokenAccount.mint.toString());
  console.log('Token Account Owner:', tokenAccount.owner.toString());

  const transactionSignature = await mintTo(
    connection,
    user,
    mint,
    tokenAccount.address,
    user,
    amount
 );

  console.log(transactionSignature);
}

airdrop();
