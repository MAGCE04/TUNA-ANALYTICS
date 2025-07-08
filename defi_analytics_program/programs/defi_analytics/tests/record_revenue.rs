pub mod common;

use std::str::FromStr;
use {
    common::{
		get_program_test,
		defi_analytics_ix_interface,
	},
    solana_program_test::tokio,
    solana_sdk::{
        account::Account, pubkey::Pubkey, rent::Rent, signature::Keypair, signer::Signer, system_program,
    },
};


#[tokio::test]
async fn record_revenue_ix_success() {
	let mut program_test = get_program_test();

	// PROGRAMS
	program_test.prefer_bpf(true);

	program_test.add_program(
		"account_compression",
		Pubkey::from_str("cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK").unwrap(),
		None,
	);

	program_test.add_program(
		"noop",
		Pubkey::from_str("noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV").unwrap(),
		None,
	);

	// DATA
	let wallet: Pubkey = Pubkey::default();
	let timestamp: i64 = Default::default();
	let sol_amount: u64 = Default::default();
	let usdc_amount: u64 = Default::default();
	let period_type: u8 = Default::default();

	// KEYPAIR
	let authority_keypair = Keypair::new();

	// PUBKEY
	let authority_pubkey = authority_keypair.pubkey();

	// EXECUTABLE PUBKEY
	let system_program_pubkey = Pubkey::from_str("11111111111111111111111111111111").unwrap();

	// PDA
	let (config_pda, _config_pda_bump) = Pubkey::find_program_address(
		&[
			b"config",
		],
		&defi_analytics::ID,
	);

	let (revenue_data_pda, _revenue_data_pda_bump) = Pubkey::find_program_address(
		&[
			b"revenue",
			wallet.as_ref(),
			timestamp.to_le_bytes().as_ref(),
		],
		&defi_analytics::ID,
	);

	// ACCOUNT PROGRAM TEST SETUP
	program_test.add_account(
		authority_pubkey,
		Account {
			lamports: 0,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	// INSTRUCTIONS
	let (mut banks_client, _, recent_blockhash) = program_test.start().await;

	let ix = defi_analytics_ix_interface::record_revenue_ix_setup(
		config_pda,
		&authority_keypair,
		revenue_data_pda,
		system_program_pubkey,
		wallet,
		timestamp,
		sol_amount,
		usdc_amount,
		period_type,
		recent_blockhash,
	);

	let result = banks_client.process_transaction(ix).await;

	// ASSERTIONS
	assert!(result.is_ok());

}
