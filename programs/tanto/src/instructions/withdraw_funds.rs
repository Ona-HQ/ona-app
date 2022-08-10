use crate::state::trade::*;
use crate::errors::TantoError;
use crate::create_trade::*;
use crate::state::trade_funding::*;

use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token;
use anchor_spl::token::{Mint, Token, TokenAccount};

pub fn withdraw_funds(
  ctx: Context<WithdrawFunds>
) -> Result<()> {
  let trade = &mut ctx.accounts.trade;
  let now = Clock::get().unwrap().unix_timestamp;
  let diff = now - trade.created_at;
  // withdrawal can happen when either 4 weeks without a trade have passed, or if the trade is over
  require!(trade.state == TradeState::FinishedTrade || diff >= 2306768, TantoError::WithdrawProhibited);
  require_keys_eq!(ctx.accounts.usdc_mint.key(), usdc_token::ID, TantoError::WrongTokenMint);

  if diff >= 2306768
    && trade.state != TradeState::InitiatedTrade
    && trade.state != TradeState::FinishedTrade
  {
    trade.set_state(TradeState::CancelledTrade)?;
    let funding_amount = ctx.accounts.trade_funding.amount;
    token::transfer(ctx.accounts.transfer_ctx(), funding_amount)?;
    {
      let trade_funding = &mut ctx.accounts.trade_funding;
      trade_funding.withdraw_funds()?;
    }
  } else if trade.state == TradeState::FinishedTrade {
    let percentage = ctx.accounts.trade_funding.amount / trade.total_funding;
    let number_of_tokens = percentage * ctx.accounts.vault.amount;
    token::transfer(ctx.accounts.transfer_ctx(), number_of_tokens)?;
    {
      let trade_funding = &mut ctx.accounts.trade_funding;
      trade_funding.withdraw_funds()?;
    }
  }

  Ok(())
}

impl<'info> WithdrawFunds<'info> {
  pub fn transfer_ctx(&self) -> CpiContext<'_, '_, '_, 'info, token::Transfer<'info>> {
    let program = self.token_program.to_account_info();
    let accounts = token::Transfer {
      from: self.vault.to_account_info(),
      to: self.sender_wallet.to_account_info(),
      authority: self.trade.to_account_info(),
    };
    CpiContext::new(program, accounts)
  }
}

// TODO: dynamic space size
#[derive(Accounts)]
pub struct WithdrawFunds<'info> {
  #[account(mut, seeds = [b"new-trade".as_ref(), payer.key().as_ref()], bump = trade.bump)]
  pub trade: Account<'info, Trade>,

  #[account(
    mut,
    associated_token::authority = trade,
    associated_token::mint = usdc_mint,
  )]
  pub vault: Account<'info, TokenAccount>, // escrow vault to withdraw from

  // TODO: LOOK AT THIS - CANNOT BE INITIATED ON THE FLY WITH INIT?!!
  #[account(
    mut,
    constraint = sender_wallet.owner == payer.key(),
    constraint = sender_wallet.mint == usdc_mint.key()
  )]
  pub sender_wallet: Account<'info, TokenAccount>, // wallet to send back to

  #[account(
    mut,
    seeds = [b"new-funding".as_ref(), trade.key().as_ref(), payer.key().as_ref()],
    bump
  )]
  pub trade_funding: Box<Account<'info, TradeFunding>>,

  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(mut)]
  usdc_mint: Account<'info, Mint>,  // USDC account
  associated_token_program: Program<'info, AssociatedToken>,
  system_program: Program<'info, System>,
  token_program: Program<'info, Token>,
  rent: Sysvar<'info, Rent>,
}
