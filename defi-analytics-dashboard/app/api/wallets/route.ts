import { NextResponse } from 'next/server';
import { TopWallet } from '../../types';

// Generate random Solana wallet address
const generateWalletAddress = () => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Mock data for top wallets
const generateTopWalletsData = () => {
  const data: TopWallet[] = [];
  const now = Date.now();
  
  // Generate 20 wallets with different activity levels
  for (let i = 0; i < 20; i++) {
    const tradeVolume = Math.floor(1000000 * Math.random()) + 50000;
    const tradeCount = Math.floor(tradeVolume / 5000) + 5;
    const lastActive = now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000);
    
    const tokens = ['SOL', 'USDC', 'ETH', 'BTC', 'BONK'];
    const favoriteToken = tokens[Math.floor(Math.random() * tokens.length)];
    
    const address = generateWalletAddress();
    data.push({
      address,
      shortAddress: `${address.substring(0, 4)}...${address.substring(address.length - 4)}`,
      tradeVolume,
      tradeCount,
      lastActive,
      favoriteToken
    });
  }
  
  // Sort by trade volume (descending)
  return data.sort((a, b) => b.tradeVolume - a.tradeVolume);
};

export async function GET() {
  // Generate mock data
  const walletsData = generateTopWalletsData();
  
  return NextResponse.json(walletsData);
}