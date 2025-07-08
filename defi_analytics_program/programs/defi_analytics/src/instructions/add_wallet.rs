use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;



	#[derive(Accounts)]
	#[instruction(
		new_wallet: Pubkey,
	)]
	pub struct AddWallet<'info> {
		#[account(
			mut,
			seeds = [
				b"config",
			],
			bump,
		)]
		pub config: Account<'info, ProtocolConfig>,

		pub authority: Signer<'info>,
	}

/// Add a new wallet to track
///
/// Accounts:
/// 0. `[writable]` config: [ProtocolConfig] The configuration account
/// 1. `[signer]` authority: [AccountInfo] The authority that can update the configuration
///
/// Data:
/// - new_wallet: [Pubkey] New wallet to add to tracking
pub fn handler(
	ctx: Context<AddWallet>,
	new_wallet: Pubkey,
) -> Result<()> {
    // Implement your business logic here...
	
	Ok(())
}
