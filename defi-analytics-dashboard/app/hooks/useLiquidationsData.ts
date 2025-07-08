import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { LiquidationEvent, DailyLiquidation, TimeRange } from '../types';
import { getDateRangeFromTimeRange } from '../lib/utils';

export function useLiquidationsData() {
  const [liquidationEvents, setLiquidationEvents] = useState<LiquidationEvent[]>([]);
  const [dailyLiquidations, setDailyLiquidations] = useState<DailyLiquidation[]>([]);
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
      const response = await axios.get(`/api/liquidations?${params.toString()}`);
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      setLiquidationEvents(response.data.events || []);
      setDailyLiquidations(response.data.dailyLiquidations || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch liquidation data');
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
  
  // Calculate total liquidation volume
  const totalLiquidationVolume = useMemo(() => {
    return dailyLiquidations.reduce((sum, day) => sum + day.totalUsdValue, 0);
  }, [dailyLiquidations]);
  
  // Calculate average daily liquidation volume
  const averageDailyVolume = useMemo(() => {
    return dailyLiquidations.length > 0
      ? totalLiquidationVolume / dailyLiquidations.length
      : 0;
  }, [dailyLiquidations, totalLiquidationVolume]);
  
  // Calculate most liquidated token
  const mostLiquidatedToken = useMemo(() => {
    const tokenVolumes: Record<string, number> = {};
    
    dailyLiquidations.forEach(day => {
      Object.entries(day.tokens).forEach(([token, data]) => {
        tokenVolumes[token] = (tokenVolumes[token] || 0) + data.usdValue;
      });
    });
    
    let maxToken = '';
    let maxVolume = 0;
    
    Object.entries(tokenVolumes).forEach(([token, volume]) => {
      if (volume > maxVolume) {
        maxToken = token;
        maxVolume = volume;
      }
    });
    
    return { token: maxToken, volume: maxVolume };
  }, [dailyLiquidations]);
  
  return {
    liquidationEvents,
    dailyLiquidations,
    isLoading,
    error,
    timeRange,
    lastUpdated,
    setTimeRange,
    metrics: {
      totalLiquidationVolume,
      averageDailyVolume,
      mostLiquidatedToken,
    },
  };
}