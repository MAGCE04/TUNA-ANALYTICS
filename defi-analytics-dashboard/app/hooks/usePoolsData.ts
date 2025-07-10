import { useState, useEffect } from 'react';
import { PoolData, TimeRange } from '../types';
import { filterDataByTimeRange } from '../lib/utils';

// Define a type that extends PoolData with timestamp
type PoolDataWithTimestamp = PoolData & { timestamp: number };

export const usePoolsData = (timeRange: TimeRange) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pools, setPools] = useState<PoolData[]>([]);
  const [totalTVL, setTotalTVL] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [avgUtilizationRate, setAvgUtilizationRate] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/pools');
        
        if (!response.ok) {
          throw new Error('Failed to fetch pools data');
        }
        
        const data: PoolData[] = await response.json();
        
        // Add timestamp for filtering
        const dataWithTimestamp: PoolDataWithTimestamp[] = data.map((pool) => ({
          ...pool,
          timestamp: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000 // Mock timestamp for demo
        }));
        
        // Filter data based on time range
        const filteredData = filterDataByTimeRange<PoolDataWithTimestamp>(dataWithTimestamp, timeRange);
        
        // The filtered data still has all PoolData properties plus timestamp
        setPools(filteredData);
        
        if (filteredData.length > 0) {
          // Calculate total TVL
          const tvl = filteredData.reduce((sum, pool) => sum + pool.tvl, 0);
          setTotalTVL(tvl);
          
          // Calculate total volume
          const volume = filteredData.reduce((sum, pool) => sum + pool.volume24h, 0);
          setTotalVolume(volume);
          
          // Calculate average utilization rate
          const avgRate = filteredData.reduce((sum, pool) => sum + pool.utilizationRate, 0) / filteredData.length;
          setAvgUtilizationRate(avgRate);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [timeRange]);
  
  return { pools, totalTVL, totalVolume, avgUtilizationRate, loading, error };
};