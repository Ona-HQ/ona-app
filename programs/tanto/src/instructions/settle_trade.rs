use crate::state::trade::*;
use anchor_lang::prelude::*;

pub fn settle_trade(
  _ctx: Context<SettleTrade>,
  _percentage: u8
) -> Result<()> {
  // TODO: Settle PnL/Fees on Mango
  Ok(())
}

/// To reference OpenOrders, add them to the accounts [0-MAX_PAIRS] of the
/// CpiContext's `remaining_accounts` Vec.
#[derive(Accounts)]
pub struct SettleTrade<'info> {
  /// CHECK: checked in mango program
  pub mango_program: UncheckedAccount<'info>,
  /// CHECK: Mango CPI
  pub mango_group: UncheckedAccount<'info>,
  /// CHECK: Mango CPI
  #[account(mut)]
  pub mango_account: UncheckedAccount<'info>,
  #[account(mut, seeds = [b"new-trade".as_ref(), trade.owner.key().as_ref()], bump = trade.bump)]
  pub trade: Account<'info, Trade>,
  /// CHECK: Mango CPI
  pub mango_cache: AccountInfo<'info>,
  /// CHECK: Mango CPI
  #[account(mut)]
  pub perp_market: UncheckedAccount<'info>,
  /// CHECK: Mango CPI
  #[account(mut)]
  pub bids: UncheckedAccount<'info>,
  /// CHECK: Mango CPI
  #[account(mut)]
  pub asks: UncheckedAccount<'info>,
  /// CHECK: Mango CPI
  #[account(mut)]
  pub event_queue: UncheckedAccount<'info>,
  pub system_program: Program<'info, System>,
  #[account(mut)]
  pub payer: Signer<'info>,
}
