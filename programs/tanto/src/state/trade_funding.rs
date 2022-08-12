use anchor_lang::prelude::*;

/// A trade funding account is a user account attached to a trade, it will do bookkeeping
/// for owner, and additionally other metadata e.g. how much funds did the user
/// deposit in trade etc.
#[account]
#[derive(Default)]
pub struct TradeFunding {
  pub bump: u8,
  pub trade: Pubkey,
  pub owner: Pubkey,
  pub has_funded: bool,
  pub amount: u64,
}

impl TradeFunding {
  pub fn add_funding(&mut self, trade: Pubkey, owner: Pubkey, amount: u64, bump: u8) -> Result<()> {
    self.trade = trade;
    self.owner = owner;
    self.amount = amount;
    self.bump = bump;
    self.has_funded = true;

    Ok(())
  }

  pub fn withdraw_funds(&mut self) -> Result<()> {
    self.amount = 0;
    Ok(())
  }
}
