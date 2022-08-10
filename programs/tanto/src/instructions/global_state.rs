use crate::state::global::*;
use anchor_lang::prelude::*;

pub fn find_or_create_globals(ctx: Context<GlobalState>) -> Result<()> {
  let globals = &mut ctx.accounts.globals;

  globals.find_or_create_globals(ctx.accounts.payer.key(), *ctx.bumps.get("globals").unwrap())
}

#[derive(Accounts)]
pub struct GlobalState<'info> {
  #[account(init_if_needed, payer = payer, seeds = [b"globals".as_ref()], bump, space = 64)]
  pub globals: Account<'info, Global>,
  #[account(mut)]
  pub payer: Signer<'info>,
  pub system_program: Program<'info, System>,
}
