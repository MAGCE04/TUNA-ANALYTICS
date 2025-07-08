import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { PoolData } from '../types';

export function usePoolsData() {
  const [pools, setPools] = useState<PoolData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Fetch data from our API
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch data from our API
      const response = await axios.get('/api/pools');
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      setPools(response.data.pools || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch pool data');
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
  
  // Get selected pool data
  const selectedPoolData = useMemo(() => {
    if (!selectedPool) return null;
    return pools.find(pool => pool.poolAddress === selectedPool) || null;
  }, [pools, selectedPool]);
  
  // Calculate average utilization rate
  const averageUtilizationRate = useMemo(() => {
    if (pools.length === 0) return 0;
    return pools.reduce((sum, pool) => sum + pool.utilizationRate, 0) / pools.length;
  }, [pools]);
  
  // Calculate total TVL
  const totalTVL = useMemo(() => {
    return pools.reduce((sum, pool) => sum + pool.tvl, 0);
  }, [pools]);
  
  // Calculate total 24h volume
  const total24hVolume = useMemo(() => {
    return pools.reduce((sum, pool) => sum + pool.volume24h, 0);
  }, [pools]);
  
  return {
    pools,
    isLoading,
    error,
    selectedPool,
    selectedPoolData,
    lastUpdated,
    setSelectedPool,
    metrics: {
      averageUtilizationRate,
      totalTVL,
      total24hVolume,
    },
  };
}