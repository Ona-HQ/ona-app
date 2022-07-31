use crate::state::trade::*;
use anchor_lang::prelude::*;

pub fn fund_trade(
  ctx: Context<FundTrade>
) -> Result<()> {
  let trade = &mut ctx.accounts.trade;

  // TODO: check if trade can still be funded
  // require_gt!(leverage, 0);

  Ok(())
}

#[derive(Accounts)]
pub struct FundTrade<'info> {
  #[account(mut)]
  pub trade: Account<'info, Trade>,
  #[account(mut)]
  pub funder: Signer<'info>
}
