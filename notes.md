
https://book.anchor-lang.com/anchor_references/javascript_anchor_types_reference.html


    webpack5: true,
    webpack: (config) => {
      config.resolve.fallback = { fs: false };

      return config;
    },

Mainnet Mango Program v3: mv3ekLzLbnVPNxjSKvqBpU3ZeZXPQdEC3bp5MDEBG68
https://solanacookbook.com/integrations/mango.html#how-to-deposit-usdc-into-a-mango-account
https://github.com/solana-developers/solana-cookbook/blob/fcba8d43e618e6f1a62d9bbf7b6dc58b939a0d64/code/mango/create-account/create-account.en.rs

# TODO

## v1
- Make sure there is a way to withdraw if trader doesn't make a trade (after X amount of time)?
    e.g. Maximum 4 weeks?
- Save Mango Markets Trade ID on trade when trade starts
- Where (and how) to save profit?
- Save traders PNL trade success
- Fund a trade (send USDC)
- Save a user's started trades
- Save a user's funded trades
- Save status of trade on trade object (AWAITING_MANGO_ACCOUNT, RAISING, INITIATED_TRADE, EXECUTED_TRADE, CANCELLED_TRADE)
  User indicates how long they raise (e.g. 24 hours)
  After 24 hours (the funding window), there is a 7 day window for the trade to start (INITIATE_TRADE)
  If not initiated within 7 days, the trade is finished and marked as CANCELLED_TRADE
  If initiated within 7 days, the trade is going until the stop loss or take profit target hits, or if the trader takes profit manually
- Integrate with Mango Markets

## v2
- Show Active Traders
- Search trades (on asset, long/short, title, description)
- Search users
- Show User's Profile

## done
- Show Open Trades



## Roadmap
- Allow partial bids & asks
- As a user, I can look up trades of other users
- 


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

5. Place Perp Order2
https://explorer.solana.com/tx/8GcKzeMarcz3H4zp1QR7R1xpTzJEXP8LYQ1CqamsXsSq9t6Mrf4ZvCcnwMhjessNnyv69hTy5S4CFtKuFdE9KeH?cluster=devnet
