import { useState, useEffect } from 'react';
import { RevenueData, TimeRange, RevenueMetrics } from '../types';
import { filterDataByTimeRange, calculateGrowth } from '../lib/utils';

export const useRevenueData = (timeRange: TimeRange) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [metrics, setMetrics] = useState<RevenueMetrics>({
    totalRevenue: 0,
    averageDailyRevenue: 0,
    sevenDayAverage: 0,
    dailyGrowthPercentage: 0,
    topRevenueDay: {
      date: '',
      amount: 0
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/revenue');
        
        if (!response.ok) {
          throw new Error('Failed to fetch revenue data');
        }
        
        const data = await response.json();
        setRevenueData(data);
        
        // Filter data based on time range
        const filteredData = filterDataByTimeRange(data, timeRange);
        
        // Calculate metrics
        if (filteredData.length > 0) {
          const totalRevenue = filteredData.reduce((sum, item) => sum + item.totalUsdValue, 0);
          const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : filteredData.length;
          const averageDailyRevenue = totalRevenue / days;
          
          // Calculate previous period for growth
          const previousPeriodStart = new Date();
          previousPeriodStart.setDate(previousPeriodStart.getDate() - (days * 2));
          const previousPeriodData = data.filter(
            item => item.timestamp >= previousPeriodStart.getTime() && 
                   item.timestamp < previousPeriodStart.getTime() + (days * 24 * 60 * 60 * 1000)
          );
          const previousPeriodRevenue = previousPeriodData.reduce((sum, item) => sum + item.totalUsdValue, 0);
          const revenueGrowth = calculateGrowth(totalRevenue, previousPeriodRevenue);
          
          // Find top revenue day
          const dailyRevenue: { [date: string]: number } = {};
          filteredData.forEach(item => {
            const date = new Date(item.timestamp).toISOString().split('T')[0];
            dailyRevenue[date] = (dailyRevenue[date] || 0) + item.totalUsdValue;
          });
          
          const topDay = Object.entries(dailyRevenue).reduce(
            (max, [date, amount]) => amount > max.amount ? { date, amount } : max,
            { date: '', amount: 0 }
          );
          
          setMetrics({
            totalRevenue,
            averageDailyRevenue,
            sevenDayAverage: averageDailyRevenue, // Simplified for now
            dailyGrowthPercentage: revenueGrowth,
            topRevenueDay: topDay
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [timeRange]);
  
  return { revenueData, metrics, loading, error };
};