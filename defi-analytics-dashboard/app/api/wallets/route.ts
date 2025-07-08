import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { TopWallet } from '@/app/types';

// Constants
const TUNA_API_BASE = 'https://api.defituna.com'; // Replace with actual DeFi Tuna API endpoint
const TUNA_PROGRAM_ID = 'tuna4uSQZncNeeiAMKbstuxA9CUkHH6HmC64wgmnogD';

// Helper to anonymize wallet addresses
const anonymizeAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
};

// Fetch top wallets directly from DeFi Tuna API
const fetchTopWallets = async (limit = 10): Promise<TopWallet[]> => {
  try {
    // Call DeFi Tuna's top wallets API endpoint
    const response = await axios.get(`${TUNA_API_BASE}/wallets/top`, {
      params: { limit }
    });
    
    const topWallets: TopWallet[] = [];
    
    // Process the response data
    if (response.data && Array.isArray(response.data)) {
      for (const item of response.data) {
        topWallets.push({
          address: item.address || '',
          shortAddress: anonymizeAddress(item.address || ''),
          tradeVolume: item.tradeVolume || item.volume || 0,
          tradeCount: item.tradeCount || item.count || 0,
          lastActive: item.lastActive || item.timestamp || Date.now(),
          favoriteToken: item.favoriteToken || item.token || undefined,
        });
      }
    }
    
    return topWallets;
  } catch (error) {
    console.error('Error fetching top wallets from DeFi Tuna API:', error);
    return [];
  }
};

// Generate mock top wallet data for development
const generateMockTopWallets = (count = 10): TopWallet[] => {
  const mockData: TopWallet[] = [];
  const now = Date.now();
  const tokens = ['SOL', 'USDC', 'ETH', 'BTC', 'BONK', 'RAY'];
  
  for (let i = 0; i < count; i++) {
    const address = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const tradeVolume = Math.random() * 100000 + 1000; // $1,000 - $101,000
    const tradeCount = Math.floor(Math.random() * 500) + 10; // 10-510 trades
    const lastActive = now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // Within the last week
    const favoriteToken = tokens[Math.floor(Math.random() * tokens.length)];
    
    mockData.push({
      address,
      shortAddress: anonymizeAddress(address),
      tradeVolume,
      tradeCount,
      lastActive,
      favoriteToken,
    });
  }
  
  // Sort by trade volume descending
  return mockData.sort((a, b) => b.tradeVolume - a.tradeVolume);
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  
  try {
    let topWallets: TopWallet[] = [];
    
    if (process.env.NODE_ENV === 'production') {
      // Fetch top wallets from DeFi Tuna API
      topWallets = await fetchTopWallets(limit);
    } else {
      // Use mock data for development
      console.log('Using mock top wallet data');
      topWallets = generateMockTopWallets(limit);
    }
    
    return NextResponse.json({ topWallets });
  } catch (error) {
    console.error('Error processing top wallet data:', error);
    return NextResponse.json({ error: 'Failed to fetch top wallet data' }, { status: 500 });
  }
}