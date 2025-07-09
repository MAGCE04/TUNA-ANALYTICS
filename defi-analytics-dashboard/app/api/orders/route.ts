import { NextResponse } from 'next/server';
import { LimitOrder } from '../../types';

// Generate random Solana wallet address
const generateWalletAddress = () => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate random order ID
const generateOrderId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Mock data for limit orders
const generateLimitOrdersData = () => {
  const data: LimitOrder[] = [];
  const now = Date.now();
  
  // Trading pairs
  const pairs = ['SOL/USDC', 'ETH/USDC', 'BTC/USDC', 'BONK/SOL', 'JUP/USDC'];
  
  // Generate 100 orders with different statuses and timestamps
  for (let i = 0; i < 100; i++) {
    const side = Math.random() > 0.5 ? 'buy' : 'sell';
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const price = Math.random() * 1000 + 10;
    const size = Math.random() * 10 + 1;
    const usdValue = price * size;
    
    // Distribute timestamps over the last 90 days
    const timestamp = now - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000);
    
    // Distribute statuses with more filled than others
    let status: 'open' | 'filled' | 'canceled';
    const statusRand = Math.random();
    if (statusRand < 0.6) {
      status = 'filled';
    } else if (statusRand < 0.8) {
      status = 'open';
    } else {
      status = 'canceled';
    }
    
    data.push({
      orderId: generateOrderId(),
      owner: generateWalletAddress(),
      pair,
      side,
      price,
      size,
      usdValue,
      timestamp,
      status
    });
  }
  
  // Sort by timestamp (descending)
  return data.sort((a, b) => b.timestamp - a.timestamp);
};

export async function GET() {
  // Generate mock data
  const ordersData = generateLimitOrdersData();
  
  return NextResponse.json(ordersData);
}