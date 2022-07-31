use crate::state::trade::*;
use anchor_lang::prelude::*;

pub fn start_trade(
  ctx: Context<StartTrade>
) -> Result<()> {
  let trade = &mut ctx.accounts.trade;

  // TODO: check if trade can still be funded
  // require_gt!(leverage, 0);

  Ok(())
}

#[derive(Accounts)]
pub struct StartTrade<'info> {
  #[account(mut)]
  pub trade: Account<'info, Trade>,
  #[account(mut)]
  pub trade_owner: Signer<'info>
}
