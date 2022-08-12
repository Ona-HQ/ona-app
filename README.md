
# Deploying from scratch

in anchor.toml file add `wallet = "./id.json"`
then in the project directory:
`solana-keygen new -o id.json`

this will generate something lik this: `pubkey: 9bFcXvyjBuELw522FTRSU1umTTGaSLLD5iujjpQK6wt6`
since you are using this wallet airdrop
`solana airdrop 2 9bFcXvyjBuELw522FTRSU1umTTGaSLLD5iujjpQK6wt6 --url devnet`

open anchor.toml file. update the file
```
// [programs.localnet] change to devnet
[programs.devnet]

// cluster = "localnet" change to devnet
cluster = "devnet"
```

run `anchor build`
this creates a new build with new programId. access this program id

`solana address -k target/deploy/yourprojectname-keypair.json`
this will give you the programId of deployed contract

Now in lib.rs and anchor.toml update the declareId with this code.
lib.rs
`declare_id!("paste the programId of deployed contract");`

anchor.toml
`yourProjectName = "paste the programId of deployed contract"`

now run anchor build again now we are ready to deploy
`anchor deploy`



# Requesting USDC on Devnet

Mint authority: https://explorer.solana.com/address/4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU?cluster=devnet
Use https://usdcfaucet.com/

# Set up code

- Change USDC mint in create_trade
- Update .env variables

# Airdrop USDC on devnet to use on Mango

Mint = 8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN
Faucet = B87AhxX6BkBsj3hnyHzcerX2WxPoACC7ZyDr8E7H9geN
Amount = 1000000000000 for 1Mio USDC

go to https://spl-token-ui.netlify.app/#/
1. Create associated token account for devnet “Accounts>Create Account”
2. Mint usdc to your new ATA at “Airdrops > Token Faucets” select “Token Airdrop”
