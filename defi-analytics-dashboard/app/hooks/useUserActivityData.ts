import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { UserActivity, UserMetrics, TimeRange } from '../types';
import { getDateRangeFromTimeRange } from '../lib/utils';

export function useUserActivityData() {
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [metrics, setMetrics] = useState<UserMetrics>({
    dau: 0,
    wau: 0,
    mau: 0,
    retentionRate: 0,
    averageTransactionsPerUser: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Fetch data from our API
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const { startDate, endDate } = getDateRangeFromTimeRange(timeRange);
      const params = new URLSearchParams();
      
      if (startDate) {
        params.append('startDate', startDate.toISOString());
      }
      if (endDate) {
        params.append('endDate', endDate.toISOString());
      }
      
      // Fetch data from our API
      const response = await axios.get(`/api/users?${params.toString()}`);
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      setUserActivity(response.data.activity || []);
      setMetrics(response.data.metrics || {
        dau: 0,
        wau: 0,
        mau: 0,
        retentionRate: 0,
        averageTransactionsPerUser: 0,
      });
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch user activity data');
      console.error(err);
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
  
  // Refetch data when time range changes
  useEffect(() => {
    fetchData();
  }, [timeRange]);
  
  // Calculate total unique users
  const totalUniqueUsers = useMemo(() => {
    return userActivity.reduce((sum, day) => sum + day.uniqueUsers, 0);
  }, [userActivity]);
  
  // Calculate new user growth rate
  const newUserGrowthRate = useMemo(() => {
    if (userActivity.length < 2) return 0;
    
    const sortedActivity = [...userActivity].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const firstHalf = sortedActivity.slice(0, Math.floor(sortedActivity.length / 2));
    const secondHalf = sortedActivity.slice(Math.floor(sortedActivity.length / 2));
    
    const firstHalfNewUsers = firstHalf.reduce((sum, day) => sum + day.newUsers, 0);
    const secondHalfNewUsers = secondHalf.reduce((sum, day) => sum + day.newUsers, 0);
    
    if (firstHalfNewUsers === 0) return 0;
    
    return ((secondHalfNewUsers - firstHalfNewUsers) / firstHalfNewUsers) * 100;
  }, [userActivity]);
  
  return {
    userActivity,
    metrics,
    isLoading,
    error,
    timeRange,
    lastUpdated,
    setTimeRange,
    totalUniqueUsers,
    newUserGrowthRate,
  };
}