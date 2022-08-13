use crate::errors::OnaError;
use crate::state::trade::*;
use crate::state::user::*;
use crate::state::global::*;
use anchor_lang::prelude::*;

pub mod usdc_token {
  #[cfg(feature = "development")]
  anchor_lang::declare_id!("8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN");
  #[cfg(not(feature = "development"))]
  anchor_lang::declare_id!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
}

pub fn create_trade(
  ctx: Context<CreateTrade>,
  title: String, description: String, asset: String, direction: bool,
  chart: String, chart_image_url: String, entry_price: i64, target_price: i64,
  leverage: u8, start_time: i64, hours_to_raise: u8, funding_goal: u64,
  deposit_mint: Pubkey, perp_market: Pubkey
) -> Result<()> {
  let trade = &mut ctx.accounts.trade;
  let globals = &mut ctx.accounts.globals;
  let user_account = &mut ctx.accounts.user_account;

  require_gt!(leverage, 0);
  // anchor_spl::mint::USDC
  require_keys_eq!(deposit_mint, usdc_token::ID, OnaError::WrongTokenMint);

  trade.create_trade(
    globals.last_trade_id,
    ctx.accounts.trade_owner.key(),
    title,
    description,
    asset,
    direction,
    chart,
    chart_image_url,
    entry_price,
    target_price,
    leverage,
    start_time,
    hours_to_raise,
    funding_goal,
    deposit_mint,
    perp_market,
    *ctx.bumps.get("trade").unwrap()
  )?;
  user_account.add_started_trade(trade.key())?;

  globals.last_trade_id += 1;
  Ok(())
}

#[derive(Accounts)]
pub struct CreateTrade<'info> {
  // TODO: make space dynamic
  #[account(
    init,
    payer = trade_owner,
    space = 1000,
    seeds = [b"new-trade".as_ref(), trade_owner.key().as_ref(), &globals.last_trade_id.to_be_bytes().as_ref()],
    bump
  )]
  pub trade: Account<'info, Trade>,

  #[account(mut, seeds = [b"globals".as_ref()], bump = globals.bump)]
  pub globals: Account<'info, Global>,

  // TODO check if user_account.owner is equal to trade owner
  #[account(mut, seeds = [b"user-account".as_ref(), trade_owner.key().as_ref()], bump = user_account.bump)]
  pub user_account: Box<Account<'info, User>>,

  #[account(mut)]
  pub trade_owner: Signer<'info>,
  pub system_program: Program<'info, System>
}
