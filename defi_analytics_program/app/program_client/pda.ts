import * as anchor from '@coral-xyz/anchor';
import { Program, BN } from '@coral-xyz/anchor';
import { PublicKey, Connection, Keypair } from '@solana/web3.js';
import { DefiAnalytics } from '../../target/types/defi_analytics';

// PDA helper functions
export const findConfigPda = (programId: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    programId
  );
};

export const findRevenueDataPda = (
  programId: PublicKey,
  wallet: PublicKey,
  timestamp: BN
): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("revenue"),
      wallet.toBuffer(),
      timestamp.toArrayLike(Buffer, 'le', 8)
    ],
    programId
  );
};