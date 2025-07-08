use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;



	#[derive(Accounts)]
	#[instruction(
		update_interval: u64,
	)]
	pub struct UpdateConfig<'info> {
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

/// Update the configuration settings
///
/// Accounts:
/// 0. `[writable]` config: [ProtocolConfig] The configuration account
/// 1. `[signer]` authority: [AccountInfo] The authority that can update the configuration
///
/// Data:
/// - update_interval: [u64] New update interval in seconds
pub fn handler(
	ctx: Context<UpdateConfig>,
	update_interval: u64,
) -> Result<()> {
    // Implement your business logic here...
	
	Ok(())
}
