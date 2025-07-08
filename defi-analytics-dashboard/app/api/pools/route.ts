import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { PoolData } from '@/app/types';

// Constants
const TUNA_API_BASE = 'https://api.defituna.com'; // Replace with actual DeFi Tuna API endpoint
const TUNA_PROGRAM_ID = 'tuna4uSQZncNeeiAMKbstuxA9CUkHH6HmC64wgmnogD';

// Fetch pool data directly from DeFi Tuna API
const fetchPoolData = async (): Promise<PoolData[]> => {
  try {
    // Call DeFi Tuna's pools API endpoint
    const response = await axios.get(`${TUNA_API_BASE}/pools`);
    
    const pools: PoolData[] = [];
    
    // Process the response data
    if (response.data && Array.isArray(response.data)) {
      for (const item of response.data) {
        pools.push({
          poolAddress: item.address || item.id || '',
          name: item.name || `${item.tokenA}/${item.tokenB} Pool`,
          tokenA: item.tokenA || '',
          tokenB: item.tokenB || '',
          totalSupplied: item.totalSupplied || item.supplied || 0,
          totalBorrowed: item.totalBorrowed || item.borrowed || 0,
          utilizationRate: item.utilizationRate || (item.totalBorrowed / item.totalSupplied * 100) || 0,
          apy: item.apy || 0,
          volume24h: item.volume24h || item.volume || 0,
          tvl: item.tvl || item.totalSupplied || 0,
        });
      }
    }
    
    return pools;
  } catch (error) {
    console.error('Error fetching pool data from DeFi Tuna API:', error);
    return [];
  }
};

// Generate mock pool data for development
const generateMockPoolData = (count = 5): PoolData[] => {
  const mockData: PoolData[] = [];
  const tokenPairs = [
    { a: 'SOL', b: 'USDC' },
    { a: 'ETH', b: 'USDC' },
    { a: 'BTC', b: 'USDC' },
    { a: 'BONK', b: 'SOL' },
    { a: 'RAY', b: 'SOL' },
  ];
  
  for (let i = 0; i < count; i++) {
    const pair = tokenPairs[i % tokenPairs.length];
    const totalSupplied = Math.random() * 1000000 + 100000; // $100K - $1.1M
    const utilizationRate = Math.random() * 80 + 10; // 10-90%
    const totalBorrowed = totalSupplied * (utilizationRate / 100);
    
    // Calculate APY based on utilization (simplified formula)
    const baseApy = 2; // 2% base APY
    const utilizationFactor = 0.1; // 10% of utilization adds to APY
    const apy = baseApy + (utilizationRate * utilizationFactor);
    
    mockData.push({
      poolAddress: `pool${i}-${Math.random().toString(36).substring(2, 10)}`,
      name: `${pair.a}/${pair.b} Pool`,
      tokenA: pair.a,
      tokenB: pair.b,
      totalSupplied,
      totalBorrowed,
      utilizationRate,
      apy,
      volume24h: Math.random() * 500000 + 10000, // $10K - $510K
      tvl: totalSupplied,
    });
  }
  
  // Sort by TVL descending
  return mockData.sort((a, b) => b.tvl - a.tvl);
};

export async function GET(request: NextRequest) {
  try {
    let pools: PoolData[] = [];
    
    if (process.env.NODE_ENV === 'production') {
      // Fetch pool data from DeFi Tuna API
      pools = await fetchPoolData();
    } else {
      // Use mock data for development
      console.log('Using mock pool data');
      pools = generateMockPoolData(5);
    }
    
    return NextResponse.json({ pools });
  } catch (error) {
    console.error('Error processing pool data:', error);
    return NextResponse.json({ error: 'Failed to fetch pool data' }, { status: 500 });
  }
}