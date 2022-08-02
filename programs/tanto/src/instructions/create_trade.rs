use crate::state::trade::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::instruction::Instruction;
use anchor_lang::solana_program::program::invoke_signed;
use mango::instruction::MangoInstruction::CreateMangoAccount;

pub fn create_trade(
  ctx: Context<CreateTrade>,
  title: String, description: String, asset: Asset, direction: bool,
  chart: String, entry_price: usize, target_price: usize, leverage: u8,
  start_time: i64, hours_to_raise: u8, funding_goal: usize
) -> Result<()> {
  let trade = &mut ctx.accounts.trade;

  // TODO: add all constraints
  require_gt!(leverage, 0);

  // let ix = Instruction::new_with_bincode(ctx.accounts.trade_owner.key(), &CreateMangoAccount { account_num: 50 }, vec![]);

  let seeds = &[b"pool".as_ref()];// TODO, &[ctx.accounts.pool.bump]];
  invoke_signed(
    &mango::instruction::create_mango_account(
      ctx.accounts.mango_program.key,
      ctx.accounts.mango_group.key,
      ctx.accounts.mango_account.key,
      ctx.accounts.pool.key,
      ctx.accounts.system_program.key,
      ctx.accounts.trade_owner.key,
      1
    ).unwrap(),
    &[
      ctx.accounts.mango_program.to_account_info().clone(),
      ctx.accounts.mango_group.to_account_info().clone(),
      ctx.accounts.mango_account.to_account_info().clone(),
      ctx.accounts.pool.to_account_info().clone(),
      ctx.accounts.system_program.to_account_info().clone(),
      ctx.accounts.trade_owner.to_account_info().clone(),
    ],
    &[&seeds[..]],
  )?;

  // trade.create_trade(
  //   ctx.accounts.trade_owner.key(),
  //   title,
  //   description,
  //   asset,
  //   direction,
  //   chart,
  //   entry_price,
  //   target_price,
  //   leverage,
  //   start_time,
  //   hours_to_raise,
  //   funding_goal
  // )
  Ok(())
}

#[derive(Accounts)]
pub struct CreateTrade<'info> {
  #[account(init, payer = trade_owner, space = 10000)] // TODO: make space dynamic
  pub trade: Account<'info, Trade>,
  /// CHECK: This is not dangerous because validation happens on Mango end
  pub mango_group: UncheckedAccount<'info>,
  /// CHECK: This is not dangerous because validation happens on Mango end
  pub mango_account: UncheckedAccount<'info>,
  #[account(mut)]
  pub trade_owner: Signer<'info>,
  /// CHECK: This is not dangerous because validation happens on Mango end
  pub mango_program: UncheckedAccount<'info>,
  #[account(
    mut,
    seeds = [b"pool".as_ref()],
    bump,
  )]
  pub pool: AccountInfo<'info>,
  pub system_program: Program<'info, System>
}
