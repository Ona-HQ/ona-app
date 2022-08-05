use crate::errors::TantoError;
use anchor_lang::prelude::*;
use num_derive::*;
use num_traits::*;

#[account]
pub struct Trade {
  pub id: i64,
  owner: Pubkey,
  pub title: String,
  description: String,
  asset: String,
  direction: bool, // true is long, false is short
  chart: String, // TradingView URL
  entry_price: i64,
  target_price: i64,
  leverage: u8,
  start_time: i64, // Unix Timestamp
  hours_to_raise: u8,
  funding_goal: i64,
  fundings: Vec<Funding>,
  trade_status: TradeStatus,
  pub deposit_mint: Pubkey,
  pub bump: u8
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Funding {
  amount: i64,
  user: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum TradeStatus {
  AwaitingMangoAccount,
  Raising,
  InitiatedTrade,
  FinishedTrade,
  CancelledTrade
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
    owner: Pubkey, title: String, description: String, asset: String, direction: bool,
    chart: String, entry_price: i64, target_price: i64, leverage: u8, start_time: i64,
    hours_to_raise: u8, funding_goal: i64, deposit_mint: Pubkey, bump: u8
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
    self.trade_status = TradeStatus::AwaitingMangoAccount;
    self.deposit_mint = deposit_mint;
    self.bump = bump;

    Ok(())
  }

  pub fn fund_trade(funder: Pubkey, amount: i64) -> Result<()> {
    Ok(())
  }
}
