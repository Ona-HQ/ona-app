use crate::errors::TantoError;
use anchor_lang::prelude::*;

#[account]
pub struct Global {
  pub admin: Pubkey,
  pub last_user_id: u64,
  pub last_trade_id: u64,
  pub bump: u8,
}

impl Global {
  pub fn find_or_create_globals(&mut self, admin: Pubkey, bump: u8) -> Result<()> {
    require_eq!(self.last_trade_id, 0, TantoError::GlobalsAlreadyInitiated);
    require_eq!(self.last_user_id, 0, TantoError::GlobalsAlreadyInitiated);

    self.admin = admin;
    self.last_trade_id = 1;
    self.last_trade_id = 1;
    self.bump = bump;

    Ok(())
  }
}
