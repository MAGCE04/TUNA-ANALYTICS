
use anchor_lang::prelude::*;

#[account]
pub struct RevenueSnapshot {
	pub timestamp: i64,
	pub wallet: Pubkey,
	pub sol_amount: u64,
	pub usdc_amount: u64,
	pub period_type: u8,
}
