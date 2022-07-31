use crate::errors::TantoError;
use anchor_lang::prelude::*;
use num_derive::*;
use num_traits::*;

// Trade is created through a PDA that has the user's public key and a trade ID?
#[account]
pub struct Trade {
  owner: Pubkey,
  title: String,
  description: String,
  asset: Asset,
  direction: bool, // true is long, false is short
  chart: String, // TradingView URL
  entry_price: usize,
  target_price: usize,
  leverage: u8,
  start_time: i64, // Unix Timestamp
  hours_to_raise: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum Asset {
  Sol,
  Btc,
  Eth
}

impl Trade {
  pub fn create_trade(
    &mut self,
    owner: Pubkey, title: String, description: String, asset: Asset, direction: bool,
    chart: String, entry_price: usize, target_price: usize, leverage: u8, start_time: i64,
    hours_to_raise: u8
  ) -> Result<()> {
    let now_ts = Clock::get().unwrap().unix_timestamp;

    Ok(())
  }
}
