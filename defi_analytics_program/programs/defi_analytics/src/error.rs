use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Wallet already exists in tracking list")]
    WalletAlreadyExists,
    
    #[msg("Wallet not found in tracking list")]
    WalletNotFound,
    
    #[msg("Too many wallets - maximum 10 wallets can be tracked")]
    TooManyWallets,
    
    #[msg("Invalid update interval - minimum interval is 1 hour (3600 seconds)")]
    InvalidUpdateInterval,
    
    #[msg("Unauthorized - only the authority can perform this action")]
    Unauthorized,
    
    #[msg("Update not due yet - please wait until the next update interval")]
    UpdateNotDue,
    
    #[msg("Invalid revenue amount")]
    InvalidRevenueAmount,
}