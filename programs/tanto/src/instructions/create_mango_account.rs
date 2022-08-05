use crate::state::trade::*;
use crate::state::global::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;
use crate::errors::TantoError;

pub mod mango_program_id {
  #[cfg(feature = "development")]
  anchor_lang::declare_id!("4skJ85cdxQAFVKbcGgfun8iZPL7BadVYXG3kGEGkufqA");
  #[cfg(feature = "production")]
  anchor_lang::declare_id!("mv3ekLzLbnVPNxjSKvqBpU3ZeZXPQdEC3bp5MDEBG68");
}

pub fn create_mango_account(
  ctx: Context<CreateMangoAccount>
) -> Result<()> {
  let payer = ctx.accounts.payer.key();
  let seeds = &[
    b"new-trade".as_ref(),
    payer.as_ref(),
    &[ctx.accounts.trade.bump],
  ];
  invoke_signed(
    &mango::instruction::create_mango_account(
      // &mango_program_id::ID,//ctx.accounts.mango_program.key,
      &ctx.accounts.mango_program.key(),
      &ctx.accounts.mango_group.key(),
      &ctx.accounts.mango_account.key(),
      &ctx.accounts.trade.key(),
      &ctx.accounts.system_program.key(),
      &ctx.accounts.payer.key(),
      1 // TODO: make dynamic
    ).unwrap(),
    &[
      ctx.accounts.mango_program.to_account_info().clone(),
      ctx.accounts.mango_group.to_account_info().clone(),
      ctx.accounts.mango_account.to_account_info().clone(),
      ctx.accounts.trade.to_account_info().clone(),
      ctx.accounts.system_program.to_account_info().clone(),
      ctx.accounts.payer.to_account_info().clone(),
    ],
    &[&seeds[..]],
  )?;

  Ok(())
}

#[derive(Accounts)]
pub struct CreateMangoAccount<'info> {
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
  pub system_program: Program<'info, System>,
  #[account(mut)]
  pub payer: Signer<'info>,
}
