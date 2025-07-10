'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useRevenueData } from './hooks/useRevenueData';
import { formatCurrency, formatPercentage, formatSol, formatUsdc } from './lib/utils';
import { TRACKED_WALLETS } from './lib/api';
import Link from 'next/link';
import TimeRangeSelector from './components/TimeRangeSelector';
import { useUserActivityData } from './hooks/useUserActivityData';
import { useTopWalletsData } from './hooks/useTopWalletsData';
import { useLimitOrdersData } from './hooks/useLimitOrdersData';
import { usePoolsData } from './hooks/usePoolsData';
import { TimeRange } from './types';
import { UserGrowthChart } from './components/charts/UserGrowthChart';
import { RevenueChart } from './components/charts/RevenueChart';
import { ActivityChart } from './components/charts/ActivityChart';
import { LiquidityChart } from './components/charts/LiquidityChart';

export default function NewDashboard() {
  // State for time range selector
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('30d');
  
  // Use our custom hooks with the selected time range
  const {
    revenueData,
    metrics: revenueMetrics,
    loading: revenueLoading,
    error: revenueError
  } = useRevenueData(selectedTimeRange);
  
  const {
    activityData,
    metrics: userMetrics,
    loading: userLoading,
    error: userError
  } = useUserActivityData(selectedTimeRange);
  
  const {
    topWallets,
    loading: walletsLoading,
    error: walletsError
  } = useTopWalletsData(selectedTimeRange);
  
  const {
    orders,
    stats: orderStats,
    loading: ordersLoading,
    error: ordersError
  } = useLimitOrdersData(selectedTimeRange);
  
  const {
    pools,
    totalTVL,
    totalVolume,
    avgUtilizationRate,
    loading: poolsLoading,
    error: poolsError
  } = usePoolsData(selectedTimeRange);

  // Animation state
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    setAnimate(true);
  }, []);

  // Check if any data is loading
  const isLoading = revenueLoading || userLoading || walletsLoading || ordersLoading || poolsLoading;

  // Check for errors
  const error = revenueError || userError || walletsError || ordersError || poolsError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl animate-pulse">🐟</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="card bg-danger/10 border border-danger/30 max-w-md">
          <h2 className="text-xl font-bold text-danger flex items-center">
            <span className="mr-2">⚠️</span> Error Loading Data
          </h2>
          <p className="mt-2">{error}</p>
          <button 
            className="btn btn-primary mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Calculate growth indicators
  const revenueGrowth = revenueMetrics?.dailyGrowthPercentage || 0;
  const growthTrend = revenueGrowth >= 0 ? '📈' : '📉';
  const growthClass = revenueGrowth >= 0 ? 'text-success' : 'text-danger';

  // Calculate additional metrics
  const newUsers = Math.round((userMetrics?.dau || 0) * 0.15);
  const dailyAvgRevenue = (revenueMetrics?.totalRevenue || 0) / 30;
  const tradingEvents = orderStats?.filledOrders || 0;
  const lendingEvents = Math.round((orderStats?.totalOrders || 0) * 0.3); // Assuming 30% are lending events

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className={`transition-all duration-1000 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="gradient-text">DeFi Tuna Dashboard - New Version</span> 
              <span className="ml-2">🐟</span>
            </h1>
            <p className="text-text-muted">
              Last updated: {format(new Date(), 'MMM d, yyyy HH:mm')} • 
              <span className="ml-1">Protocol analytics at a glance</span>
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <TimeRangeSelector 
              selectedRange={selectedTimeRange} 
              onChange={setSelectedTimeRange} 
            />
          </div>
        </div>
      </div>

      {/* SECTION 1: USER OVERVIEW */}
      <div className="mb-10 border-b border-border pb-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="text-primary text-xl mr-2">👥</span> User Overview
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="card">
            <h3 className="text-lg font-bold mb-4">User Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Total Active Users</span>
                <span className="font-bold">{userMetrics?.dau.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">New Users (Last 30 Days)</span>
                <span className="font-bold">{newUsers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Retention Rate</span>
                <span className="font-bold">{formatPercentage(userMetrics?.retentionRate || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Avg. Transactions per User</span>
                <span className="font-bold">{userMetrics?.averageTransactionsPerUser?.toFixed(1) || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">User Growth Rate</span>
                <span className="font-bold">{formatPercentage(userMetrics?.growthRate || 0)}</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 card">
            <h3 className="text-lg font-bold mb-4">User Growth Trend</h3>
            <div className="h-64">
              <UserGrowthChart />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: REVENUE OVERVIEW */}
      <div className="mb-10 border-b border-border pb-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="text-primary text-xl mr-2">💰</span> Revenue Overview
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Revenue Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Total Revenue in SOL</span>
                <span className="font-bold">{formatSol((revenueMetrics?.totalRevenue || 0) / 20)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Total Revenue in USD</span>
                <span className="font-bold">{formatCurrency(revenueMetrics?.totalRevenue || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Daily Avg. Revenue</span>
                <span className="font-bold">{formatCurrency(dailyAvgRevenue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Growth Rate</span>
                <span className={`font-bold ${growthClass}`}>
                  {growthTrend} {formatPercentage(Math.abs(revenueGrowth))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Revenue per User</span>
                <span className="font-bold">
                  {formatCurrency((revenueMetrics?.totalRevenue || 0) / (userMetrics?.dau || 1))}
                </span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 card">
            <h3 className="text-lg font-bold mb-4">Revenue Trend</h3>
            <div className="h-64">
              <RevenueChart />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: ACTIVITY OVERVIEW */}
      <div className="mb-10 border-b border-border pb-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="text-primary text-xl mr-2">📊</span> Activity Overview
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Transaction Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Total Transactions</span>
                <span className="font-bold">{orderStats?.totalOrders?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Trading Events</span>
                <span className="font-bold">{tradingEvents.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Lending Events</span>
                <span className="font-bold">{lendingEvents.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Avg. Transaction Size</span>
                <span className="font-bold">{formatCurrency(orderStats?.averageOrderSize || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Success Rate</span>
                <span className="font-bold">
                  {formatPercentage((orderStats?.filledOrders || 0) / (orderStats?.totalOrders || 1))}
                </span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 card">
            <h3 className="text-lg font-bold mb-4">Transaction Distribution</h3>
            <div className="h-64">
              <ActivityChart />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: LIQUIDITY OVERVIEW */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="text-primary text-xl mr-2">💎</span> Liquidity Overview
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Liquidity Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Total Liquidity (TVL)</span>
                <span className="font-bold">{formatCurrency(totalTVL || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Tracked Assets</span>
                <span className="font-bold">{pools?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Avg. Utilization Rate</span>
                <span className="font-bold">{formatPercentage(avgUtilizationRate || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Total Volume (30d)</span>
                <span className="font-bold">{formatCurrency(totalVolume || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Liquidity Depth</span>
                <span className="font-bold">
                  {formatPercentage((totalTVL || 0) / (totalVolume || 1) * 100)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 card">
            <h3 className="text-lg font-bold mb-4">Asset Distribution</h3>
            <div className="h-64">
              <LiquidityChart />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/users" className="card hover:bg-card-hover transition-colors p-4 flex flex-col items-center justify-center text-center">
          <span className="text-2xl mb-2">👥</span>
          <h3 className="font-bold">User Analytics</h3>
          <p className="text-sm text-text-muted mt-1">Detailed user metrics and growth</p>
        </Link>
        
        <Link href="/revenue" className="card hover:bg-card-hover transition-colors p-4 flex flex-col items-center justify-center text-center">
          <span className="text-2xl mb-2">💰</span>
          <h3 className="font-bold">Revenue Analytics</h3>
          <p className="text-sm text-text-muted mt-1">Revenue streams and projections</p>
        </Link>
        
        <Link href="/orders" className="card hover:bg-card-hover transition-colors p-4 flex flex-col items-center justify-center text-center">
          <span className="text-2xl mb-2">📊</span>
          <h3 className="font-bold">Transaction History</h3>
          <p className="text-sm text-text-muted mt-1">Detailed transaction logs</p>
        </Link>
        
        <Link href="/pools" className="card hover:bg-card-hover transition-colors p-4 flex flex-col items-center justify-center text-center">
          <span className="text-2xl mb-2">💎</span>
          <h3 className="font-bold">Liquidity Pools</h3>
          <p className="text-sm text-text-muted mt-1">Pool performance and metrics</p>
        </Link>
      </div>
    </div>
  );
}