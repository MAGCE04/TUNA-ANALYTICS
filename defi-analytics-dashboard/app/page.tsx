'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, Area, AreaChart, BarChart, Bar
} from 'recharts';
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

// Array of colors for charts
const COLORS = [
  '#00e4ff', // Aqua
  '#9333ea', // Purple
  '#00ffa3', // Neon green
  '#ffb300', // Amber
  '#ff4d6d', // Pink
];

export default function Home() {
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

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="tooltip-custom">
          <p className="text-sm font-medium mb-1">{format(new Date(label), 'MMM d, yyyy')}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatter ? formatter(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate growth indicators
  const revenueGrowth = revenueMetrics?.dailyGrowthPercentage || 0;
  const growthTrend = revenueGrowth >= 0 ? '📈' : '📉';
  const growthClass = revenueGrowth >= 0 ? 'text-success' : 'text-danger';

  // Format recent activity data
  const recentActivity = [...(orders || [])].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className={`transition-all duration-1000 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="gradient-text">DeFi Tuna Dashboard</span> 
              <span className="ml-2">🐟</span>
            </h1>
            <p className="text-text-muted">
              Last updated: {format(new Date(), 'MMM d, yyyy HH:mm')} • 
              <span className="ml-1">Getting those big brain metrics for you</span>
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

      {/* Top Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '100ms' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-text-muted">Active Users</h3>
            <span className="text-primary text-xl">👥</span>
          </div>
          <p className="text-3xl font-bold gradient-text">{userMetrics?.dau.toLocaleString() || 0}</p>
          <div className="mt-2 text-text-muted text-sm">Daily active users</div>
        </div>
        
        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-text-muted">Volume</h3>
            <span className="text-primary text-xl">📊</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totalVolume || 0)}</p>
          <div className="mt-2 text-text-muted text-sm">Trading volume</div>
        </div>
        
        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-text-muted">Tracked Assets</h3>
            <span className="text-primary text-xl">💎</span>
          </div>
          <p className="text-3xl font-bold">{pools?.length || 0}</p>
          <div className="mt-2 text-text-muted text-sm">Monitored tokens</div>
        </div>
        
        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-text-muted">Total Revenue</h3>
            <span className="text-primary text-xl">💰</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(revenueMetrics?.totalRevenue || 0)}</p>
          <div className="mt-2 text-text-muted text-sm flex items-center">
            <span className={`mr-1 ${growthClass}`}>{formatPercentage(Math.abs(revenueGrowth))}</span>
            <span className={growthClass}>{revenueGrowth >= 0 ? 'up' : 'down'}</span>
          </div>
        </div>
      </div>

      {/* Revenue & Volume Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Over Time Chart */}
        <div className={`card lg:col-span-2 transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Revenue & Volume Overview</h2>
            <div className="flex items-center text-text-muted text-sm">
              <span className="inline-block w-3 h-3 bg-primary rounded-full mr-1"></span>
              <span>Daily Revenue</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="card bg-card-hover">
              <h3 className="text-sm font-medium text-text-muted mb-1">Total Revenue</h3>
              <p className="text-2xl font-bold">{formatCurrency(revenueMetrics?.totalRevenue || 0)}</p>
              <div className="mt-1 text-xs text-text-muted">
                <span className={growthClass}>{growthTrend} {formatPercentage(Math.abs(revenueGrowth))}</span>
              </div>
            </div>
            <div className="card bg-card-hover">
              <h3 className="text-sm font-medium text-text-muted mb-1">Avg. Daily Volume</h3>
              <p className="text-2xl font-bold">{formatCurrency(totalVolume / 30 || 0)}</p>
              <div className="mt-1 text-xs text-text-muted">Based on {selectedTimeRange} data</div>
            </div>
          </div>
          <div className="h-80">
            {revenueData && revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData.map(item => ({
                    date: new Date(item.timestamp).toISOString().split('T')[0],
                    revenue: item.totalUsdValue
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 55, 72, 0.3)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8"
                    tickFormatter={(date) => format(new Date(date), 'MMM d')}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip content={<CustomTooltip formatter={(value: number) => `$${value.toLocaleString()}`} />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="var(--primary)" 
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    activeDot={{ r: 8, strokeWidth: 0, fill: 'var(--primary)' }} 
                    name="Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-text-muted">No data available for the selected time range</p>
              </div>
            )}
          </div>
        </div>

        {/* User Overview */}
        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
          <h2 className="text-xl font-bold mb-6">User Overview</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Active Users</span>
              <span className="font-bold">{userMetrics?.dau.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">New Users</span>
              <span className="font-bold">{Math.round(userMetrics?.dau * 0.15).toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Retention Rate</span>
              <span className="font-bold">{formatPercentage(userMetrics?.retentionRate || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Avg. Tx per User</span>
              <span className="font-bold">{userMetrics?.averageTransactionsPerUser.toFixed(1) || 0}</span>
            </div>
          </div>
          <div className="h-48">
            {activityData && activityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={activityData.map(item => ({
                    date: item.date,
                    users: item.uniqueUsers
                  }))}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8"
                    tickFormatter={(date) => format(new Date(date), 'MMM d')}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    tickFormatter={(value) => `${value}`}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip formatter={(value: number) => `${value}`} />} />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#9333ea" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#9333ea' }} 
                    name="Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-text-muted">No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Protocol Activity & Asset Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Protocol Activity */}
        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '700ms' }}>
          <h2 className="text-xl font-bold mb-6">Protocol Activity</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Total Transactions</span>
              <span className="font-bold">{orderStats?.totalOrders.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Avg. Tx per Day</span>
              <span className="font-bold">{Math.round((orderStats?.totalOrders || 0) / 30).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Avg. Tx Size</span>
              <span className="font-bold">{formatCurrency(orderStats?.averageOrderSize || 0)}</span>
            </div>
          </div>
          <div className="h-48">
            {orders && orders.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Open', value: orderStats?.openOrders || 0 },
                    { name: 'Filled', value: orderStats?.filledOrders || 0 },
                    { name: 'Canceled', value: orderStats?.canceledOrders || 0 }
                  ]}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#00e4ff" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-text-muted">No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Asset Overview */}
        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '800ms' }}>
          <h2 className="text-xl font-bold mb-6">Asset Overview</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Tracked Assets</span>
              <span className="font-bold">{pools?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Total TVL</span>
              <span className="font-bold">{formatCurrency(totalTVL || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Avg. Utilization</span>
              <span className="font-bold">{formatPercentage(avgUtilizationRate || 0)}</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Top Assets by Volume</h3>
            <div className="space-y-2">
              {pools && pools.length > 0 ? (
                pools.slice(0, 5).map((pool, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded bg-card-hover">
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs mr-2">
                        {index + 1}
                      </span>
                      <span>{pool.name}</span>
                    </div>
                    <span className="font-medium">{formatCurrency(pool.volume24h)}</span>
                  </div>
                ))
              ) : (
                <p className="text-text-muted text-center py-4">No assets data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Top Wallets */}
        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '900ms' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Top Wallets</h2>
            <Link href="/wallets" className="text-primary text-sm hover:underline">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {topWallets && topWallets.length > 0 ? (
              topWallets.map((wallet, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded bg-card-hover">
                  <div className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs mr-2">
                      {index + 1}
                    </span>
                    <span className="font-mono text-sm">{wallet.shortAddress}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(wallet.tradeVolume)}</div>
                    <div className="text-xs text-text-muted">{Math.round(wallet.tradeVolume / totalVolume * 100)}% of volume</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-text-muted text-center py-4">No wallet data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '1000ms' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Recent Activity</h2>
          <Link href="/orders" className="text-primary text-sm hover:underline">
            View all activity →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Wallet</th>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-4 py-3 text-left">Pair</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity && recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                <tr key={index} className="border-b border-border hover:bg-card-hover transition-colors">
                  <td className="px-4 py-3 text-sm">
                    {format(new Date(activity.timestamp), 'MMM d, HH:mm')}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm">
                    {activity.owner.substring(0, 6)}...{activity.owner.substring(activity.owner.length - 4)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${activity.status === 'filled' ? 'badge-success' : activity.status === 'canceled' ? 'badge-danger' : 'badge-warning'}`}>
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{activity.pair}</td>
                  <td className="px-4 py-3 text-right font-mono">{formatCurrency(activity.usdValue)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-center text-text-muted">
                    No recent activity
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}