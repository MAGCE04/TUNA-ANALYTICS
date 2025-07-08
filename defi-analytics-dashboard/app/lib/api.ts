/**
 * API utilities for fetching data
 */

// For static export, we'll use mock data instead of actual API calls
// In a real application, you would replace these with actual API calls

// Mock data for revenue
export const getRevenueData = async () => {
  return {
    totalRevenue: 1250000,
    weeklyRevenue: 85000,
    monthlyRevenue: 320000,
    revenueBySource: [
      { source: 'Trading Fees', amount: 750000 },
      { source: 'Liquidation Fees', amount: 320000 },
      { source: 'Borrowing Interest', amount: 180000 }
    ],
    revenueHistory: [
      { date: '2023-01-01', amount: 42000 },
      { date: '2023-02-01', amount: 45000 },
      { date: '2023-03-01', amount: 48000 },
      { date: '2023-04-01', amount: 51000 },
      { date: '2023-05-01', amount: 55000 },
      { date: '2023-06-01', amount: 60000 },
      { date: '2023-07-01', amount: 65000 },
      { date: '2023-08-01', amount: 70000 },
      { date: '2023-09-01', amount: 75000 },
      { date: '2023-10-01', amount: 80000 },
      { date: '2023-11-01', amount: 85000 }
    ],
    lastUpdated: new Date().toISOString()
  };
};

// Mock data for liquidations
export const getLiquidationsData = async () => {
  return {
    totalLiquidations: 1250,
    totalValueLiquidated: 8500000,
    averageLiquidationSize: 6800,
    liquidationsByAsset: [
      { asset: 'SOL', count: 450, value: 3200000 },
      { asset: 'USDC', count: 350, value: 2800000 },
      { asset: 'ETH', count: 250, value: 1500000 },
      { asset: 'BTC', count: 200, value: 1000000 }
    ],
    recentLiquidations: [
      { date: '2023-11-15', asset: 'SOL', value: 120000, liquidator: '8xh7...j9k2' },
      { date: '2023-11-14', asset: 'USDC', value: 85000, liquidator: '3gh5...l7m3' },
      { date: '2023-11-13', asset: 'ETH', value: 95000, liquidator: '5jk2...n8p4' },
      { date: '2023-11-12', asset: 'BTC', value: 110000, liquidator: '7mn3...q9r5' },
      { date: '2023-11-11', asset: 'SOL', value: 75000, liquidator: '2pq4...s7t6' }
    ],
    lastUpdated: new Date().toISOString()
  };
};

// Mock data for limit orders
export const getLimitOrdersData = async () => {
  return {
    totalOrders: 8750,
    activeOrders: 3250,
    filledOrders: 5500,
    ordersByType: [
      { type: 'Buy', count: 4800 },
      { type: 'Sell', count: 3950 }
    ],
    ordersByAsset: [
      { asset: 'SOL', count: 3200 },
      { asset: 'USDC', count: 2800 },
      { asset: 'ETH', count: 1500 },
      { asset: 'BTC', count: 1250 }
    ],
    recentOrders: [
      { date: '2023-11-15', type: 'Buy', asset: 'SOL', amount: 25, price: 60.25, status: 'Filled' },
      { date: '2023-11-15', type: 'Sell', asset: 'ETH', amount: 1.5, price: 2050.75, status: 'Active' },
      { date: '2023-11-14', type: 'Buy', asset: 'BTC', amount: 0.25, price: 36500.50, status: 'Filled' },
      { date: '2023-11-14', type: 'Sell', asset: 'SOL', amount: 50, price: 59.75, status: 'Active' },
      { date: '2023-11-13', type: 'Buy', asset: 'USDC', amount: 1000, price: 1.00, status: 'Filled' }
    ],
    lastUpdated: new Date().toISOString()
  };
};

// Mock data for pools
export const getPoolsData = async () => {
  return {
    totalPools: 24,
    totalValueLocked: 320000000,
    poolsByAsset: [
      { asset: 'SOL', tvl: 120000000, volume24h: 8500000, apy: 5.2 },
      { asset: 'USDC', tvl: 85000000, volume24h: 12000000, apy: 3.8 },
      { asset: 'ETH', tvl: 65000000, volume24h: 5500000, apy: 4.5 },
      { asset: 'BTC', tvl: 50000000, volume24h: 4200000, apy: 3.2 }
    ],
    topPerformingPools: [
      { asset: 'SOL-USDC', tvl: 45000000, volume24h: 6500000, apy: 7.8 },
      { asset: 'ETH-USDC', tvl: 38000000, volume24h: 5200000, apy: 6.5 },
      { asset: 'BTC-USDC', tvl: 32000000, volume24h: 4800000, apy: 5.9 },
      { asset: 'SOL-ETH', tvl: 28000000, volume24h: 3500000, apy: 8.2 }
    ],
    lastUpdated: new Date().toISOString()
  };
};

// Mock data for user activity
export const getUserActivityData = async () => {
  return {
    totalUsers: 125000,
    activeUsers24h: 15000,
    activeUsers7d: 45000,
    newUsers24h: 1200,
    userGrowth: [
      { date: '2023-01-01', users: 50000 },
      { date: '2023-02-01', users: 60000 },
      { date: '2023-03-01', users: 68000 },
      { date: '2023-04-01', users: 75000 },
      { date: '2023-05-01', users: 82000 },
      { date: '2023-06-01', users: 90000 },
      { date: '2023-07-01', users: 98000 },
      { date: '2023-08-01', users: 105000 },
      { date: '2023-09-01', users: 112000 },
      { date: '2023-10-01', users: 118000 },
      { date: '2023-11-01', users: 125000 }
    ],
    usersByRegion: [
      { region: 'North America', users: 45000 },
      { region: 'Europe', users: 35000 },
      { region: 'Asia', users: 30000 },
      { region: 'South America', users: 10000 },
      { region: 'Other', users: 5000 }
    ],
    lastUpdated: new Date().toISOString()
  };
};

// Mock data for top wallets
export const getTopWalletsData = async () => {
  return {
    topWalletsByValue: [
      { address: '8xh7...j9k2', value: 12500000, transactions: 850 },
      { address: '3gh5...l7m3', value: 8500000, transactions: 720 },
      { address: '5jk2...n8p4', value: 6200000, transactions: 650 },
      { address: '7mn3...q9r5', value: 5800000, transactions: 580 },
      { address: '2pq4...s7t6', value: 4900000, transactions: 520 }
    ],
    topWalletsByActivity: [
      { address: '9rs5...t8u7', value: 3200000, transactions: 1250 },
      { address: '4tu6...v9w8', value: 2800000, transactions: 1150 },
      { address: '6vw7...x8y9', value: 2500000, transactions: 1050 },
      { address: '8xy9...z7a8', value: 2200000, transactions: 950 },
      { address: '5za8...b6c7', value: 1800000, transactions: 850 }
    ],
    walletDistribution: [
      { range: '$0-$1K', count: 75000 },
      { range: '$1K-$10K', count: 35000 },
      { range: '$10K-$100K', count: 12000 },
      { range: '$100K-$1M', count: 2500 },
      { range: '$1M+', count: 500 }
    ],
    lastUpdated: new Date().toISOString()
  };
};