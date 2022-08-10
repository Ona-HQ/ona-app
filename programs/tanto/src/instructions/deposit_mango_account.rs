use crate::errors::TantoError::WithdrawProhibited;
use crate::state::trade::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;
use anchor_spl::token::{Token,TokenAccount};

pub fn deposit_mango_account(
  ctx: Context<DepositMangoAccount>,
  amount: u64
) -> Result<()> {
  let trade = &mut ctx.accounts.trade;
  let owner = trade.owner.key();
  require_keys_eq!(ctx.accounts.payer.key(), owner, WithdrawProhibited);

  let id = trade.id.to_be_bytes();

  let seeds = &[
    b"new-trade".as_ref(),
    owner.as_ref(),
    &id.as_ref(),    
    &[trade.bump],
  ];

  invoke_signed(
    &mango::instruction::deposit(
      &ctx.accounts.mango_program.key(),
      &ctx.accounts.mango_group.key(),
      &ctx.accounts.mango_account.key(),
      &trade.key(),
      &ctx.accounts.mango_cache.key(),
      &ctx.accounts.root_bank.key(),
      &ctx.accounts.node_bank.key(),
      &ctx.accounts.vault.key(),
      &ctx.accounts.owner_token_account.key(),
      amount
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
      ctx.accounts.token_program.to_account_info().clone(),
    ],
    &[&seeds[..]],
  )?;
  trade.set_state(TradeState::FundingDeposited)?;

  Ok(())
}

#[derive(Accounts)]
pub struct DepositMangoAccount<'info> {
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
  pub vault: AccountInfo<'info>,
  /// CHECK: Mango CPI
  #[account(mut)]
  pub owner_token_account: Account<'info, TokenAccount>,
  pub system_program: Program<'info, System>,
  #[account(mut)]
  pub payer: Signer<'info>,
  pub token_program: Program<'info, Token>,
}
