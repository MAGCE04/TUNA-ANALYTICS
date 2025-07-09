import { useState, useEffect } from 'react';
import { UserActivity, UserMetrics, TimeRange } from '../types';
import { filterDataByTimeRange, calculateGrowth } from '../lib/utils';

export const useUserActivityData = (timeRange: TimeRange) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityData, setActivityData] = useState<UserActivity[]>([]);
  const [metrics, setMetrics] = useState<UserMetrics>({
    dau: 0,
    wau: 0,
    mau: 0,
    retentionRate: 0,
    averageTransactionsPerUser: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        
        if (!response.ok) {
          throw new Error('Failed to fetch user activity data');
        }
        
        const data = await response.json();
        
        // Convert to UserActivity format with timestamp
        const formattedData = data.map((item: any) => ({
          ...item,
          timestamp: new Date(item.date).getTime()
        }));
        
        setActivityData(formattedData);
        
        // Filter data based on time range
        const filteredData = filterDataByTimeRange(formattedData, timeRange);
        
        if (filteredData.length > 0) {
          // Calculate metrics
          const totalUniqueUsers = filteredData.reduce((sum, item) => sum + item.uniqueUsers, 0);
          const totalNewUsers = filteredData.reduce((sum, item) => sum + item.newUsers, 0);
          const totalTransactions = filteredData.reduce((sum, item) => sum + item.totalTransactions, 0);
          
          const days = filteredData.length;
          const dau = totalUniqueUsers / days;
          
          // Calculate retention rate
          const returningUsers = filteredData.reduce((sum, item) => sum + item.returningUsers, 0);
          const retentionRate = totalUniqueUsers > 0 ? (returningUsers / totalUniqueUsers) * 100 : 0;
          
          // Calculate average transactions per user
          const avgTransactionsPerUser = totalUniqueUsers > 0 ? totalTransactions / totalUniqueUsers : 0;
          
          // Calculate previous period for growth comparison
          const previousPeriodStart = new Date();
          const daysInPeriod = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
          previousPeriodStart.setDate(previousPeriodStart.getDate() - (daysInPeriod * 2));
          
          setMetrics({
            dau,
            wau: dau * 7, // Simplified calculation
            mau: dau * 30, // Simplified calculation
            retentionRate,
            averageTransactionsPerUser
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
  
  return { activityData, metrics, loading, error };
};