use crate::state::trade::*;
use crate::state::global::*;
use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::{CloseAccount, Mint, Token, TokenAccount, Transfer}};

// Code from https://github.com/PirosB3/SafePaySolana/blob/master/programs/safe_pay/src/lib.rs
// https://betterprogramming.pub/using-pdas-and-spl-token-in-anchor-and-solana-df05c57ccd04
pub fn fund_trade(
  ctx: Context<FundTrade>
) -> Result<()> {
  let trade = &mut ctx.accounts.trade;

  // TODO: check if trade can still be funded
  // require_gt!(leverage, 0);
  // TODO: make sure token mint is USDC
  // require_keys_eq!(game.current_player(), ctx.accounts.player.key(), TantoError::WrongTokenMint);

  Ok(())
}

// TODO: dynamic space size
#[derive(Accounts)]
#[instruction(application_idx: u64, state_bump: u8, wallet_bump: u8)]
pub struct FundTrade<'info> {
  #[account(mut)]
  pub trade: Account<'info, Trade>,
  #[account(mut)]
  pub funder: Signer<'info>,
  #[account(
    init,
    space = 10000,
    payer = funder,
    seeds=[b"state".as_ref(), funder.key().as_ref(), usdc_mint.key().as_ref(), application_idx.to_le_bytes().as_ref()],
    bump,
  )]
  application_state: Account<'info, Global>,
  #[account(
    init_if_needed,
    payer = funder,
    seeds=[b"wallet".as_ref(), funder.key().as_ref(), usdc_mint.key().as_ref(), trade.id.to_le_bytes().as_ref()],
    token::mint=usdc_mint,
    token::authority=application_state,
    bump,
  )]
  escrow_wallet_state: Account<'info, TokenAccount>,
  usdc_mint: Account<'info, Mint>,  // USDC account
  // Funder's USDC wallet that has already approved the escrow wallet
  #[account(
    mut,
    constraint=wallet_to_withdraw_from.owner == funder.key(),
    constraint=wallet_to_withdraw_from.mint == usdc_mint.key()
  )]
  wallet_to_withdraw_from: Account<'info, TokenAccount>,
  system_program: Program<'info, System>,
  token_program: Program<'info, Token>,
  rent: Sysvar<'info, Rent>,
}
