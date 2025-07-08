import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { LiquidationEvent, DailyLiquidation } from '@/app/types';

// Constants
const TUNA_API_BASE = 'https://api.defituna.com'; // Replace with actual DeFi Tuna API endpoint
const TUNA_PROGRAM_ID = 'tuna4uSQZncNeeiAMKbstuxA9CUkHH6HmC64wgmnogD';

// Fetch liquidation events directly from DeFi Tuna API
const fetchLiquidationEvents = async (
  startTimestamp: number,
  endTimestamp: number
): Promise<LiquidationEvent[]> => {
  try {
    // Call DeFi Tuna's liquidations API endpoint
    const response = await axios.get(`${TUNA_API_BASE}/liquidations`, {
      params: {
        startTime: startTimestamp,
        endTime: endTimestamp
      }
    });
    
    const liquidationEvents: LiquidationEvent[] = [];
    
    // Process the response data
    if (response.data && Array.isArray(response.data)) {
      for (const item of response.data) {
        liquidationEvents.push({
          timestamp: item.timestamp,
          wallet: item.wallet || item.borrower || '',
          tokenSymbol: item.tokenSymbol || `${item.tokenA}/${item.tokenB} LP`,
          tokenAmount: item.tokenAmount || 0,
          usdValue: item.usdValue || 0,
          txId: item.txId || item.signature || '',
        });
      }
    }
    
    return liquidationEvents;
  } catch (error) {
    console.error('Error fetching liquidation events from DeFi Tuna API:', error);
    return [];
  }
};

// Aggregate liquidation events by day
const aggregateDailyLiquidations = (events: LiquidationEvent[]): DailyLiquidation[] => {
  const dailyMap: Record<string, DailyLiquidation> = {};

  events.forEach(event => {
    const dateStr = new Date(event.timestamp).toISOString().split('T')[0];

    if (!dailyMap[dateStr]) {
      dailyMap[dateStr] = {
        date: dateStr,
        totalUsdValue: 0,
        count: 0,
        tokens: {},
      };
    }

    dailyMap[dateStr].totalUsdValue += event.usdValue;
    dailyMap[dateStr].count += 1;

    // Track token-specific data
    if (!dailyMap[dateStr].tokens[event.tokenSymbol]) {
      dailyMap[dateStr].tokens[event.tokenSymbol] = {
        amount: 0,
        usdValue: 0,
      };
    }

    dailyMap[dateStr].tokens[event.tokenSymbol].amount += event.tokenAmount;
    dailyMap[dateStr].tokens[event.tokenSymbol].usdValue += event.usdValue;
  });

  return Object.values(dailyMap).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

// Generate mock liquidation data for development
const generateMockLiquidationData = (days = 30): LiquidationEvent[] => {
  const mockData: LiquidationEvent[] = [];
  const now = new Date();
  const tokens = ['SOL/USDC LP', 'ETH/USDC LP', 'BTC/USDC LP', 'BONK/SOL LP', 'RAY/SOL LP'];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate 0-5 liquidations per day
    const liquidationsCount = Math.floor(Math.random() * 6);
    
    for (let j = 0; j < liquidationsCount; j++) {
      const tokenSymbol = tokens[Math.floor(Math.random() * tokens.length)];
      const tokenAmount = Math.random() * 100 + 1; // 1-101 tokens
      const usdValue = tokenAmount * (tokenSymbol.includes('SOL') ? 20 : tokenSymbol.includes('USDC') ? 1 : 10);
      
      mockData.push({
        timestamp: date.getTime() + j * 3600000, // Spread throughout the day
        wallet: `${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 10)}`,
        tokenSymbol,
        tokenAmount,
        usdValue,
        txId: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      });
    }
  }
  
  return mockData;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  
  const startTimestamp = startDate ? new Date(startDate).getTime() / 1000 : (Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000;
  const endTimestamp = endDate ? new Date(endDate).getTime() / 1000 : Date.now() / 1000;
  
  try {
    let liquidationEvents: LiquidationEvent[] = [];
    
    if (process.env.NODE_ENV === 'production') {
      // Fetch liquidation events from DeFi Tuna API
      liquidationEvents = await fetchLiquidationEvents(startTimestamp, endTimestamp);
    } else {
      // Use mock data for development
      console.log('Using mock liquidation data');
      liquidationEvents = generateMockLiquidationData(30);
    }
    
    const dailyLiquidations = aggregateDailyLiquidations(liquidationEvents);
    
    return NextResponse.json({ 
      events: liquidationEvents,
      dailyLiquidations
    });
  } catch (error) {
    console.error('Error processing liquidation data:', error);
    return NextResponse.json({ error: 'Failed to fetch liquidation data' }, { status: 500 });
  }
}