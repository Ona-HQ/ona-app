use anchor_lang::prelude::*;
use instructions::*;
use state::trade::Asset;

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
    chart: String, entry_price: i64, target_price: i64, leverage: u8,
    start_time: i64, hours_to_raise: u8, funding_goal: i64, deposit_mint: Pubkey
  ) -> Result<()> {
    instructions::create_trade::create_trade(
      ctx, title, description, asset, direction,
      chart, entry_price.try_into().unwrap(), target_price.try_into().unwrap(), leverage,
      start_time, hours_to_raise, funding_goal, deposit_mint
    )
  }

  pub fn create_mango_account(ctx: Context<CreateMangoAccount>) -> Result<()> {
    instructions::create_mango_account::create_mango_account(ctx)
  }

  pub fn create_user(
    ctx: Context<CreateUser>,
    twitter: String
  ) -> Result<()> {
    instructions::create_user::create_user(ctx, twitter)
  }

  pub fn fund_trade(
    ctx: Context<FundTrade>,
    amount: u64
  ) -> Result<()> {
    instructions::fund_trade::fund_trade(
      ctx, amount
    )
  }

  // TODO: integrate with Mango Markets to start the trade
  // Needs to be flexible enough so that the trade can be invested partially
  pub fn start_trade(
    ctx: Context<StartTrade>
  ) -> Result<()> {
    Ok(())
  }
}
