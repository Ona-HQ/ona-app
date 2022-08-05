use crate::state::trade::*;
use crate::state::global::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;

pub fn deposit_mango_account(
  ctx: Context<DepositMangoAccount>
) -> Result<()> {
  let payer = ctx.accounts.payer.key();
  let seeds = &[
    b"new-trade".as_ref(),
    payer.as_ref(),
    &[ctx.accounts.trade.bump],
  ];

  // TODO
  // invoke_signed(
  //   &mango::instruction::create_mango_account(
  //     // &mango_program_id::ID,//ctx.accounts.mango_program.key,
  //     &ctx.accounts.mango_program.key(),
  //     &ctx.accounts.mango_group.key(),
  //     &ctx.accounts.mango_account.key(),
  //     &ctx.accounts.trade.key(),
  //     &ctx.accounts.system_program.key(),
  //     &ctx.accounts.payer.key(),
  //     1 // TODO: make dynamic
  //   ).unwrap(),
  //   &[
  //     ctx.accounts.mango_program.to_account_info().clone(),
  //     ctx.accounts.mango_group.to_account_info().clone(),
  //     ctx.accounts.mango_account.to_account_info().clone(),
  //     ctx.accounts.trade.to_account_info().clone(),
  //     ctx.accounts.system_program.to_account_info().clone(),
  //     ctx.accounts.payer.to_account_info().clone(),
  //   ],
  //   &[&seeds[..]],
  // )?;

  Ok(())
}

#[derive(Accounts)]
pub struct DepositMangoAccount<'info> {
  ///CHECK: checked in mango program
  pub mango_program: UncheckedAccount<'info>,
  /// CHECK: Mango CPI
  #[account(mut)]
  pub mango_group: UncheckedAccount<'info>,
  /// CHECK: Mango CPI
  #[account(mut)]
  pub mango_account: UncheckedAccount<'info>,
  #[account(mut, seeds = [b"new-trade".as_ref(), payer.key().as_ref()], bump = trade.bump)]
  pub trade: Account<'info, Trade>,

  /// CHECK: Mango CPI
  pub mango_cache: AccountInfo<'info>,
  /// CHECK: Mango CPI
  pub root_bank: AccountInfo<'info>,
  /// CHECK: Mango CPI
  pub node_bank: AccountInfo<'info>,
  /// CHECK: Mango CPI
  pub vault: AccountInfo<'info>,
  /// CHECK: Mango CPI
  pub owner_token_account: AccountInfo<'info>,
  pub system_program: Program<'info, System>,
  #[account(mut)]
  pub payer: Signer<'info>,
}
