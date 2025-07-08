
use anchor_lang::prelude::*;

#[account]
pub struct ProtocolConfig {
	pub authority: Pubkey,
	pub wallets: Vec<Pubkey>,
	pub last_updated: i64,
	pub update_interval: u64,
}
