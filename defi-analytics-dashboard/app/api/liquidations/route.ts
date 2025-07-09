import { NextResponse } from 'next/server';
import { LiquidationEvent } from '../../types';

// Generate random Solana wallet address
const generateWalletAddress = () => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate random transaction ID
const generateTxId = () => {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Mock data for liquidation events
const generateLiquidationData = () => {
  const data: LiquidationEvent[] = [];
  const now = Date.now();
  
  // Token symbols and their price ranges
  const tokens = [
    { symbol: 'SOL', minPrice: 50, maxPrice: 150 },
    { symbol: 'ETH', minPrice: 1500, maxPrice: 3500 },
    { symbol: 'BTC', minPrice: 25000, maxPrice: 60000 },
    { symbol: 'BONK', minPrice: 0.00001, maxPrice: 0.0001 },
    { symbol: 'JUP', minPrice: 0.5, maxPrice: 2 }
  ];
  
  // Generate 50 liquidation events
  for (let i = 0; i < 50; i++) {
    const token = tokens[Math.floor(Math.random() * tokens.length)];
    const tokenPrice = token.minPrice + Math.random() * (token.maxPrice - token.minPrice);
    const tokenAmount = Math.random() * 100 + 1;
    const usdValue = tokenPrice * tokenAmount;
    
    // Distribute timestamps over the last 90 days
    const timestamp = now - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000);
    
    data.push({
      timestamp,
      wallet: generateWalletAddress(),
      tokenSymbol: token.symbol,
      tokenAmount,
      usdValue,
      txId: generateTxId()
    });
  }
  
  // Sort by timestamp (descending)
  return data.sort((a, b) => b.timestamp - a.timestamp);
};

export async function GET() {
  // Generate mock data
  const liquidationsData = generateLiquidationData();
  
  return NextResponse.json(liquidationsData);
}