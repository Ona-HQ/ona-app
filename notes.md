

https://twitter.com/pencilflip/status/1483880018858201090


Useful links:
https://solanacookbook.com/integrations/mango.html#how-to-create-a-mango-account
https://github.com/solana-developers/solana-cookbook/pull/299/files
https://github.com/blockworks-foundation/mango-client-v3/blob/main/src/ids.json
https://github.com/coral-xyz/anchor/blob/master/ts/src/program/namespace/account.ts
https://github.com/blockworks-foundation/mango-ui/blob/b6abfc6c13b71fc17ebbe766f50b8215fa1ec54f/src/utils/mango.tsx

ENV backup
NEXT_PUBLIC_NETWORK=localnet
NEXT_PUBLIC_ANCHOR_WALLET=secret
NEXT_PUBLIC_PROGRAM_ID=68i2xmU7bZUjXLzkjXrmXc1SgmjHX2jKKKCGKrTB6aAE
NEXT_PUBLIC_USDC_MINT=S6PfGEDTqmG3fxYATnXKhRLGNk1XExikwFfJXTrm38o


https://book.anchor-lang.com/anchor_references/javascript_anchor_types_reference.html


Mainnet Mango Program v3: mv3ekLzLbnVPNxjSKvqBpU3ZeZXPQdEC3bp5MDEBG68
https://solanacookbook.com/integrations/mango.html#how-to-deposit-usdc-into-a-mango-account
https://github.com/solana-developers/solana-cookbook/blob/fcba8d43e618e6f1a62d9bbf7b6dc58b939a0d64/code/mango/create-account/create-account.en.rs

https://www.tradingview.com/chart/SOLUSDT/7jB8Sksc-SOL-Bullish-Triangle-Break-Out-Soon/

# TODO
- Demo video
- Twitter Thread
🚀 ANNCOUNCING 🚀

Ona: The first social trading protocol on Solana that allows you to invest into single trades with friends
We are powered by Solana and Mango Markets, and proud participants in Solana's Summer Camp Hackathon :)

👉  https://ona.so

a thread 🧵 (1/8)

2/8
Every now and then we discover a great trading opportunity. What do you do?

Some traders share their views on Twitter, some others have private trading groups and still others simply execute. However... besides trading this idea yourself, there has been no way to share the opportunity directly with others or to monetize it.

Until now.

3/8
Ona allows you to turn a trade idea into an investible on-chain fundraising mechanism, natively on Solana. A trader can share their TradingView plan and get funded by the Solana community within hours. Once funded, limit orders are automatically and transparently placed on a Mango Markets account.

4/8
When a trade ends, investors get their pro-rata profits and trade owners get a 10% profit share. This share goes up as the trader's reputation on Ona improves.

5/6
Solana is a high-speed L1 settlement layer which processes over a hundred thousand transactions per minute. In other words, it's the perfect platform to build this kind of trading protocol in a trustless way. A trade owner never has direct access to the deposited funds as they can only interact through the Mango limit orders (short and long with the funds on leverage).

6/7
Us ourselves are successful startup founders (having been CTO and CPO pre and post-acquisition) with over a decade of product development. We are also avid traders and live on TradingView - every time we see a great trade, we'd love to invest in it :)

6/7
Ona will be accessible on Devnet soon. Our Mainnet launch happens in September. Read up on our documentation to get a sense of the little details: https://docs.ona.so

6/7
Enjoy using the protocol! DMs are open. Suggestions are welcome. Follow along for new developments and discovery of unique trades 💕

Happy trading! 


- Settle Fees + Settle PnL (https://explorer.solana.com/tx/5y5HzrjfonmeVSmBEZf2dd34LgerPont1agngVrUMydjtVUkn92HGXcFWZQ14RF8kiSTT77Ykg9HNbrYmWeLk5n6?cluster=devnet)
- Look into SetDelegate and CloseMangoAccount

## Doing


## Done
- Show Open Trades
- Where (and how) to save profit? Goes on trade PDA
- Fund a trade (send USDC)
- Save a user's started trades
- Save a user's funded trades
- Show User's Profile
- Link to Mango trade account when trade is running
- Make sure there is a way to withdraw if trader doesn't make a trade (after X amount of time)? e.g. Maximum 4 weeks?
- Save Mango Markets Trade ID on trade when trade starts
- Cancel a perp order
- Calculate funding percentage
- Save traders PNL trade success
- Save status of trade on trade object (AWAITING_MANGO_ACCOUNT, RAISING, INITIATED_TRADE, EXECUTED_TRADE, CANCELLED_TRADE)
  User indicates how long they raise (e.g. 24 hours)
  After 24 hours (the funding window), there is a 7 day window for the trade to start (INITIATE_TRADE)
  If not initiated within 7 days, the trade is finished and marked as CANCELLED_TRADE
  If initiated within 7 days, the trade is going until the stop loss or take profit target hits, or if the trader takes profit manually
- Withdraw from Mango account (when trade successfully executed, need to be executed manually)
- Allow to cancel perp orders for trade account (when situation has changed and perhaps when you wanna market sell?)
- Logo
- Welcome Modal
- Landing page
- Fix view Mango account
- Fix creating account redirect
- Roadmap
- Fix fund trade TX (.rpc is not a function?)
- Email Account
- Documentation
- Twitter Account
- Make flow overview
- Fix cancel TX as a user
- Show error messages to user
- Monitize trade as trade manager
- Write down whole flow with trade states + How does a trade end? (FinishedTrade state)

## Roadmap
- Partial bids & asks
- Reputation system
- Ona Token
- Look up trades of other users
- Show most successful traders (leaderboard)
- Search trades (on asset, long/short, title, description)
- Follow users
- Search users
- Register on-chain the perp markets
- Verified Accounts
- Continuous Funds for Verified Accounts
- Comments on trades
- Like/follow trades
- Drift.trade integration
- Vault Analytics


https://imfeld.dev/writing/starting_with_solana_part04

https://stackoverflow.com/questions/68732603/how-can-a-solana-rust-smart-contract-get-block-height-or-unix-time
https://docs.rs/anchor-lang/latest/anchor_lang/prelude/struct.Clock.html


https://rustrepo.com/repo/project-serum-anchor


Mango:
https://github.com/blockworks-foundation/mango-client-v3
https://github.com/blockworks-foundation/mango-v3

1. Create Mango Account
https://explorer.solana.com/tx/2PEvERU3zY4bhNmYkYwK6Ld4FETQuXvr9t1hwrtDPB2Kp1QdBaTbS4QY4MXzqcfPRCXqw4tqczV98efjuPYbxZE2?cluster=devnet

2. Create Spot open orders
https://explorer.solana.com/tx/5Ud5q1ZikJQN3rYxGezzhPiUHv3LzqX3zpS21zzXU11KXU6T7Q2VhKwnXMqzZKUuFc9iL5v2ANPP49zucCGqveXc?cluster=devnet

3. Place Spot Order
https://explorer.solana.com/tx/4NsGDMkxGpU2bA6KrTGZ3JPFvt4zyhGu3tmhtqc3UWZz9R2V4oBRtwTetZww7NLFhvy7yxB6GWvSsp565RwzVKyW?cluster=devnet

4. Settle?
https://explorer.solana.com/tx/38AGa7ThXfsDxMvJTwFqXPYzkxSozrvt8zs2MtYyWGk9Dh5Ag8dhbCtt2qShq9FTvuHqzru1q7bAmq7ytuhxj9wo?cluster=devnet

5. Place Perp Order2 (Buy)
https://explorer.solana.com/tx/8GcKzeMarcz3H4zp1QR7R1xpTzJEXP8LYQ1CqamsXsSq9t6Mrf4ZvCcnwMhjessNnyv69hTy5S4CFtKuFdE9KeH?cluster=devnet

Settle PnL
https://explorer.solana.com/tx/vTJFrGhQW7LHL7mf8LrEMWSqtRHmM1dq8Lc6KBKzC3S99F8Mwtyygt7T2JGJWSkt6jxibaRBYMFEGzE3EeLATZe?cluster=devnet
https://explorer.solana.com/tx/56HKDciKCWCGcvzRogUe35tQwjyygrJBHUcGwKseysNoRwe5YiiMx78cgGCDKHMcnR4SThT8LCwBVjDP82AnLLvo?cluster=devnet

6. Place Perp Order2 (Sell)
https://explorer.solana.com/tx/4xEUkWtJHvxXatDdLHcgTBzKrVMRiA6rZG7bifbzPaZMn2v1zXpm9qgvy3ecViEeAFSAgdbN4tMndbzVmv7J2FbX?cluster=devnet



