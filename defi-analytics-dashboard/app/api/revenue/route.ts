import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { RevenueData, PeriodType } from '@/app/types';
import { Connection, PublicKey } from '@solana/web3.js';

// Constants
const TUNA_API_BASE = 'https://api.defituna.com'; // Replace with actual DeFi Tuna API endpoint
const TUNA_PROGRAM_ID = 'tuna4uSQZncNeeiAMKbstuxA9CUkHH6HmC64wgmnogD';
const SOL_USD_PRICE_ENDPOINT = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd';

// Helper to get SOL price in USD (still using CoinGecko as it's free and reliable)
const getSolPrice = async (): Promise<number> => {
  try {
    const response = await axios.get(SOL_USD_PRICE_ENDPOINT);
    return response.data.solana.usd;
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    return 20; // Default fallback price
  }
};

// Fetch revenue data directly from DeFi Tuna API
const fetchRevenueData = async (
  startTimestamp: number,
  endTimestamp: number
): Promise<RevenueData[]> => {
  try {
    // Call DeFi Tuna's revenue API endpoint
    const response = await axios.get(`${TUNA_API_BASE}/revenue`, {
      params: {
        startTime: startTimestamp,
        endTime: endTimestamp
      }
    });
    
    const revenueData: RevenueData[] = [];
    const solPrice = await getSolPrice();
    
    // Process the response data
    if (response.data && Array.isArray(response.data)) {
      for (const item of response.data) {
        revenueData.push({
          timestamp: item.timestamp,
          wallet: item.wallet,
          solAmount: item.solAmount || 0,
          usdcAmount: item.usdcAmount || 0,
          totalUsdValue: (item.solAmount || 0) * solPrice + (item.usdcAmount || 0),
          periodType: PeriodType.Daily
        });
      }
    }
    
    return revenueData;
  } catch (error) {
    console.error('Error fetching revenue data from DeFi Tuna API:', error);
    return [];
  }
};

// Tracked wallets - will be fetched from DeFi Tuna API
const TRACKED_WALLETS = [
  {
    address: 'feeMdgSZqGEbZdxWUBsZ9UXvmX4PmSvLxHoib6cKYEp',
    label: 'Protocol Fee Wallet',
    color: '#6366f1'
  },
  {
    address: '9j6dHYVg6jkWX2Ejp1i6M4HkzRqKtVdWfLNE9ZUhsUxM',
    label: 'Treasury Wallet',
    color: '#10b981'
  }
];

// Fetch tracked wallets from DeFi Tuna API
const fetchTrackedWallets = async () => {
  try {
    const response = await axios.get(`${TUNA_API_BASE}/config/wallets`);
    if (response.data && Array.isArray(response.data)) {
      return response.data.map((wallet: any, index: number) => ({
        address: wallet.address,
        label: wallet.label || `Wallet ${index + 1}`,
        color: wallet.color || COLORS[index % COLORS.length]
      }));
    }
    return TRACKED_WALLETS;
  } catch (error) {
    console.error('Error fetching tracked wallets:', error);
    return TRACKED_WALLETS;
  }
};

// Colors for wallet visualization
const COLORS = ['#6366f1', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

// Generate mock revenue data for development
const generateMockRevenueData = (days = 30): RevenueData[] => {
  const mockData: RevenueData[] = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    for (const wallet of TRACKED_WALLETS) {
      // Generate random values
      const solAmount = Math.random() * 10 + 1; // 1-11 SOL
      const usdcAmount = Math.random() * 1000 + 100; // 100-1100 USDC
      
      mockData.push({
        timestamp: date.getTime(),
        wallet: wallet.address,
        solAmount,
        usdcAmount,
        totalUsdValue: solAmount * 20 + usdcAmount, // Assuming 1 SOL = $20
        periodType: PeriodType.Daily
      });
    }
  }
  
  return mockData;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const wallets = searchParams.get('wallets')?.split(',');
  
  const startTimestamp = startDate ? new Date(startDate).getTime() / 1000 : (Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000;
  const endTimestamp = endDate ? new Date(endDate).getTime() / 1000 : Date.now() / 1000;
  
  try {
    let allData: RevenueData[] = [];
    let walletsToTrack = [...TRACKED_WALLETS];
    
    if (process.env.NODE_ENV === 'production') {
      // Fetch tracked wallets
      walletsToTrack = await fetchTrackedWallets();
      
      // Fetch revenue data from DeFi Tuna API
      allData = await fetchRevenueData(startTimestamp, endTimestamp);
      
      // Filter by wallets if specified
      if (wallets && wallets.length > 0) {
        allData = allData.filter(item => wallets.includes(item.wallet));
      }
    } else {
      // Use mock data for development
      console.log('Using mock revenue data');
      allData = generateMockRevenueData(30);
      
      // Filter by wallets if specified
      if (wallets && wallets.length > 0) {
        allData = allData.filter(item => wallets.includes(item.wallet));
      }
    }
    
    return NextResponse.json({ 
      data: allData,
      trackedWallets: walletsToTrack
    });
  } catch (error) {
    console.error('Error processing revenue data:', error);
    return NextResponse.json({ error: 'Failed to fetch revenue data' }, { status: 500 });
  }
}