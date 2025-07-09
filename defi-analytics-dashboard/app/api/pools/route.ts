import { NextResponse } from 'next/server';
import { PoolData } from '../../types';

// Generate random pool address
const generatePoolAddress = () => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Mock data for pools
const generatePoolsData = () => {
  const data: PoolData[] = [];
  
  // Token pairs
  const pairs = [
    { tokenA: 'SOL', tokenB: 'USDC', name: 'SOL-USDC LP' },
    { tokenA: 'ETH', tokenB: 'USDC', name: 'ETH-USDC LP' },
    { tokenA: 'BTC', tokenB: 'USDC', name: 'BTC-USDC LP' },
    { tokenA: 'BONK', tokenB: 'SOL', name: 'BONK-SOL LP' },
    { tokenA: 'JUP', tokenB: 'USDC', name: 'JUP-USDC LP' },
    { tokenA: 'ORCA', tokenB: 'SOL', name: 'ORCA-SOL LP' },
    { tokenA: 'RAY', tokenB: 'USDC', name: 'RAY-USDC LP' },
    { tokenA: 'MNGO', tokenB: 'USDC', name: 'MNGO-USDC LP' }
  ];
  
  // Generate data for each pair
  pairs.forEach(pair => {
    const tvl = Math.random() * 10000000 + 100000;
    const volume24h = tvl * (Math.random() * 0.2 + 0.05); // 5-25% of TVL
    const totalSupplied = tvl;
    const totalBorrowed = tvl * (Math.random() * 0.8); // 0-80% of TVL
    const utilizationRate = totalBorrowed / totalSupplied;
    const apy = utilizationRate * (Math.random() * 10 + 5); // 5-15% based on utilization
    
    data.push({
      poolAddress: generatePoolAddress(),
      name: pair.name,
      tokenA: pair.tokenA,
      tokenB: pair.tokenB,
      totalSupplied,
      totalBorrowed,
      utilizationRate,
      apy,
      volume24h,
      tvl
    });
  });
  
  // Sort by TVL (descending)
  return data.sort((a, b) => b.tvl - a.tvl);
};

export async function GET() {
  // Generate mock data
  const poolsData = generatePoolsData();
  
  return NextResponse.json(poolsData);
}