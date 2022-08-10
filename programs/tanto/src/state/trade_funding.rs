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
  pub amount: u64
}

impl TradeFunding {
  pub fn add_funding(&mut self, amount: u64) -> Result<()> {
    self.amount = amount;
    Ok(())
  }

  pub fn withdraw_funds(&mut self) -> Result<()> {
    self.amount = 0;
    Ok(())
  }
}
