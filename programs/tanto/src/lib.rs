use anchor_lang::prelude::*;
use instructions::*;

pub mod errors;
pub mod instructions;
pub mod state;

declare_id!("68i2xmU7bZUjXLzkjXrmXc1SgmjHX2jKKKCGKrTB6aAE");

#[program]
pub mod tanto {
  use super::*;

  pub fn create_globals(ctx: Context<GlobalState>) -> Result<()> {
    instructions::global_state::find_or_create_globals(ctx)
  }

  pub fn create_trade(
    ctx: Context<CreateTrade>,
    title: String, description: String, asset: String, direction: bool,
    chart: String, chart_image_url: String, entry_price: i64, target_price: i64, leverage: u8,
    start_time: i64, hours_to_raise: u8, funding_goal: u64, deposit_mint: Pubkey,
    perp_market: Pubkey
  ) -> Result<()> {
    instructions::create_trade::create_trade(
      ctx, title, description, asset, direction, chart, chart_image_url,
      entry_price.try_into().unwrap(), target_price.try_into().unwrap(), leverage,
      start_time, hours_to_raise, funding_goal, deposit_mint, perp_market
    )
  }

  // Create a Mango account for the trade
  pub fn create_mango_account(ctx: Context<CreateMangoAccount>) -> Result<()> {
    instructions::create_mango_account::create_mango_account(ctx)
  }

  // Deposit funds from the vault (pool) into the Mango account to initiate a trade
  pub fn deposit_mango_account(ctx: Context<DepositMangoAccount>, amount: u64) -> Result<()> {
    instructions::deposit_mango_account::deposit_mango_account(ctx, amount)
  }

  pub fn withdraw_from_mango_account(ctx: Context<WithdrawFromMangoAccount>, amount: u64) -> Result<()> {
    instructions::withdraw_from_mango_account::withdraw_from_mango_account(ctx, amount)
  }

  // Place a perp order on the Mango account and perp market
  pub fn place_perp_order2(ctx: Context<PlacePerpOrder2>) -> Result<()> {
    instructions::place_perp_order_mango::place_perp_order2(ctx)
  }

  // Cancel the trade on the Mango side
  pub fn cancel_perp_order(ctx: Context<CancelPerpOrder>) -> Result<()> {
    instructions::cancel_perp_order_mango::cancel_perp_order(ctx)
  }

  // When the user does not initiate a trade within 4 weeks after funding window
  // The funding deposits are unlocked for withdrawal
  // Or when the trade is finished (success or failure), users can also withdraw
  // Gets his notional deposit back (pro-rata share of what was deposited)
  pub fn withdraw_funds(ctx: Context<WithdrawFunds>) -> Result<()> {
    instructions::withdraw_funds::withdraw_funds(ctx)
  }

  // Allows trade owner to close the trade
  // Settle fees and PnL, and execute a reduce only order
  pub fn settle_trade(ctx: Context<SettleTrade>) -> Result<()> {
    instructions::settle_trade::settle_trade(ctx, 100)
  }

  // Create a user account that keeps Twitter username, funded and created trades
  pub fn create_user(
    ctx: Context<CreateUser>,
    twitter: String
  ) -> Result<()> {
    instructions::create_user::create_user(ctx, twitter)
  }

  // Fund a trade (in USDC)
  pub fn fund_trade(
    ctx: Context<FundTrade>,
    amount: u64
  ) -> Result<()> {
    instructions::fund_trade::fund_trade(
      ctx, amount
    )
  }
}
