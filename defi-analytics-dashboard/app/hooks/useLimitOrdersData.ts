import { useState, useEffect, useMemo } from 'react';
import { LimitOrder, LimitOrderStats, TimeRange } from '../types';
import { filterDataByTimeRange } from '../lib/utils';

const groupOrdersByPair = (orders: LimitOrder[]) => {
  return orders.reduce((acc, order) => {
    if (!acc[order.pair]) {
      acc[order.pair] = [];
    }
    acc[order.pair].push(order);
    return acc;
  }, {} as Record<string, LimitOrder[]>);
};

export const useLimitOrdersData = (timeRange: TimeRange = '7d') => {
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
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'open' | 'filled' | 'canceled' | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch limit orders data');
        }

        const data: LimitOrder[] = await response.json();
        const filteredData = filterDataByTimeRange<LimitOrder>(data, timeRange);
        setOrders(filteredData);
        setLastUpdated(new Date());

        if (filteredData.length > 0) {
          const openOrders = filteredData.filter(order => order.status === 'open').length;
          const filledOrders = filteredData.filter(order => order.status === 'filled').length;
          const canceledOrders = filteredData.filter(order => order.status === 'canceled').length;

          const totalVolume = filteredData
            .filter(order => order.status === 'filled')
            .reduce((sum, order) => sum + order.usdValue, 0);

          const averageOrderSize = filledOrders > 0 ? totalVolume / filledOrders : 0;

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

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (selectedPair && order.pair !== selectedPair) return false;
      if (selectedStatus && order.status !== selectedStatus) return false;
      return true;
    });
  }, [orders, selectedPair, selectedStatus]);

  const availablePairs = useMemo(() => {
    const uniquePairs = new Set(orders.map(order => order.pair));
    return Array.from(uniquePairs);
  }, [orders]);

  const fillRate = useMemo(() => {
    if (stats.totalOrders === 0) return 0;
    return stats.filledOrders / stats.totalOrders;
  }, [stats]);

  const ordersByPair = useMemo(() => groupOrdersByPair(orders), [orders]);

  return {
    orders: filteredOrders,
    ordersByPair,
    stats,
    loading,
    error,
    selectedPair,
    selectedStatus,
    availablePairs,
    lastUpdated,
    setSelectedPair,
    setSelectedStatus,
    fillRate,
  };
};
