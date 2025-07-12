import { useState, useEffect } from 'react';
import { UserActivity, UserMetrics, TimeRange } from '../types';
import { filterDataByTimeRange, calculateGrowth } from '../lib/utils';

export const useUserActivityData = () => {
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

  // Update to use a valid TimeRange value
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [totalUniqueUsers, setTotalUniqueUsers] = useState(0);
  const [newUserGrowthRate, setNewUserGrowthRate] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        
        if (!response.ok) {
          throw new Error('Failed to fetch user activity data');
        }
        
        const data = await response.json();
        
        const formattedData: UserActivity[] = data.map((item: any) => ({
          ...item,
          timestamp: new Date(item.date).getTime()
        }));
        
        setActivityData(formattedData);
        
        const filteredData = filterDataByTimeRange(formattedData, timeRange);
        
        if (filteredData.length > 0) {
          const totalUnique = filteredData.reduce((sum, item) => sum + item.uniqueUsers, 0);
          const totalNew = filteredData.reduce((sum, item) => sum + item.newUsers, 0);
          const totalReturning = filteredData.reduce((sum, item) => sum + item.returningUsers, 0);
          const totalTransactions = filteredData.reduce((sum, item) => sum + item.totalTransactions, 0);

          const days = filteredData.length;
          const dau = totalUnique / days;
          const retentionRate = totalUnique > 0 ? (totalReturning / totalUnique) * 100 : 0;
          const avgTxPerUser = totalUnique > 0 ? totalTransactions / totalUnique : 0;

          setMetrics({
            dau,
            wau: dau * 7,
            mau: dau * 30,
            retentionRate,
            averageTransactionsPerUser: avgTxPerUser
          });

          setTotalUniqueUsers(totalUnique);

          // Calculate new user growth
          const previousPeriodStart = new Date();
          previousPeriodStart.setDate(previousPeriodStart.getDate() - days * 2);
          const previousPeriodData = formattedData.filter(
            item => item.timestamp >= previousPeriodStart.getTime() &&
                    item.timestamp < previousPeriodStart.getTime() + (days * 24 * 60 * 60 * 1000)
          );
          const previousNewUsers = previousPeriodData.reduce((sum, item) => sum + item.newUsers, 0);
          const growth = calculateGrowth(totalNew, previousNewUsers);

          setNewUserGrowthRate(growth);
        }

        setLastUpdated(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  return {
    userActivity: activityData,
    metrics,
    isLoading: loading,
    error,
    timeRange,
    lastUpdated,
    setTimeRange,
    totalUniqueUsers,
    newUserGrowthRate
  };
};