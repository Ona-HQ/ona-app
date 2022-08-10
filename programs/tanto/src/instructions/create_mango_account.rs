use crate::state::trade::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;

pub mod mango_program_id {
  #[cfg(feature = "development")]
  anchor_lang::declare_id!("4skJ85cdxQAFVKbcGgfun8iZPL7BadVYXG3kGEGkufqA");
  #[cfg(feature = "production")]
  anchor_lang::declare_id!("mv3ekLzLbnVPNxjSKvqBpU3ZeZXPQdEC3bp5MDEBG68");
}

pub fn create_mango_account(
  ctx: Context<CreateMangoAccount>
) -> Result<()> {
  let trade = &mut ctx.accounts.trade;
  let owner = trade.owner.key();
  let id = trade.id.to_be_bytes();
  let mango_account_id = trade.id;
  let seeds = &[
    b"new-trade".as_ref(),
    owner.as_ref(),
    &id.as_ref(),
    &[trade.bump],
  ];
  invoke_signed(
    &mango::instruction::create_mango_account(
      // &mango_program_id::ID,//ctx.accounts.mango_program.key,
      &ctx.accounts.mango_program.key(),
      &ctx.accounts.mango_group.key(),
      &ctx.accounts.mango_account.key(),
      &trade.key(),
      &ctx.accounts.system_program.key(),
      &ctx.accounts.payer.key(),
      mango_account_id,
    ).unwrap(),
    &[
      ctx.accounts.mango_program.to_account_info().clone(),
      ctx.accounts.mango_group.to_account_info().clone(),
      ctx.accounts.mango_account.to_account_info().clone(),
      trade.to_account_info().clone(),
      ctx.accounts.system_program.to_account_info().clone(),
      ctx.accounts.payer.to_account_info().clone(),
    ],
    &[&seeds[..]],
  )?;

  trade.set_state(TradeState::Funding)?;
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
  #[account(mut, seeds = [b"new-trade".as_ref(), trade.owner.key().as_ref(), &trade.id.to_be_bytes().as_ref()], bump = trade.bump)]
  pub trade: Account<'info, Trade>,
  pub system_program: Program<'info, System>,
  #[account(mut)]
  pub payer: Signer<'info>,
}
