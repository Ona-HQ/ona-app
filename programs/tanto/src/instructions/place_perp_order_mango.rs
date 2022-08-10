use crate::state::trade::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;
use mango::matching::Side;
use mango::matching::OrderType;
use mango::matching::ExpiryType;
use mango::state::MAX_PAIRS;

pub fn place_perp_order2(
  ctx: Context<PlacePerpOrder2>
) -> Result<()> {
  let trade = &mut ctx.accounts.trade;
  let trade_owner = trade.owner.key();
  let id = trade.id.to_be_bytes();
  let seeds = &[
    b"new-trade".as_ref(),
    trade_owner.as_ref(),
    &id.as_ref(),
    &[trade.bump],
  ];

  let max_base_quantity = trade.token_amount();
  let max_quote_quantity = trade.entry_usdc_amount(); // the total amount (in USDC)
  let order_type = OrderType::Limit;
  let expiry_timestamp = Some(0); // Send 0 if you want to ignore time in force
  let limit = 255; // maximum number of FillEvents before terminating

  let mut remaining_accounts_iter = ctx.remaining_accounts.iter();
  let _referral = remaining_accounts_iter.next();
  let mut open_orders = vec![Pubkey::default(); MAX_PAIRS];
  remaining_accounts_iter.for_each(|ai| open_orders.push(*ai.key));

  // Place limit order with the entry price
  invoke_signed(
    &mango::instruction::place_perp_order2(
      &ctx.accounts.mango_program.key(),
      &ctx.accounts.mango_group.key(),
      &ctx.accounts.mango_account.key(),
      &trade.key(),
      &ctx.accounts.mango_cache.key(),
      &ctx.accounts.perp_market.key(),
      &ctx.accounts.bids.key(),
      &ctx.accounts.asks.key(),
      &ctx.accounts.event_queue.key(),
      None,
      open_orders.as_slice(),
      if trade.direction { Side::Bid } else { Side::Ask },
      trade.entry_price,
      max_base_quantity,
      max_quote_quantity,
      trade.id, // client order ID
      order_type,
      false, // no reduce only
      expiry_timestamp,
      limit,
      ExpiryType::Relative,
    ).unwrap(),
    &[
      ctx.accounts.mango_group.to_account_info().clone(),
      ctx.accounts.mango_account.to_account_info().clone(),
      trade.to_account_info().clone(),
      ctx.accounts.mango_cache.to_account_info().clone(),
      ctx.accounts.perp_market.to_account_info().clone(),
      ctx.accounts.bids.to_account_info().clone(),
      ctx.accounts.asks.to_account_info().clone(),
      ctx.accounts.event_queue.to_account_info().clone(),
      ctx.accounts.payer.to_account_info().clone()
    ],
    &[&seeds[..]],
  )?;

  // Place limit order with the target price
  invoke_signed(
    &mango::instruction::place_perp_order2(
      &ctx.accounts.mango_program.key(),
      &ctx.accounts.mango_group.key(),
      &ctx.accounts.mango_account.key(),
      &trade.key(),
      &ctx.accounts.mango_cache.key(),
      &ctx.accounts.perp_market.key(),
      &ctx.accounts.bids.key(),
      &ctx.accounts.asks.key(),
      &ctx.accounts.event_queue.key(),
      None,
      open_orders.as_slice(),
      if trade.direction { Side::Ask } else { Side::Bid }, // use other (inverted) side
      trade.target_price,
      max_base_quantity,
      trade.target_usdc_amount(),
      trade.id + 1, // client order ID
      order_type,
      true, // reduce_only
      expiry_timestamp,
      limit,
      ExpiryType::Relative,
    ).unwrap(),
    &[
      ctx.accounts.mango_group.to_account_info().clone(),
      ctx.accounts.mango_account.to_account_info().clone(),
      trade.to_account_info().clone(),
      ctx.accounts.mango_cache.to_account_info().clone(),
      ctx.accounts.perp_market.to_account_info().clone(),
      ctx.accounts.bids.to_account_info().clone(),
      ctx.accounts.asks.to_account_info().clone(),
      ctx.accounts.event_queue.to_account_info().clone(),
      ctx.accounts.payer.to_account_info().clone()
    ],
    &[&seeds[..]],
  )?;
  trade.initiate_trade()?;

  Ok(())
}

/// To reference OpenOrders, add them to the accounts [0-MAX_PAIRS] of the
/// CpiContext's `remaining_accounts` Vec.
#[derive(Accounts)]
pub struct PlacePerpOrder2<'info> {
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
