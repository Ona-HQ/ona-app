use crate::state::trade::*;
use crate::errors::OnaError;
use crate::create_trade::*;
use crate::state::trade_funding::*;

use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Mint, Token, TokenAccount};

pub fn withdraw_funds(
  ctx: Context<WithdrawFunds>
) -> Result<()> {
  let trade = &mut ctx.accounts.trade;
  let now = Clock::get().unwrap().unix_timestamp;
  let diff = now - trade.created_at;
  // withdrawal can happen when either 2 weeks without a trade have passed, or if the trade is over
  require!(
    trade.state == TradeState::FinishedTrade ||
    trade.state == TradeState::WithdrawnFunds ||
    diff >= 1153384,
    OnaError::WithdrawProhibited
  );
  require_keys_eq!(ctx.accounts.usdc_mint.key(), usdc_token::ID, OnaError::WrongTokenMint);
  require!(ctx.accounts.trade_funding.has_funded, OnaError::WithdrawProhibited);
  let mut number_of_tokens = 0;

  if diff >= 1153384
    && trade.state != TradeState::InitiatedTrade
    && trade.state != TradeState::FinishedTrade
  {
    trade.set_state(TradeState::CancelledTrade)?;
    number_of_tokens = ctx.accounts.trade_funding.amount;
  } else if trade.state == TradeState::WithdrawnFunds { // funds are back from the Mango account
    let trade_funding = &ctx.accounts.trade_funding;
    let vault = &ctx.accounts.vault;
    number_of_tokens = trade.calculate_withdrawal_funds(trade_funding.amount, vault.amount);
  }

  if number_of_tokens > 0 {
    let owner = trade.owner.key();
    let id = trade.id.to_be_bytes();
    let seeds = &[
      b"new-trade".as_ref(),
      owner.as_ref(),
      &id.as_ref(),
      &[trade.bump],
    ];
    anchor_spl::token::transfer(
      CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        anchor_spl::token::Transfer {
          from: ctx.accounts.vault.to_account_info(),
          to: ctx.accounts.sender_wallet.to_account_info(),
          authority: ctx.accounts.trade.to_account_info(),
        },
        &[&seeds[..]],
      ),
      number_of_tokens,
    )?;
  }

  {
    let trade_funding = &mut ctx.accounts.trade_funding;
    trade_funding.withdraw_funds()?;
  }

  Ok(())
}

#[derive(Accounts)]
pub struct WithdrawFunds<'info> {
  #[account(mut, seeds = [b"new-trade".as_ref(), trade.owner.key().as_ref(), &trade.id.to_be_bytes().as_ref()], bump = trade.bump)]
  pub trade: Account<'info, Trade>,

  #[account(
    mut,
    associated_token::authority = trade,
    associated_token::mint = usdc_mint,
  )]
  pub vault: Account<'info, TokenAccount>, // escrow vault to withdraw from

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
