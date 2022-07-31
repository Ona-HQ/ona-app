use crate::errors::TantoError;
use anchor_lang::prelude::*;

#[account]
pub struct Global {
  pub last_user_id: usize,
  pub last_trade_id: usize,
  pub bump: u8,
}

impl Global {
  pub fn find_or_create_globals(&mut self) -> Result<()> {
    require_eq!(self.last_trade_id, 0, TantoError::GlobalsAlreadyInitiated);
    require_eq!(self.last_user_id, 0, TantoError::GlobalsAlreadyInitiated);

    self.last_trade_id = 1;
    self.last_trade_id = 1;
    self.bump = 1; // TODO: fix bump

    Ok(())
  }
}
