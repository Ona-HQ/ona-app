use crate::errors::TantoError;
use crate::state::trade::*;
use crate::state::global::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint};

pub mod usdc_token {
  #[cfg(feature = "development")]
  anchor_lang::declare_id!("8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN");
  #[cfg(not(feature = "development"))]
  anchor_lang::declare_id!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
}

pub fn create_trade(
  ctx: Context<CreateTrade>,
  title: String, description: String, asset: String, direction: bool,
  chart: String, entry_price: i64, target_price: i64, leverage: u8,
  start_time: i64, hours_to_raise: u8, funding_goal: i64, deposit_mint: Pubkey
) -> Result<()> {
  let trade = &mut ctx.accounts.trade;
  let globals = &mut ctx.accounts.globals;
  globals.last_trade_id += 1;

  require_gt!(leverage, 0);
  require_keys_eq!(trade.deposit_mint, anchor_spl::mint::USDC, TantoError::WrongTokenMint);

  trade.create_trade(
    ctx.accounts.trade_owner.key(),
    title,
    description,
    asset,
    direction,
    chart,
    entry_price.try_into().unwrap(),
    target_price.try_into().unwrap(),
    leverage,
    start_time,
    hours_to_raise,
    funding_goal,
    deposit_mint,
    *ctx.bumps.get("trade").unwrap()
  )
}

// &[globals.last_trade_id.try_into().unwrap()
#[derive(Accounts)]
pub struct CreateTrade<'info> {
  // TODO: make space dynamic
  #[account(init, payer = trade_owner, space = 10000, seeds = [b"new-trade".as_ref(), trade_owner.key().as_ref()], bump)]
  pub trade: Account<'info, Trade>,

  #[account(mut, seeds = [b"globals".as_ref()], bump = globals.bump)]
  pub globals: Account<'info, Global>,

  pub deposit_mint: Account<'info, Mint>,

  #[account(mut)]
  pub trade_owner: Signer<'info>,
  pub system_program: Program<'info, System>
}
