use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;

	#[derive(Accounts)]
	#[instruction(
		wallets: Vec<Pubkey>,
		update_interval: u64,
	)]
	pub struct Initialize<'info> {
		pub authority: Signer<'info>,

		#[account(
			init,
			space=380,
			payer=authority,
			seeds = [
				b"config",
			],
			bump,
		)]
		pub config: Account<'info, ProtocolConfig>,

		pub system_program: Program<'info, System>,
	}

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
pub fn handler(
	ctx: Context<Initialize>,
	wallets: Vec<Pubkey>,
	update_interval: u64,
) -> Result<()> {
    // Validate the number of wallets
    if wallets.len() > 10 {
        return err!(ErrorCode::TooManyWallets);
    }

    // Validate the update interval (minimum 1 hour)
    if update_interval < 3600 {
        return err!(ErrorCode::InvalidUpdateInterval);
    }

    // Check for duplicate wallets
    let mut unique_wallets = Vec::new();
    for wallet in &wallets {
        if !unique_wallets.contains(wallet) {
            unique_wallets.push(*wallet);
        }
    }

    // Get the current timestamp
    let clock = Clock::get()?;
    let current_time = clock.unix_timestamp;

    // Initialize the protocol configuration
    let config = &mut ctx.accounts.config;
    config.authority = ctx.accounts.authority.key();
    config.wallets = unique_wallets;
    config.last_updated = current_time;
    config.update_interval = update_interval;

    // Log initialization details
    msg!("Protocol analytics initialized by: {}", config.authority);
    msg!("Tracking {} wallets", config.wallets.len());
    msg!("Update interval set to {} seconds", config.update_interval);
    msg!("Initialization timestamp: {}", config.last_updated);

    Ok(())
}