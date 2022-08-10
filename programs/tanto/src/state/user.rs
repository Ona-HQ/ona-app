use anchor_lang::prelude::*;

#[account]
pub struct User {
  id: u64,
  pub owner: Pubkey,
  verified: bool,
  twitter: String,
  avatar: String,
  failed_trades: u8,
  successful_trades: u8,
  started_trades: Vec<Pubkey>,
  funded_trades: Vec<Pubkey>,
  pub bump: u8,
}

impl User {
  pub fn create_user(&mut self, id: u64, twitter: String, bump: u8) -> Result<()> {
    self.id = id;
    self.twitter = twitter;
    self.bump = bump;

    Ok(())
  }

  pub fn add_started_trade(&mut self, trade_id: Pubkey) -> Result<()> {
    self.started_trades.push(trade_id);

    Ok(())
  }

  pub fn add_funded_trade(&mut self, trade_id: Pubkey) -> Result<()> {
    self.funded_trades.push(trade_id);

    Ok(())
  }

  // https://stackoverflow.com/questions/26243025/remove-an-element-from-a-vector
  pub fn remove_started_trade(&mut self, trade_id: Pubkey) -> Result<()> {
    let index = self.started_trades.iter().position(|x| *x == trade_id).unwrap();
    self.started_trades.remove(index);

    Ok(())
  }

  pub fn remove_funded_trade(&mut self, trade_id: Pubkey) -> Result<()> {
    let index = self.started_trades.iter().position(|x| *x == trade_id).unwrap();
    self.started_trades.remove(index);

    Ok(())
  }

  pub fn verify_user(&mut self) -> Result<()> {
    self.verified = true;
    Ok(())
  }

  pub fn unverify_user(&mut self) -> Result<()> {
    self.verified = false;
    Ok(())
  }

  pub fn update_success_rate(&mut self, is_success: bool) -> Result<()> {
    if is_success {
      self.successful_trades += 1;
    } else {
      self.failed_trades += 1;
    }

    Ok(())
  }
}
