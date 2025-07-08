import { useState, useEffect, useMemo } from 'react';
import { subDays } from 'date-fns';
import axios from 'axios';
import { 
  RevenueData, 
  FilterOptions, 
  DailyRevenue, 
  WalletRevenue, 
  RevenueMetrics,
  TimeRange,
  TokenType
} from '../types';
import { 
  TRACKED_WALLETS 
} from '../lib/api';
import { 
  filterRevenueData, 
  aggregateDailyRevenue, 
  aggregateWalletRevenue, 
  calculateRevenueMetrics,
  getDateRangeFromTimeRange
} from '../lib/utils';

// Default filter options
const defaultFilters: FilterOptions = {
  dateRange: {
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  },
  wallets: TRACKED_WALLETS.map(wallet => wallet.address),
  tokenType: 'all',
};

export function useRevenueData() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Fetch data from our API
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.dateRange.startDate) {
        params.append('startDate', filters.dateRange.startDate.toISOString());
      }
      if (filters.dateRange.endDate) {
        params.append('endDate', filters.dateRange.endDate.toISOString());
      }
      if (filters.wallets.length > 0) {
        params.append('wallets', filters.wallets.join(','));
      }
      
      // Fetch data from our API
      const response = await axios.get(`/api/revenue?${params.toString()}`);
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      setRevenueData(response.data.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch revenue data');
      console.error(err);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Falling back to mock data');
        import('../lib/api').then(api => {
          const mockData = api.generateMockRevenueData(90);
          setRevenueData(mockData);
          setLastUpdated(new Date());
          setError(null);
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh every 12 hours
    const refreshInterval = setInterval(fetchData, 12 * 60 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  // Update filters when time range changes
  useEffect(() => {
    const { startDate, endDate } = getDateRangeFromTimeRange(timeRange);
    setFilters(prev => ({
      ...prev,
      dateRange: { startDate, endDate }
    }));
  }, [timeRange]);
  
  // Refetch data when filters change
  useEffect(() => {
    fetchData();
  }, [filters.dateRange, filters.wallets.join(',')]);
  
  // Filter data based on current filters (only token type filter is applied client-side)
  const filteredData = useMemo(() => {
    if (filters.tokenType === 'all') {
      return revenueData;
    }
    
    return revenueData.filter(item => {
      if (filters.tokenType === 'SOL') {
        return item.solAmount > 0;
      } else if (filters.tokenType === 'USDC') {
        return item.usdcAmount > 0;
      }
      return true;
    });
  }, [revenueData, filters.tokenType]);
  
  // Derived data
  const dailyRevenue = useMemo(() => {
    return aggregateDailyRevenue(filteredData);
  }, [filteredData]);
  
  const walletRevenue = useMemo(() => {
    return aggregateWalletRevenue(filteredData);
  }, [filteredData]);
  
  const metrics = useMemo(() => {
    return calculateRevenueMetrics(filteredData);
  }, [filteredData]);
  
  // Filter update functions
  const updateDateRange = (startDate: Date | null, endDate: Date | null) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { startDate, endDate }
    }));
  };
  
  const updateWalletFilter = (wallets: string[]) => {
    setFilters(prev => ({
      ...prev,
      wallets
    }));
  };
  
  const updateTokenTypeFilter = (tokenType: TokenType) => {
    setFilters(prev => ({
      ...prev,
      tokenType
    }));
  };
  
  const resetFilters = () => {
    setFilters(defaultFilters);
    setTimeRange('month');
  };
  
  return {
    revenueData: filteredData,
    dailyRevenue,
    walletRevenue,
    metrics,
    isLoading,
    error,
    filters,
    timeRange,
    lastUpdated,
    setTimeRange,
    updateDateRange,
    updateWalletFilter,
    updateTokenTypeFilter,
    resetFilters
  };
}