use crate::state::trade::*;
use crate::state::global::*;
use anchor_lang::prelude::*;
use anchor_spl::token;
use anchor_spl::token::{Mint, Token, TokenAccount};

// Code from https://github.com/PirosB3/SafePaySolana/blob/master/programs/safe_pay/src/lib.rs
// https://betterprogramming.pub/using-pdas-and-spl-token-in-anchor-and-solana-df05c57ccd04
pub fn fund_trade(
  ctx: Context<FundTrade>, amount: u64
) -> Result<()> {
  let trade = &mut ctx.accounts.trade;

  // TODO: check if trade can still be funded
  // require_gt!(leverage, 0);
  // TODO: make sure token mint is USDC
  // require_keys_eq!(game.current_player(), ctx.accounts.player.key(), TantoError::WrongTokenMint);
  // TODO: record how much amount user deposited on trade PDA

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

// TODO: dynamic space size
#[derive(Accounts)]
pub struct FundTrade<'info> {
  #[account(mut, seeds = [b"new-trade".as_ref(), payer.key().as_ref()], bump = trade.bump)]
  pub trade: Account<'info, Trade>,

  #[account(
    mut,
    associated_token::authority = trade,
    associated_token::mint = trade.deposit_mint,
  )]
  pub vault: Account<'info, TokenAccount>, // wallet to deposit into (escrow vault)

  #[account(
    mut,
    constraint = wallet_to_withdraw_from.owner == payer.key(),
    constraint = wallet_to_withdraw_from.mint == usdc_mint.key()
  )]
  pub wallet_to_withdraw_from: Account<'info, TokenAccount>, // wallet to withdraw from (deposit token)

  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(mut)]
  usdc_mint: Account<'info, Mint>,  // USDC account
  system_program: Program<'info, System>,
  token_program: Program<'info, Token>,

  // #[account(
  //   init_if_needed,
  //   payer = funder,
  //   seeds=[b"wallet".as_ref(), funder.key().as_ref(), usdc_mint.key().as_ref(), trade.id.to_le_bytes().as_ref()],
  //   token::mint=usdc_mint,
  //   token::authority=application_state,
  //   bump,
  // )]
  // escrow_wallet_state: Account<'info, TokenAccount>,
  // rent: Sysvar<'info, Rent>,
}
