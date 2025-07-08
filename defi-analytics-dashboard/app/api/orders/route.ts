import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { LimitOrder, LimitOrderStats } from '@/app/types';

// Constants
const TUNA_API_BASE = 'https://api.defituna.com'; // Replace with actual DeFi Tuna API endpoint
const TUNA_PROGRAM_ID = 'tuna4uSQZncNeeiAMKbstuxA9CUkHH6HmC64wgmnogD';

// Fetch limit orders directly from DeFi Tuna API
const fetchLimitOrders = async (): Promise<LimitOrder[]> => {
  try {
    // Call DeFi Tuna's orders API endpoint
    const response = await axios.get(`${TUNA_API_BASE}/orders`);
    
    const orders: LimitOrder[] = [];
    
    // Process the response data
    if (response.data && Array.isArray(response.data)) {
      for (const item of response.data) {
        orders.push({
          orderId: item.orderId || item.id || '',
          owner: item.owner || item.wallet || '',
          pair: item.pair || `${item.tokenA}/${item.tokenB}`,
          side: item.side || 'buy',
          price: item.price || 0,
          size: item.size || item.amount || 0,
          usdValue: item.usdValue || (item.price * item.size) || 0,
          timestamp: item.timestamp || Date.now(),
          status: item.status || 'open',
        });
      }
    }
    
    return orders;
  } catch (error) {
    console.error('Error fetching limit orders from DeFi Tuna API:', error);
    return [];
  }
};

// Calculate limit order statistics
const calculateOrderStats = (orders: LimitOrder[]): LimitOrderStats => {
  const totalOrders = orders.length;
  const openOrders = orders.filter(order => order.status === 'open').length;
  const filledOrders = orders.filter(order => order.status === 'filled').length;
  const canceledOrders = orders.filter(order => order.status === 'canceled').length;
  
  const totalVolume = orders.reduce((sum, order) => sum + order.usdValue, 0);
  const averageOrderSize = totalOrders > 0 ? totalVolume / totalOrders : 0;
  
  return {
    totalOrders,
    openOrders,
    filledOrders,
    canceledOrders,
    totalVolume,
    averageOrderSize,
  };
};

// Generate mock limit order data for development
const generateMockLimitOrders = (count = 50): LimitOrder[] => {
  const mockData: LimitOrder[] = [];
  const now = Date.now();
  const pairs = ['SOL/USDC', 'ETH/USDC', 'BTC/USDC', 'BONK/USDC', 'RAY/USDC'];
  const statuses: ('open' | 'filled' | 'canceled')[] = ['open', 'filled', 'canceled'];
  
  for (let i = 0; i < count; i++) {
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const side: 'buy' | 'sell' = Math.random() > 0.5 ? 'buy' : 'sell';
    const price = Math.random() * 1000 + 1; // 1-1001
    const size = Math.random() * 10 + 0.1; // 0.1-10.1
    const timestamp = now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // Within the last week
    const status = statuses[Math.floor(Math.random() * (i < count * 0.6 ? 1 : 3))]; // Make 60% of orders open
    
    mockData.push({
      orderId: `order${i}-${Math.random().toString(36).substring(2, 10)}`,
      owner: `${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 10)}`,
      pair,
      side,
      price,
      size,
      usdValue: price * size,
      timestamp,
      status,
    });
  }
  
  return mockData;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pair = searchParams.get('pair');
  const status = searchParams.get('status');
  
  try {
    let orders: LimitOrder[] = [];
    
    if (process.env.NODE_ENV === 'production') {
      // Fetch limit orders from DeFi Tuna API
      orders = await fetchLimitOrders();
    } else {
      // Use mock data for development
      console.log('Using mock limit order data');
      orders = generateMockLimitOrders(50);
    }
    
    // Apply filters if provided
    if (pair) {
      orders = orders.filter(order => order.pair === pair);
    }
    
    if (status) {
      orders = orders.filter(order => order.status === status);
    }
    
    // Calculate statistics
    const stats = calculateOrderStats(orders);
    
    // Group orders by pair
    const ordersByPair: Record<string, LimitOrder[]> = {};
    orders.forEach(order => {
      if (!ordersByPair[order.pair]) {
        ordersByPair[order.pair] = [];
      }
      ordersByPair[order.pair].push(order);
    });
    
    return NextResponse.json({ 
      orders,
      ordersByPair,
      stats
    });
  } catch (error) {
    console.error('Error processing limit order data:', error);
    return NextResponse.json({ error: 'Failed to fetch limit order data' }, { status: 500 });
  }
}