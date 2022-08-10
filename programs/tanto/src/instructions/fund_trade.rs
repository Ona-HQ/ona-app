use crate::state::trade::*;
use crate::create_trade::*;
use crate::state::trade_funding::*;
use crate::state::user::*;

use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token;
use anchor_spl::token::{Mint, Token, TokenAccount};
use crate::errors::TantoError;

// Code from https://github.com/PirosB3/SafePaySolana/blob/master/programs/safe_pay/src/lib.rs
// https://betterprogramming.pub/using-pdas-and-spl-token-in-anchor-and-solana-df05c57ccd04
pub fn fund_trade(
  ctx: Context<FundTrade>, amount: u64
) -> Result<()> {
  let trade = &mut ctx.accounts.trade;
  let user_account = &mut ctx.accounts.user_account;
  let trade_funding = &mut ctx.accounts.trade_funding;
  require!(trade.is_funding_allowed(), TantoError::FundingNotAllowed);
  require_keys_eq!(ctx.accounts.usdc_mint.key(), usdc_token::ID, TantoError::WrongTokenMint);

  trade.add_funding(amount)?;
  trade_funding.add_funding(amount)?;
  user_account.add_funded_trade(trade.key())?;

  token::transfer(ctx.accounts.transfer_ctx(), amount)?;  
  Ok(())
}

impl<'info> FundTrade<'info> {
  pub fn transfer_ctx(&self) -> CpiContext<'_, '_, '_, 'info, token::Transfer<'info>> {
    let program = self.token_program.to_account_info();
    let accounts = token::Transfer {
      from: self.wallet_to_withdraw_from.to_account_info(),
      to: self.vault.to_account_info(),
      authority: self.payer.to_account_info(),
    };
    CpiContext::new(program, accounts)
  }
}

#[derive(Accounts)]
pub struct FundTrade<'info> {
  #[account(mut, seeds = [b"new-trade".as_ref(), trade.owner.key().as_ref(), &trade.id.to_be_bytes().as_ref()], bump = trade.bump)]
  pub trade: Box<Account<'info, Trade>>,

  #[account(
    init_if_needed,
    payer = payer,
    space = 129,
    seeds = [b"new-funding".as_ref(), trade.key().as_ref(), payer.key().as_ref()],
    bump
  )]
  pub trade_funding: Box<Account<'info, TradeFunding>>,

  #[account(
    init_if_needed,
    payer = payer,
    associated_token::authority = trade,
    associated_token::mint = usdc_mint,
  )]
  pub vault: Box<Account<'info, TokenAccount>>, // wallet to deposit into (escrow vault)

  // TODO: LOOK AT THIS - CANNOT BE INITIATED ON THE FLY WITH INIT?!!
  #[account(
    mut,
    constraint = wallet_to_withdraw_from.owner == payer.key(),
    constraint = wallet_to_withdraw_from.mint == usdc_mint.key()
  )]
  pub wallet_to_withdraw_from: Account<'info, TokenAccount>, // wallet to withdraw from (deposit token)

  // TODO check if user_account.owner is equal to trade owner
  #[account(mut, seeds = [b"user-account".as_ref(), payer.key().as_ref()], bump = user_account.bump)]
  pub user_account: Box<Account<'info, User>>,

  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(mut)]
  usdc_mint: Account<'info, Mint>,  // USDC account
  associated_token_program: Program<'info, AssociatedToken>,
  system_program: Program<'info, System>,
  token_program: Program<'info, Token>,
  rent: Sysvar<'info, Rent>,
}
