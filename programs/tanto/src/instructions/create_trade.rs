use crate::state::trade::*;
use anchor_lang::prelude::*;

pub fn create_trade(
  ctx: Context<CreateTrade>,
  title: String, description: String, asset: Asset, direction: bool,
  chart: String, entry_price: usize, target_price: usize, leverage: u8,
  start_time: i64, hours_to_raise: u8
) -> Result<()> {
  let trade = &mut ctx.accounts.trade;

  require_gt!(leverage, 0);

  trade.create_trade(
    ctx.accounts.trade_owner.key(),
    title,
    description,
    asset,
    direction,
    chart,
    entry_price,
    target_price,
    leverage,
    start_time,
    hours_to_raise
  )
}

#[derive(Accounts)]
pub struct CreateTrade<'info> {
  #[account(init, payer = trade_owner, space = 10000)] // TODO: make space dynamic
  pub trade: Account<'info, Trade>,
  #[account(mut)]
  pub trade_owner: Signer<'info>,
  pub system_program: Program<'info, System>
}
