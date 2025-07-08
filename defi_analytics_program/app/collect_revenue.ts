import * as anchor from '@coral-xyz/anchor';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { DefiAnalyticsClient } from './program_client';

// Load deployment info
const deploymentInfo = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../deployment.json'), 'utf-8')
);

// Load keypair for authority
// In production, you'd use a more secure way to store your keypair
const KEYPAIR_PATH = process.env.KEYPAIR_PATH || path.join(process.env.HOME || '', '.config/solana/id.json');
const keypairData = JSON.parse(fs.readFileSync(KEYPAIR_PATH, 'utf-8'));
const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));

// Constants
const SOLSCAN_API_BASE = 'https://public-api.solscan.io';
const SOLSCAN_API_KEY = process.env.SOLSCAN_API_KEY || '';
const SOL_USD_PRICE_ENDPOINT = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd';
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

// Helper to get SOL price in USD
const getSolPrice = async (): Promise<number> => {
  try {
    const response = await axios.get(SOL_USD_PRICE_ENDPOINT);
    return response.data.solana.usd;
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    return 0;
  }
};

// Get account transactions from Solscan
const getAccountTransactions = async (address: string, limit = 50, before = ''): Promise<any[]> => {
  try {
    const url = `${SOLSCAN_API_BASE}/account/transactions`;
    const response = await axios.get(url, {
      params: { account: address, limit, beforeHash: before },
      headers: SOLSCAN_API_KEY ? { 'token': SOLSCAN_API_KEY } : {}
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching transactions for ${address}:`, error);
    return [];
  }
};

// Process transactions to calculate revenue
const processTransactions = async (
  walletAddress: string, 
  startTimestamp: number, 
  endTimestamp: number
): Promise<{ solAmount: number, usdcAmount: number }> => {
  const transactions = await getAccountTransactions(walletAddress);
  let solAmount = 0;
  let usdcAmount = 0;
  
  for (const tx of transactions) {
    const timestamp = tx.blockTime * 1000; // Convert to milliseconds
    
    if (timestamp < startTimestamp || timestamp > endTimestamp) {
      continue;
    }
    
    // Process SOL transfers (simplified)
    if (tx.lamport > 0 && tx.status === 'Success') {
      solAmount += tx.lamport / 1e9; // Convert lamports to SOL
    }
    
    // For USDC, we'd need to analyze the inner instructions which is more complex
    // This is a simplified placeholder
  }
  
  return { solAmount, usdcAmount };
};

// Main function to collect and record revenue data
async function collectAndRecordRevenue() {
  console.log('Starting revenue data collection...');
  
  try {
    // Initialize connection and client
    const connection = new Connection(deploymentInfo.cluster, 'confirmed');
    const wallet = new anchor.Wallet(keypair);
    const programId = new PublicKey(deploymentInfo.programId);
    
    const client = new DefiAnalyticsClient(connection, wallet, programId);
    
    // Get current timestamp (rounded to day)
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const timestamp = Math.floor(now.getTime() / 1000); // Convert to seconds
    
    // Calculate time ranges
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    // Get SOL price for USD conversion
    const solPrice = await getSolPrice();
    
    // Process each wallet
    for (const walletAddress of deploymentInfo.trackedWallets) {
      const wallet = new PublicKey(walletAddress);
      console.log(`Processing wallet: ${walletAddress}`);
      
      // Daily revenue
      const dailyRevenue = await processTransactions(
        walletAddress,
        oneDayAgo.getTime(),
        now.getTime()
      );
      
      // Weekly revenue
      const weeklyRevenue = await processTransactions(
        walletAddress,
        oneWeekAgo.getTime(),
        now.getTime()
      );
      
      // Monthly revenue
      const monthlyRevenue = await processTransactions(
        walletAddress,
        oneMonthAgo.getTime(),
        now.getTime()
      );
      
      // Yearly revenue
      const yearlyRevenue = await processTransactions(
        walletAddress,
        oneYearAgo.getTime(),
        now.getTime()
      );
      
      // Record daily revenue
      console.log(`Recording daily revenue for ${walletAddress}: ${dailyRevenue.solAmount} SOL, ${dailyRevenue.usdcAmount} USDC`);
      await client.recordRevenue(
        wallet,
        timestamp,
        Math.floor(dailyRevenue.solAmount * 1e9), // Convert to lamports
        Math.floor(dailyRevenue.usdcAmount * 1e6), // Convert to USDC decimals
        0 // PeriodType.Daily
      );
      
      // Record weekly revenue
      console.log(`Recording weekly revenue for ${walletAddress}: ${weeklyRevenue.solAmount} SOL, ${weeklyRevenue.usdcAmount} USDC`);
      await client.recordRevenue(
        wallet,
        timestamp,
        Math.floor(weeklyRevenue.solAmount * 1e9),
        Math.floor(weeklyRevenue.usdcAmount * 1e6),
        1 // PeriodType.Weekly
      );
      
      // Record monthly revenue
      console.log(`Recording monthly revenue for ${walletAddress}: ${monthlyRevenue.solAmount} SOL, ${monthlyRevenue.usdcAmount} USDC`);
      await client.recordRevenue(
        wallet,
        timestamp,
        Math.floor(monthlyRevenue.solAmount * 1e9),
        Math.floor(monthlyRevenue.usdcAmount * 1e6),
        2 // PeriodType.Monthly
      );
      
      // Record yearly revenue
      console.log(`Recording yearly revenue for ${walletAddress}: ${yearlyRevenue.solAmount} SOL, ${yearlyRevenue.usdcAmount} USDC`);
      await client.recordRevenue(
        wallet,
        timestamp,
        Math.floor(yearlyRevenue.solAmount * 1e9),
        Math.floor(yearlyRevenue.usdcAmount * 1e6),
        3 // PeriodType.Yearly
      );
    }
    
    console.log('Revenue data collection completed successfully!');
  } catch (error) {
    console.error('Error collecting revenue data:', error);
  }
}

// Run the collection process
collectAndRecordRevenue();