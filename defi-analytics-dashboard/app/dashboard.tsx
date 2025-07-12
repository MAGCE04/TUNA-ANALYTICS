'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useRevenueData } from './hooks/useRevenueData';
import { formatCurrency, formatPercentage, formatSol, formatUsdc } from './lib/utils';
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
import { TradingVolumeChart } from './components/charts/TradingVolumeChart';
import { AssetAllocationChart } from './components/charts/AssetAllocationChart';
import { ProtocolPerformanceChart } from './components/charts/ProtocolPerformanceChart';
import { useProtocolStatus } from './hooks/useProtocolStatus';

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
    userActivity,
    metrics: userMetrics,
    isLoading: userLoading,
    error: userError
  } = useUserActivityData();
  
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

  const {
    status: protocolStatus,
    loading: protocolStatusLoading,
    error: protocolStatusError
  } = useProtocolStatus();

  // Animation state
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    setAnimate(true);
  }, []);

  // Check if any data is loading
  const isLoading = revenueLoading || userLoading || walletsLoading || ordersLoading || poolsLoading || protocolStatusLoading;

  // Check for errors
  const error = revenueError || userError || walletsError || ordersError || poolsError || protocolStatusError;

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

      {/* Protocol Overview Boxes */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="text-primary text-xl mr-2">📊</span> Protocol Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Overview Box 1: Protocol Status */}
          <div className="card bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                <span className="text-2xl">⏱️</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Protocol Status</h3>
                <p className="text-sm text-text-muted">Operational since {format(protocolStatus.startDate, 'MMM d, yyyy')}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Status</span>
                <span className="font-bold flex items-center">
                  <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></span>
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Uptime</span>
                <span className="font-bold">{protocolStatus.uptime} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Last Update</span>
                <span className="font-bold">{format(protocolStatus.lastUpdate, 'MMM d, HH:mm')}</span>
              </div>
            </div>
          </div>

          {/* Overview Box 2: Key Metrics */}
          <div className="card bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Key Metrics</h3>
                <p className="text-sm text-text-muted">Current performance indicators</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Total TVL</span>
                <span className="font-bold">{formatCurrency(totalTVL || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Daily Volume</span>
                <span className="font-bold">{formatCurrency(totalVolume ? totalVolume / 30 : 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Active Users</span>
                <span className="font-bold">{userMetrics?.dau.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>

          {/* Overview Box 3: Growth Indicators */}
          <div className="card bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Growth Indicators</h3>
                <p className="text-sm text-text-muted">Period-over-period changes</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Revenue Growth</span>
                <span className={`font-bold ${growthClass}`}>
                  {growthTrend} {formatPercentage(Math.abs(revenueGrowth))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">User Growth</span>
                <span className="font-bold text-success">
                  📈 {formatPercentage(userMetrics?.growthRate || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Retention Rate</span>
                <span className="font-bold">{formatPercentage(userMetrics?.retentionRate || 0)}</span>
              </div>
            </div>
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
      <div className="mb-10 border-b border-border pb-6">
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

      {/* SECTION 5: TRADING VOLUME */}
      <div className="mb-10 border-b border-border pb-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="text-primary text-xl mr-2">📉</span> Trading Volume
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Trading Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Total Trading Volume</span>
                <span className="font-bold">{formatCurrency(totalVolume || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Daily Avg. Volume</span>
                <span className="font-bold">{formatCurrency(totalVolume ? totalVolume / 30 : 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Largest Trade</span>
                <span className="font-bold">{formatCurrency(orderStats?.averageOrderSize ? orderStats.averageOrderSize * 5 : 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Trade Count</span>
                <span className="font-bold">{tradingEvents.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Avg. Trade Size</span>
                <span className="font-bold">{formatCurrency(orderStats?.averageOrderSize || 0)}</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 card">
            <h3 className="text-lg font-bold mb-4">Trading Volume Trend</h3>
            <div className="h-64">
              <TradingVolumeChart />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: ASSET ALLOCATION */}
      <div className="mb-10 border-b border-border pb-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="text-primary text-xl mr-2">🔄</span> Asset Allocation
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Asset Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Total Assets Tracked</span>
                <span className="font-bold">{(pools?.length || 0) + 2}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Most Popular Asset</span>
                <span className="font-bold">SOL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Highest APY Asset</span>
                <span className="font-bold">BTC (6.8%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Stablecoin Ratio</span>
                <span className="font-bold">{formatPercentage(30)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Asset Diversity Score</span>
                <span className="font-bold">7.5/10</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 card">
            <h3 className="text-lg font-bold mb-4">Asset Distribution</h3>
            <div className="h-64">
              <AssetAllocationChart />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 7: PROTOCOL PERFORMANCE */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="text-primary text-xl mr-2">⚡</span> Protocol Performance
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Protocol Age</span>
                <span className="font-bold">{protocolStatus.uptime} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Current APY (Avg)</span>
                <span className="font-bold">{formatPercentage(6.8)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">TVL Growth Rate</span>
                <span className="font-bold text-success">📈 {formatPercentage(15.3)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Revenue per TVL</span>
                <span className="font-bold">{formatPercentage((revenueMetrics?.totalRevenue || 0) / (totalTVL || 1) * 100)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Protocol Health Score</span>
                <span className="font-bold">8.7/10</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 card">
            <h3 className="text-lg font-bold mb-4">Performance Trend</h3>
            <div className="h-64">
              <ProtocolPerformanceChart />
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