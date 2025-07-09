import { NextResponse } from 'next/server';
import { RevenueData, PeriodType } from '../../types';

// Generate random Solana wallet address
const generateWalletAddress = () => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Mock data for revenue
const generateRevenueData = () => {
  const data: RevenueData[] = [];
  const now = Date.now();
  
  // Wallet addresses
  const wallets = [
    generateWalletAddress(),
    generateWalletAddress(),
    generateWalletAddress(),
    generateWalletAddress(),
    generateWalletAddress()
  ];
  
  // Generate data for the last 90 days
  for (let i = 90; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Base values with some randomization and trend
    const baseRevenue = 5000 + Math.floor(i / 10) * 500; // Gradually increasing trend
    const randomFactor = 0.3; // 30% random variation
    
    // Generate revenue for each wallet
    wallets.forEach(wallet => {
      const solAmount = Math.floor(baseRevenue * 0.4 * (1 + (Math.random() * randomFactor - randomFactor/2)));
      const usdcAmount = Math.floor(baseRevenue * 0.6 * (1 + (Math.random() * randomFactor - randomFactor/2)));
      const totalUsdValue = solAmount * 100 + usdcAmount; // Assuming 1 SOL = $100
      
      data.push({
        timestamp: date.getTime(),
        wallet,
        solAmount,
        usdcAmount,
        totalUsdValue,
        periodType: PeriodType.Daily
      });
    });
  }
  
  return data;
};

export async function GET() {
  // Generate mock data
  const revenueData = generateRevenueData();
  
  return NextResponse.json(revenueData);
}