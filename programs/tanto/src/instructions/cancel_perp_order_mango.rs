use crate::state::trade::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;

pub fn cancel_perp_order(
  ctx: Context<CancelPerpOrder>
) -> Result<()> {
  let trade = &ctx.accounts.trade;
  let owner = trade.owner.key();
  let id = trade.id.to_be_bytes();
  let seeds = &[
    b"new-trade".as_ref(),
    owner.as_ref(),
    &id.as_ref(),
    &[trade.bump],
  ];

  invoke_signed(
    &mango::instruction::cancel_all_perp_orders(
      &ctx.accounts.mango_program.key(),
      &ctx.accounts.mango_group.key(),
      &ctx.accounts.mango_account.key(),
      &trade.key(),
      &ctx.accounts.perp_market.key(),
      &ctx.accounts.bids.key(),
      &ctx.accounts.asks.key(),
      255
    ).unwrap(),
    &[
      ctx.accounts.mango_group.to_account_info().clone(),
      ctx.accounts.mango_account.to_account_info().clone(),
      trade.to_account_info().clone(),
      ctx.accounts.perp_market.to_account_info().clone(),
      ctx.accounts.bids.to_account_info().clone(),
      ctx.accounts.asks.to_account_info().clone(),
      ctx.accounts.payer.to_account_info().clone()
    ],
    &[&seeds[..]],
  )?;

  // Just cancel all perp orders for the Mango account instead of 1 by 1
  // invoke_signed(
  //   &mango::instruction::cancel_perp_order_by_client_id(
  //     &ctx.accounts.mango_program.key(),
  //     &ctx.accounts.mango_group.key(),
  //     &ctx.accounts.mango_account.key(),
  //     &trade.key(),
  //     &ctx.accounts.perp_market.key(),
  //     &ctx.accounts.bids.key(),
  //     &ctx.accounts.asks.key(),
  //     trade.id,
  //     false
  //   ).unwrap(),
  //   &[
  //     ctx.accounts.mango_group.to_account_info().clone(),
  //     ctx.accounts.mango_account.to_account_info().clone(),
  //     trade.to_account_info().clone(),
  //     ctx.accounts.perp_market.to_account_info().clone(),
  //     ctx.accounts.bids.to_account_info().clone(),
  //     ctx.accounts.asks.to_account_info().clone(),
  //     ctx.accounts.payer.to_account_info().clone()
  //   ],
  //   &[&seeds[..]],
  // )?;

  Ok(())
}

#[derive(Accounts)]
pub struct CancelPerpOrder<'info> {
  /// CHECK: checked in mango program
  pub mango_program: UncheckedAccount<'info>,
  /// CHECK: Mango CPI
  pub mango_group: UncheckedAccount<'info>,
  /// CHECK: Mango CPI
  #[account(mut)]
  pub mango_account: UncheckedAccount<'info>,
  #[account(mut, seeds = [b"new-trade".as_ref(), trade.owner.key().as_ref(), &trade.id.to_be_bytes().as_ref()], bump = trade.bump)]
  pub trade: Account<'info, Trade>,
  /// CHECK: Mango CPI
  #[account(mut)]
  pub perp_market: UncheckedAccount<'info>,
  /// CHECK: Mango CPI
  #[account(mut)]
  pub bids: UncheckedAccount<'info>,
  /// CHECK: Mango CPI
  #[account(mut)]
  pub asks: UncheckedAccount<'info>,
  pub system_program: Program<'info, System>,
  #[account(mut)]
  pub payer: Signer<'info>,
}
