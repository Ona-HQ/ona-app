use anchor_lang::prelude::*;

#[account]
pub struct User {
  id: usize,
  owner: Pubkey,
  twitter: String,
  avatar: String,
  success_percentage: u8,
  started_trades: Vec<usize>,
  funded_trades: Vec<usize>,
  bump: u8,
}

impl User {
  pub fn create_user(&mut self, id: usize, twitter: String, bump: u8) -> Result<()> {
    self.twitter = twitter;
    self.bump = bump;

    Ok(())
  }
}
