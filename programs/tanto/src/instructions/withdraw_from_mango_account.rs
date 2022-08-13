use crate::errors::OnaError;
use crate::state::trade::*;
use crate::state::user::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;
use anchor_spl::token::{Token,TokenAccount};
use mango::state::MAX_PAIRS;

pub fn withdraw_from_mango_account(
  ctx: Context<WithdrawFromMangoAccount>,
  amount: u64
) -> Result<()> {
  let user = &mut ctx.accounts.user_account;
  let trade = &mut ctx.accounts.trade;
  let owner = trade.owner.key();
  let now = Clock::get().unwrap().unix_timestamp;
  let diff = now - trade.created_at;
  let time_past = diff >= 2306768;
  // TODO: enforce this. require_keys_eq!(ctx.accounts.owner_token_account.authority, owner, OnaError::WithdrawProhibited);
  // 4 weeks past and anyone can withdraw as well
  require!(
    trade.state == TradeState::InitiatedTrade ||
    trade.state == TradeState::FinishedTrade ||
    trade.state == TradeState::CancelledTrade || time_past,
    OnaError::WithdrawProhibited
  );

  let remaining_accounts_iter = ctx.remaining_accounts.iter();
  let mut open_orders = vec![Pubkey::default(); MAX_PAIRS];
  remaining_accounts_iter.for_each(|ai| open_orders.push(*ai.key));

  let id = trade.id.to_be_bytes();
  let seeds = &[
    b"new-trade".as_ref(),
    owner.as_ref(),
    &id.as_ref(),    
    &[trade.bump],
  ];

  invoke_signed(
    &mango::instruction::withdraw(
      &ctx.accounts.mango_program.key(),
      &ctx.accounts.mango_group.key(),
      &ctx.accounts.mango_account.key(),
      &trade.key(),
      &ctx.accounts.mango_cache.key(),
      &ctx.accounts.root_bank.key(),
      &ctx.accounts.node_bank.key(),
      &ctx.accounts.vault.key(),
      &ctx.accounts.owner_token_account.key(),
      &ctx.accounts.signer.key(),
      open_orders.as_slice(),
      amount,
      false // no borrow
    ).unwrap(),
    &[
      ctx.accounts.mango_program.to_account_info().clone(),
      ctx.accounts.mango_group.to_account_info().clone(),
      ctx.accounts.mango_account.to_account_info().clone(),
      trade.to_account_info().clone(),
      ctx.accounts.mango_cache.to_account_info().clone(),
      ctx.accounts.root_bank.to_account_info().clone(),
      ctx.accounts.node_bank.to_account_info().clone(),
      ctx.accounts.vault.to_account_info().clone(),
      ctx.accounts.owner_token_account.to_account_info().clone(),
      ctx.accounts.system_program.to_account_info().clone(),
      ctx.accounts.signer.to_account_info().clone(),
    ],
    &[&seeds[..]],
  )?;
  trade.set_state(TradeState::WithdrawnFunds)?;
  user.update_success_rate(ctx.accounts.vault.amount > trade.total_funding)?;

  Ok(())
}

#[derive(Accounts)]
pub struct WithdrawFromMangoAccount<'info> {
    /// CHECK: checked in mango program
  pub mango_program: UncheckedAccount<'info>,
  /// CHECK: Mango CPI
  #[account(mut)]
  pub mango_group: UncheckedAccount<'info>,
  /// CHECK: Mango CPI
  #[account(mut)]
  pub mango_account: UncheckedAccount<'info>,
  #[account(mut, seeds = [b"new-trade".as_ref(), trade.owner.key().as_ref(), &trade.id.to_be_bytes().as_ref()], bump = trade.bump)]
  pub trade: Account<'info, Trade>,

  /// CHECK: Mango CPI
  #[account(mut)]
  pub mango_cache: AccountInfo<'info>,
  /// CHECK: Mango CPI
  #[account(mut)]
  pub root_bank: AccountInfo<'info>,
  /// CHECK: Mango CPI
  #[account(mut)]
  pub node_bank: AccountInfo<'info>,
  /// CHECK: Mango CPI
  #[account(mut)]
  pub vault: Account<'info, TokenAccount>,
  /// CHECK: Mango CPI
  #[account(mut)]
  pub signer: AccountInfo<'info>,
  /// CHECK: Mango CPI
  #[account(mut)]
  pub owner_token_account: Account<'info, TokenAccount>,
  pub system_program: Program<'info, System>,
  #[account(mut)]
  pub payer: Signer<'info>,
  #[account(mut, seeds = [b"user-account".as_ref(), payer.key().as_ref()], bump = user_account.bump)]
  pub user_account: Box<Account<'info, User>>,
  pub token_program: Program<'info, Token>,
}
