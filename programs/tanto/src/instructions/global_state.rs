use crate::state::global::*;
use anchor_lang::prelude::*;

pub fn find_or_create_globals(ctx: Context<GlobalState>) -> Result<()> {
  let global = &mut ctx.accounts.global;
  global.find_or_create_globals();

  Ok(())  
}

#[derive(Accounts)]
pub struct GlobalState<'info> {
  #[account(init_if_needed, payer = payer, seeds = [b"globals"], bump, space = 10000)] // TODO: make space dynamic
  pub global: Account<'info, Global>,
  #[account(mut)]
  pub payer: Signer<'info>,
  pub system_program: Program<'info, System>,
}
