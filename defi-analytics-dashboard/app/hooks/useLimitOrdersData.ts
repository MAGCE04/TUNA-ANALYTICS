import { useState, useEffect } from 'react';
import { LimitOrder, LimitOrderStats, TimeRange } from '../types';
import { filterDataByTimeRange } from '../lib/utils';

export const useLimitOrdersData = (timeRange: TimeRange) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<LimitOrder[]>([]);
  const [stats, setStats] = useState<LimitOrderStats>({
    totalOrders: 0,
    openOrders: 0,
    filledOrders: 0,
    canceledOrders: 0,
    totalVolume: 0,
    averageOrderSize: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orders');
        
        if (!response.ok) {
          throw new Error('Failed to fetch limit orders data');
        }
        
        const data = await response.json();
        
        // Filter data based on time range
        const filteredData = filterDataByTimeRange(data, timeRange);
        
        setOrders(filteredData);
        
        if (filteredData.length > 0) {
          // Calculate stats
          const openOrders = filteredData.filter(order => order.status === 'open').length;
          const filledOrders = filteredData.filter(order => order.status === 'filled').length;
          const canceledOrders = filteredData.filter(order => order.status === 'canceled').length;
          
          const totalVolume = filteredData
            .filter(order => order.status === 'filled')
            .reduce((sum, order) => sum + order.usdValue, 0);
          
          const averageOrderSize = filledOrders > 0 
            ? totalVolume / filledOrders 
            : 0;
          
          setStats({
            totalOrders: filteredData.length,
            openOrders,
            filledOrders,
            canceledOrders,
            totalVolume,
            averageOrderSize
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
  
  return { orders, stats, loading, error };
};