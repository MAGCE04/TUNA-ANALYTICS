import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { LimitOrder, LimitOrderStats } from '../types';

export function useLimitOrdersData() {
  const [orders, setOrders] = useState<LimitOrder[]>([]);
  const [ordersByPair, setOrdersByPair] = useState<Record<string, LimitOrder[]>>({});
  const [stats, setStats] = useState<LimitOrderStats>({
    totalOrders: 0,
    openOrders: 0,
    filledOrders: 0,
    canceledOrders: 0,
    totalVolume: 0,
    averageOrderSize: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'open' | 'filled' | 'canceled' | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Fetch data from our API
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (selectedPair) {
        params.append('pair', selectedPair);
      }
      if (selectedStatus) {
        params.append('status', selectedStatus);
      }
      
      // Fetch data from our API
      const response = await axios.get(`/api/orders?${params.toString()}`);
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      setOrders(response.data.orders || []);
      setOrdersByPair(response.data.ordersByPair || {});
      setStats(response.data.stats || {
        totalOrders: 0,
        openOrders: 0,
        filledOrders: 0,
        canceledOrders: 0,
        totalVolume: 0,
        averageOrderSize: 0,
      });
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch limit order data');
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
  
  // Refetch data when filters change
  useEffect(() => {
    fetchData();
  }, [selectedPair, selectedStatus]);
  
  // Get available pairs
  const availablePairs = useMemo(() => {
    return Object.keys(ordersByPair);
  }, [ordersByPair]);
  
  // Filter orders by status
  const filteredOrders = useMemo(() => {
    if (!selectedStatus) return orders;
    return orders.filter(order => order.status === selectedStatus);
  }, [orders, selectedStatus]);
  
  // Calculate fill rate
  const fillRate = useMemo(() => {
    if (stats.totalOrders === 0) return 0;
    return (stats.filledOrders / stats.totalOrders) * 100;
  }, [stats]);
  
  return {
    orders: filteredOrders,
    ordersByPair,
    stats,
    isLoading,
    error,
    selectedPair,
    selectedStatus,
    availablePairs,
    lastUpdated,
    setSelectedPair,
    setSelectedStatus,
    fillRate,
  };
}