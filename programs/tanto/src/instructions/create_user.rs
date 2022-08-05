use crate::state::user::*;
use crate::state::global::*;
use anchor_lang::prelude::*;

pub fn create_user(ctx: Context<CreateUser>, twitter: String) -> Result<()> {
  let user_account = &mut ctx.accounts.user_account;
  let globals = &mut ctx.accounts.globals;

  globals.last_user_id += 1;
  user_account.create_user(
    globals.last_user_id.try_into().unwrap(),
    twitter,
    *ctx.bumps.get("user_account").unwrap()
  )
}

#[derive(Accounts)]
pub struct CreateUser<'info> {
  #[account(init, payer = user, space = 10000, seeds = [b"user-account".as_ref(), user.key().as_ref()], bump)] // TODO: make space dynamic
  pub user_account: Account<'info, User>,
  #[account(mut, seeds = [b"globals".as_ref()], bump = globals.bump)]
  pub globals: Account<'info, Global>,
  #[account(mut)]
  pub user: Signer<'info>,
  pub system_program: Program<'info, System>
}
