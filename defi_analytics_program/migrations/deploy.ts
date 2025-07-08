import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { PublicKey, Keypair } from '@solana/web3.js';
import fs from 'fs';
import path from 'path';
import { DefiAnalytics } from '../target/types/defi_analytics';

// Configure the client to use the local cluster
anchor.setProvider(anchor.AnchorProvider.env());
const provider = anchor.getProvider() as anchor.AnchorProvider;
const program = anchor.workspace.DefiAnalytics as Program<DefiAnalytics>;

// Wallets to track
const WALLETS_TO_TRACK = [
  new PublicKey('feeMdgSZqGEbZdxWUBsZ9UXvmX4PmSvLxHoib6cKYEp'),
  new PublicKey('9j6dHYVg6jkWX2Ejp1i6M4HkzRqKtVdWfLNE9ZUhsUxM')
];

// Update interval (6 hours in seconds)
const UPDATE_INTERVAL = 6 * 60 * 60;

async function main() {
  console.log("Deploying DeFi Analytics Program...");
  
  // Find the Config PDA
  const [configPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    program.programId
  );
  
  console.log("Config PDA:", configPda.toString());
  
  try {
    // Check if config already exists
    try {
      const configAccount = await program.account.protocolConfig.fetch(configPda);
      console.log("Config already initialized with authority:", configAccount.authority.toString());
      console.log("Tracked wallets:", configAccount.wallets.map(w => w.toString()));
      console.log("Last updated:", new Date(configAccount.lastUpdated.toNumber() * 1000).toISOString());
      console.log("Update interval:", configAccount.updateInterval.toNumber(), "seconds");
    } catch (e) {
      // Config doesn't exist, initialize it
      console.log("Initializing config...");
      
      const tx = await program.methods
        .initialize(
          WALLETS_TO_TRACK,
          new anchor.BN(UPDATE_INTERVAL)
        )
        .accounts({
          config: configPda,
          authority: provider.wallet.publicKey,
        })
        .rpc();
      
      console.log("Config initialized with transaction:", tx);
    }
    
    // Save program ID and config PDA to a file for the frontend
    const deploymentInfo = {
      programId: program.programId.toString(),
      configPda: configPda.toString(),
      trackedWallets: WALLETS_TO_TRACK.map(w => w.toString()),
      cluster: process.env.ANCHOR_PROVIDER_URL || 'http://localhost:8899'
    };
    
    fs.writeFileSync(
      path.join(__dirname, '../deployment.json'),
      JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log("Deployment info saved to deployment.json");
    console.log("Deployment completed successfully!");
    
  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);