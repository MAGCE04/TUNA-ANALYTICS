import * as anchor from '@coral-xyz/anchor';
import { Program, BN } from '@coral-xyz/anchor';
import { PublicKey, Connection, Keypair, TransactionInstruction, Transaction } from '@solana/web3.js';
import { DefiAnalytics } from '../../target/types/defi_analytics';
import { findConfigPda, findRevenueDataPda } from './pda';

export class DefiAnalyticsClient {
  private program: Program<DefiAnalytics>;
  private configPda: PublicKey;

  constructor(
    private connection: Connection,
    private wallet: anchor.Wallet,
    private programId: PublicKey
  ) {
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      { commitment: 'confirmed' }
    );
    
    // @ts-ignore - Anchor's type system doesn't handle this well
    this.program = new Program(DefiAnalytics.IDL, programId, provider);
    
    // Get the config PDA
    const [configPda] = findConfigPda(programId);
    this.configPda = configPda;
  }

  /**
   * Initialize the protocol config
   */
  async initialize(wallets: PublicKey[], updateInterval: number): Promise<string> {
    return this.program.methods
      .initialize(
        wallets,
        new BN(updateInterval)
      )
      .accounts({
        config: this.configPda,
        authority: this.wallet.publicKey,
      })
      .rpc();
  }

  /**
   * Add a new wallet to track
   */
  async addWallet(newWallet: PublicKey): Promise<string> {
    return this.program.methods
      .addWallet(newWallet)
      .accounts({
        config: this.configPda,
        authority: this.wallet.publicKey,
      })
      .rpc();
  }

  /**
   * Remove a wallet from tracking
   */
  async removeWallet(walletToRemove: PublicKey): Promise<string> {
    return this.program.methods
      .removeWallet(walletToRemove)
      .accounts({
        config: this.configPda,
        authority: this.wallet.publicKey,
      })
      .rpc();
  }

  /**
   * Record a new revenue snapshot
   */
  async recordRevenue(
    wallet: PublicKey,
    timestamp: number,
    solAmount: number,
    usdcAmount: number,
    periodType: number
  ): Promise<string> {
    const bnTimestamp = new BN(timestamp);
    const [revenueDataPda] = findRevenueDataPda(this.programId, wallet, bnTimestamp);
    
    return this.program.methods
      .recordRevenue(
        wallet,
        bnTimestamp,
        new BN(solAmount),
        new BN(usdcAmount),
        periodType
      )
      .accounts({
        config: this.configPda,
        authority: this.wallet.publicKey,
        revenueData: revenueDataPda,
      })
      .rpc();
  }

  /**
   * Update the configuration settings
   */
  async updateConfig(updateInterval: number): Promise<string> {
    return this.program.methods
      .updateConfig(new BN(updateInterval))
      .accounts({
        config: this.configPda,
        authority: this.wallet.publicKey,
      })
      .rpc();
  }

  /**
   * Fetch the protocol configuration
   */
  async getConfig() {
    return this.program.account.protocolConfig.fetch(this.configPda);
  }

  /**
   * Fetch all revenue snapshots
   */
  async getAllRevenueSnapshots() {
    return this.program.account.revenueSnapshot.all();
  }

  /**
   * Fetch revenue snapshots for a specific wallet
   */
  async getRevenueSnapshotsByWallet(wallet: PublicKey) {
    return this.program.account.revenueSnapshot.all([
      {
        memcmp: {
          offset: 8, // After discriminator
          bytes: wallet.toBase58()
        }
      }
    ]);
  }

  /**
   * Fetch revenue snapshots for a specific period type
   */
  async getRevenueSnapshotsByPeriodType(periodType: number) {
    return this.program.account.revenueSnapshot.all([
      {
        memcmp: {
          offset: 8 + 32 + 8 + 8 + 8, // After discriminator, wallet, timestamp, sol_amount, usdc_amount
          bytes: Buffer.from([periodType]).toString('base58')
        }
      }
    ]);
  }
}