use {
	defi_analytics::{
			entry,
			ID as PROGRAM_ID,
	},
	solana_sdk::{
		entrypoint::{ProcessInstruction, ProgramResult},
		pubkey::Pubkey,
	},
	anchor_lang::prelude::AccountInfo,
	solana_program_test::*,
};

// Type alias for the entry function pointer used to convert the entry function into a ProcessInstruction function pointer.
pub type ProgramEntry = for<'info> fn(
	program_id: &Pubkey,
	accounts: &'info [AccountInfo<'info>],
	instruction_data: &[u8],
) -> ProgramResult;

// Macro to convert the entry function into a ProcessInstruction function pointer.
#[macro_export]
macro_rules! convert_entry {
	($entry:expr) => {
		// Use unsafe block to perform memory transmutation.
		unsafe { core::mem::transmute::<ProgramEntry, ProcessInstruction>($entry) }
	};
}

pub fn get_program_test() -> ProgramTest {
	let program_test = ProgramTest::new(
		"defi_analytics",
		PROGRAM_ID,
		processor!(convert_entry!(entry)),
	);
	program_test
}
	
pub mod defi_analytics_ix_interface {

	use {
		solana_sdk::{
			hash::Hash,
			signature::{Keypair, Signer},
			instruction::Instruction,
			pubkey::Pubkey,
			transaction::Transaction,
		},
		defi_analytics::{
			ID as PROGRAM_ID,
			accounts as defi_analytics_accounts,
			instruction as defi_analytics_instruction,
		},
		anchor_lang::{
			prelude::*,
			InstructionData,
		}
	};

	pub fn initialize_ix_setup(
		authority: &Keypair,
		config: Pubkey,
		system_program: Pubkey,
		wallets: Vec<Pubkey>,
		update_interval: u64,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = defi_analytics_accounts::Initialize {
			authority: authority.pubkey(),
			config: config,
			system_program: system_program,
		};

		let data = 	defi_analytics_instruction::Initialize {
				wallets,
				update_interval,
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&authority.pubkey()),
		);

		transaction.sign(&[
			&authority,
		], recent_blockhash);

		return transaction;
	}

	pub fn add_wallet_ix_setup(
		config: Pubkey,
		authority: &Keypair,
		new_wallet: Pubkey,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = defi_analytics_accounts::AddWallet {
			config: config,
			authority: authority.pubkey(),
		};

		let data = 	defi_analytics_instruction::AddWallet {
				new_wallet,
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&config.pubkey()),
		);

		transaction.sign(&[
			&authority,
		], recent_blockhash);

		return transaction;
	}

	pub fn remove_wallet_ix_setup(
		config: Pubkey,
		authority: &Keypair,
		wallet_to_remove: Pubkey,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = defi_analytics_accounts::RemoveWallet {
			config: config,
			authority: authority.pubkey(),
		};

		let data = 	defi_analytics_instruction::RemoveWallet {
				wallet_to_remove,
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&config.pubkey()),
		);

		transaction.sign(&[
			&authority,
		], recent_blockhash);

		return transaction;
	}

	pub fn record_revenue_ix_setup(
		config: Pubkey,
		authority: &Keypair,
		revenue_data: Pubkey,
		system_program: Pubkey,
		wallet: Pubkey,
		timestamp: i64,
		sol_amount: u64,
		usdc_amount: u64,
		period_type: u8,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = defi_analytics_accounts::RecordRevenue {
			config: config,
			authority: authority.pubkey(),
			revenue_data: revenue_data,
			system_program: system_program,
		};

		let data = 	defi_analytics_instruction::RecordRevenue {
				wallet,
				timestamp,
				sol_amount,
				usdc_amount,
				period_type,
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&config.pubkey()),
		);

		transaction.sign(&[
			&authority,
		], recent_blockhash);

		return transaction;
	}

	pub fn update_config_ix_setup(
		config: Pubkey,
		authority: &Keypair,
		update_interval: u64,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = defi_analytics_accounts::UpdateConfig {
			config: config,
			authority: authority.pubkey(),
		};

		let data = 	defi_analytics_instruction::UpdateConfig {
				update_interval,
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&config.pubkey()),
		);

		transaction.sign(&[
			&authority,
		], recent_blockhash);

		return transaction;
	}

}
