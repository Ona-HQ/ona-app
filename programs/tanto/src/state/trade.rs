use anchor_lang::prelude::*;

#[account]
pub struct Trade {
  pub id: u64,
  pub owner: Pubkey,
  pub title: String,
  description: String,
  asset: String,
  pub direction: bool, // true is long, false is short
  chart: String, // TradingView URL
  chart_image_url: String,
  pub entry_price: i64,
  pub target_price: i64,
  pub leverage: u8,
  start_time: i64, // Unix Timestamp
  hours_to_raise: u8,
  funding_goal: u64,
  pub state: TradeState,
  pub total_funding: u64,
  pub created_at: i64,
  pub deposit_mint: Pubkey,
  pub perp_market: Pubkey,
  pub bump: u8
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum TradeState {
  AwaitingMangoAccount,
  Funding,
  FundingComplete,
  FundingDeposited,
  InitiatedTrade,
  FinishedTrade,
  WithdrawnFunds,
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
    id: u64, owner: Pubkey, title: String, description: String, asset: String, direction: bool,
    chart: String, chart_image_url: String, entry_price: i64, target_price: i64, leverage: u8, start_time: i64,
    hours_to_raise: u8, funding_goal: u64, deposit_mint: Pubkey, perp_market: Pubkey, bump: u8
  ) -> Result<()> {
    self.id = id;
    self.owner = owner;
    self.title = title;
    self.description = description;
    self.asset = asset;
    self.direction = direction;
    self.chart = chart;
    self.chart_image_url = chart_image_url;
    self.entry_price = entry_price;
    self.target_price = target_price;
    self.leverage = leverage;
    self.start_time = start_time;
    self.hours_to_raise = hours_to_raise;
    self.funding_goal = funding_goal;
    self.total_funding = 0;
    self.created_at = Clock::get().unwrap().unix_timestamp;
    self.state = TradeState::AwaitingMangoAccount;
    self.deposit_mint = deposit_mint;
    self.perp_market = perp_market;
    self.bump = bump;

    Ok(())
  }

  pub fn is_funding_allowed(&self) -> bool {
    self.state == TradeState::Funding
  }

  pub fn calculate_mango_entry_price(&self) -> i64 {
    // we save the price with 6 decimals
    // e.g. $38 is saved as 38,000,000
    // mango markets expects 2 decimals
    return self.entry_price / 10000;
  }

  pub fn calculate_mango_entry_lots(&self) -> i64 {
    // 100 equals one lot, usually
    // lots * entry price = total funding
    return self.leverage as i64 * (self.total_funding as i64 / 10000 as i64) / (self.entry_price / 1000000);
  }

  pub fn token_amount(&self) -> i64 {
    if self.leverage > 1 {
      return self.leverage as i64 * self.total_funding as i64 / self.entry_price
    } else {
      return self.total_funding as i64 / self.entry_price
    }
  }

  pub fn entry_usdc_amount(&self) -> i64 {
    return self.token_amount() * self.entry_price as i64
  }

  pub fn target_usdc_amount(&self) -> i64 {
    return self.token_amount() * self.target_price as i64
  }

  pub fn add_funding(&mut self, amount: u64) -> Result<()> {
    self.total_funding += amount;
    if self.total_funding >= self.funding_goal {
      self.state = TradeState::FundingComplete;
    }
    Ok(())
  }

  pub fn set_state(&mut self, state: TradeState) -> Result<()> {
    self.state = state;
    Ok(())
  }

  pub fn initiate_trade(&mut self) -> Result<()> {
    self.state = TradeState::InitiatedTrade;

    Ok(())
  }
}
