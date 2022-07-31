use anchor_lang::prelude::*;
use instructions::*;
use state::trade::Asset;

pub mod errors;
pub mod instructions;
pub mod state;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod tanto {
  use super::*;

  pub fn create_trade(
    ctx: Context<CreateTrade>,
    title: String, description: String, asset: Asset, direction: bool,
    chart: String, entry_price: usize, target_price: usize, leverage: u8,
    start_time: i64, hours_to_raise: u8, funding_goal: usize
  ) -> Result<()> {
    instructions::create_trade::create_trade(
      ctx, title, description, asset, direction,
      chart, entry_price, target_price, leverage,
      start_time, hours_to_raise, funding_goal
    )
  }

  pub fn create_user(
    ctx: Context<CreateUser>,
    twitter: String
  ) -> Result<()> {
    instructions::create_user::create_user(ctx, twitter)
  }
}
