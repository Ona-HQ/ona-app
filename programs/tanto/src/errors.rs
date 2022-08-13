use anchor_lang::error_code;

#[error_code]
pub enum OnaError {
  GlobalsAlreadyInitiated,
  WrongTokenMint,
  FundingNotAllowed,
  WithdrawProhibited,
  WrongUser,
  TradeAlreadyFunded
}
