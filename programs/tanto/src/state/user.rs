use anchor_lang::prelude::*;

#[account]
pub struct User {
  id: i64,
  owner: Pubkey,
  twitter: String,
  avatar: String,
  success_percentage: u8,
  started_trades: Vec<i64>,
  funded_trades: Vec<i64>,
  bump: u8,
}

impl User {
  pub fn create_user(&mut self, id: i64, twitter: String, bump: u8) -> Result<()> {
    self.twitter = twitter;
    self.bump = bump;

    Ok(())
  }
}
