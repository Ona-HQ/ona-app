use crate::errors::TantoError;
use anchor_lang::prelude::*;
use num_derive::*;
use num_traits::*;

// TODO: Trade is created through a PDA that has the user's public key and a trade ID?
#[account]
pub struct Trade {
  pub id: usize,
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
  funding_goal: usize,
  fundings: Vec<Funding>
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Funding {
  amount: usize,
  user: Pubkey,
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
    hours_to_raise: u8, funding_goal: usize
  ) -> Result<()> {
    let now_ts = Clock::get().unwrap().unix_timestamp;

    self.owner = owner;
    self.title = title;
    self.description = description;
    self.asset = asset;
    self.direction = direction;
    self.chart = chart;
    self.entry_price = entry_price;
    self.target_price = target_price;
    self.leverage = leverage;
    self.start_time = start_time;
    self.hours_to_raise = hours_to_raise;
    self.funding_goal = funding_goal;

    Ok(())
  }

  pub fn fund_trade(funder: Pubkey, amount: usize) -> Result<()> {
    Ok(())
  }
}
