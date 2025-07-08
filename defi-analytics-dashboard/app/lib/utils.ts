import { format, subDays, subMonths, subWeeks, subYears } from 'date-fns';
import { 
  RevenueData, 
  DailyRevenue, 
  WalletRevenue, 
  RevenueMetrics, 
  TimeRange,
  FilterOptions,
  TokenType
} from '../types';
import { TRACKED_WALLETS } from './api';

// Format currency values
export const formatCurrency = (value: number, decimals = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

// Format SOL values
export const formatSol = (value: number, decimals = 4): string => {
  return `${value.toFixed(decimals)} SOL`;
};

// Format USDC values
export const formatUsdc = (value: number, decimals = 2): string => {
  return `${value.toFixed(decimals)} USDC`;
};

// Format percentage values
export const formatPercentage = (value: number, decimals = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

// Get date range based on time range selection
export const getDateRangeFromTimeRange = (timeRange: TimeRange): { startDate: Date, endDate: Date } => {
  const endDate = new Date();
  let startDate: Date;
  
  switch (timeRange) {
    case 'day':
      startDate = subDays(endDate, 1);
      break;
    case 'week':
      startDate = subWeeks(endDate, 1);
      break;
    case 'month':
      startDate = subMonths(endDate, 1);
      break;
    case 'year':
      startDate = subYears(endDate, 1);
      break;
    case 'all':
    default:
      startDate = subYears(endDate, 5); // Default to 5 years for "all"
      break;
  }
  
  return { startDate, endDate };
};

// Filter revenue data based on filter options
export const filterRevenueData = (
  data: RevenueData[], 
  filters: FilterOptions
): RevenueData[] => {
  return data.filter(item => {
    // Filter by date range
    const itemDate = new Date(item.timestamp);
    const startDateMatch = !filters.dateRange.startDate || itemDate >= filters.dateRange.startDate;
    const endDateMatch = !filters.dateRange.endDate || itemDate <= filters.dateRange.endDate;
    
    // Filter by wallet
    const walletMatch = filters.wallets.length === 0 || filters.wallets.includes(item.wallet);
    
    // Filter by token type
    let tokenMatch = true;
    if (filters.tokenType !== 'all') {
      tokenMatch = filters.tokenType === 'SOL' 
        ? item.solAmount > 0 
        : item.usdcAmount > 0;
    }
    
    return startDateMatch && endDateMatch && walletMatch && tokenMatch;
  });
};

// Aggregate daily revenue data
export const aggregateDailyRevenue = (data: RevenueData[]): DailyRevenue[] => {
  const dailyMap: Record<string, DailyRevenue> = {};
  
  data.forEach(item => {
    const dateStr = format(new Date(item.timestamp), 'yyyy-MM-dd');
    
    if (!dailyMap[dateStr]) {
      dailyMap[dateStr] = {
        date: dateStr,
        solAmount: 0,
        usdcAmount: 0,
        totalUsdValue: 0,
      };
    }
    
    dailyMap[dateStr].solAmount += item.solAmount;
    dailyMap[dateStr].usdcAmount += item.usdcAmount;
    dailyMap[dateStr].totalUsdValue += item.totalUsdValue;
  });
  
  return Object.values(dailyMap).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

// Aggregate revenue by wallet
export const aggregateWalletRevenue = (data: RevenueData[]): WalletRevenue[] => {
  const walletMap: Record<string, WalletRevenue> = {};
  let totalValue = 0;
  
  // Initialize with zero values for all tracked wallets
  TRACKED_WALLETS.forEach(wallet => {
    walletMap[wallet.address] = {
      wallet: wallet.address,
      label: wallet.label,
      solAmount: 0,
      usdcAmount: 0,
      totalUsdValue: 0,
      percentage: 0,
    };
  });
  
  // Aggregate data
  data.forEach(item => {
    if (!walletMap[item.wallet]) {
      walletMap[item.wallet] = {
        wallet: item.wallet,
        solAmount: 0,
        usdcAmount: 0,
        totalUsdValue: 0,
        percentage: 0,
      };
    }
    
    walletMap[item.wallet].solAmount += item.solAmount;
    walletMap[item.wallet].usdcAmount += item.usdcAmount;
    walletMap[item.wallet].totalUsdValue += item.totalUsdValue;
    totalValue += item.totalUsdValue;
  });
  
  // Calculate percentages
  if (totalValue > 0) {
    Object.values(walletMap).forEach(wallet => {
      wallet.percentage = (wallet.totalUsdValue / totalValue) * 100;
    });
  }
  
  return Object.values(walletMap).sort((a, b) => b.totalUsdValue - a.totalUsdValue);
};

// Calculate revenue metrics
export const calculateRevenueMetrics = (data: RevenueData[]): RevenueMetrics => {
  const dailyRevenue = aggregateDailyRevenue(data);
  const totalRevenue = dailyRevenue.reduce((sum, day) => sum + day.totalUsdValue, 0);
  const averageDailyRevenue = dailyRevenue.length > 0 ? totalRevenue / dailyRevenue.length : 0;
  
  // Calculate 7-day average (if we have enough data)
  const last7Days = dailyRevenue.slice(-7);
  const sevenDayAverage = last7Days.length > 0 
    ? last7Days.reduce((sum, day) => sum + day.totalUsdValue, 0) / last7Days.length 
    : 0;
  
  // Calculate daily growth percentage
  let dailyGrowthPercentage = 0;
  if (dailyRevenue.length >= 2) {
    const yesterday = dailyRevenue[dailyRevenue.length - 1];
    const dayBefore = dailyRevenue[dailyRevenue.length - 2];
    
    if (dayBefore.totalUsdValue > 0) {
      dailyGrowthPercentage = ((yesterday.totalUsdValue - dayBefore.totalUsdValue) / dayBefore.totalUsdValue) * 100;
    }
  }
  
  // Find top revenue day
  const topRevenueDay = dailyRevenue.reduce(
    (max, day) => day.totalUsdValue > max.amount ? { date: day.date, amount: day.totalUsdValue } : max,
    { date: '', amount: 0 }
  );
  
  return {
    totalRevenue,
    averageDailyRevenue,
    sevenDayAverage,
    dailyGrowthPercentage,
    topRevenueDay,
  };
};

// Prepare data for charts
export const prepareLineChartData = (dailyRevenue: DailyRevenue[]) => {
  return {
    labels: dailyRevenue.map(day => day.date),
    datasets: [
      {
        label: 'Total Revenue (USD)',
        data: dailyRevenue.map(day => day.totalUsdValue),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
      },
    ],
  };
};

export const preparePieChartData = (walletRevenue: WalletRevenue[]) => {
  return {
    labels: walletRevenue.map(wallet => wallet.label || wallet.wallet.substring(0, 8) + '...'),
    datasets: [
      {
        label: 'Revenue by Wallet',
        data: walletRevenue.map(wallet => wallet.totalUsdValue),
        backgroundColor: TRACKED_WALLETS.map(wallet => wallet.color || '#6366f1'),
      },
    ],
  };
};