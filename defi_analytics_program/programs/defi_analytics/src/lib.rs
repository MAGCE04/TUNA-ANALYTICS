
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use std::str::FromStr;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("DgZr5V1Ctbp1TjhT6EbztTFrdUe8voQcafxM6AMRWSqe");

#[program]
pub mod defi_analytics {
    use super::*;

/// Initialize the protocol analytics configuration
///
/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[writable]` config: [ProtocolConfig] The configuration account
/// 2. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - wallets: [Vec<Pubkey>] Initial list of wallets to track
/// - update_interval: [u64] Update interval in seconds (default 6 hours)
	pub fn initialize(ctx: Context<Initialize>, wallets: Vec<Pubkey>, update_interval: u64) -> Result<()> {
		initialize::handler(ctx, wallets, update_interval)
	}

/// Add a new wallet to track
///
/// Accounts:
/// 0. `[writable]` config: [ProtocolConfig] The configuration account
/// 1. `[signer]` authority: [AccountInfo] The authority that can update the configuration
///
/// Data:
/// - new_wallet: [Pubkey] New wallet to add to tracking
	pub fn add_wallet(ctx: Context<AddWallet>, new_wallet: Pubkey) -> Result<()> {
		add_wallet::handler(ctx, new_wallet)
	}

/// Remove a wallet from tracking
///
/// Accounts:
/// 0. `[writable]` config: [ProtocolConfig] The configuration account
/// 1. `[signer]` authority: [AccountInfo] The authority that can update the configuration
///
/// Data:
/// - wallet_to_remove: [Pubkey] Wallet to remove from tracking
	pub fn remove_wallet(ctx: Context<RemoveWallet>, wallet_to_remove: Pubkey) -> Result<()> {
		remove_wallet::handler(ctx, wallet_to_remove)
	}

/// Record a new revenue snapshot
///
/// Accounts:
/// 0. `[writable]` config: [ProtocolConfig] The configuration account
/// 1. `[signer]` authority: [AccountInfo] The authority that can update the configuration
/// 2. `[writable]` revenue_data: [RevenueSnapshot] The revenue snapshot account
/// 3. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - wallet: [Pubkey] The wallet this snapshot is for
/// - timestamp: [i64] Timestamp for this snapshot
/// - sol_amount: [u64] Amount of SOL revenue
/// - usdc_amount: [u64] Amount of USDC revenue
/// - period_type: [u8] Type of period (0=daily, 1=weekly, 2=monthly, 3=yearly)
	pub fn record_revenue(ctx: Context<RecordRevenue>, wallet: Pubkey, timestamp: i64, sol_amount: u64, usdc_amount: u64, period_type: u8) -> Result<()> {
		record_revenue::handler(ctx, wallet, timestamp, sol_amount, usdc_amount, period_type)
	}

/// Update the configuration settings
///
/// Accounts:
/// 0. `[writable]` config: [ProtocolConfig] The configuration account
/// 1. `[signer]` authority: [AccountInfo] The authority that can update the configuration
///
/// Data:
/// - update_interval: [u64] New update interval in seconds
	pub fn update_config(ctx: Context<UpdateConfig>, update_interval: u64) -> Result<()> {
		update_config::handler(ctx, update_interval)
	}



}
