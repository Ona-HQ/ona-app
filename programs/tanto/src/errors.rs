use anchor_lang::error_code;

#[error_code]
pub enum TantoError {
  GlobalsAlreadyInitiated,
  WrongTokenMint,
  FundingNotAllowed,
  WithdrawProhibited,
  WrongUser,
  TradeAlreadyFunded
}
