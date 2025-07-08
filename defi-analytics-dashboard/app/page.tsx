'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, Area, AreaChart
} from 'recharts';
import { useRevenueData } from './hooks/useRevenueData';
import { formatCurrency, formatPercentage, formatSol, formatUsdc } from './lib/utils';
import { TRACKED_WALLETS } from './lib/api';
import Link from 'next/link';

export default function Home() {
  const {
    dailyRevenue,
    walletRevenue,
    metrics,
    isLoading,
    error,
    timeRange,
    lastUpdated,
    setTimeRange,
  } = useRevenueData();

  // Animation state
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    setAnimate(true);
  }, []);

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
  const revenueGrowth = metrics.dailyGrowthPercentage;
  const growthTrend = revenueGrowth >= 0 ? '📈' : '📉';
  const growthClass = revenueGrowth >= 0 ? 'text-success' : 'text-danger';

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
              Last updated: {format(lastUpdated, 'MMM d, yyyy HH:mm')} • 
              <span className="ml-1">Getting those big brain metrics for you</span>
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="flex items-center mr-4">
              <div className={`w-3 h-3 rounded-full ${revenueGrowth >= 0 ? 'bg-success' : 'bg-danger'} mr-2 pulse`}></div>
              <span className={`text-sm font-medium ${growthClass}`}>
                {formatPercentage(Math.abs(revenueGrowth))} {revenueGrowth >= 0 ? 'up' : 'down'} {growthTrend}
              </span>
            </div>
            <div className="flex space-x-2">
              {(['day', 'week', 'month', 'year', 'all'] as const).map((range) => (
                <button
                  key={range}
                  className={`btn text-sm ${timeRange === range ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setTimeRange(range)}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '100ms' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-text-muted">Total Revenue</h3>
            <span className="text-primary text-xl">💰</span>
          </div>
          <p className="text-3xl font-bold gradient-text">{formatCurrency(metrics.totalRevenue)}</p>
          <div className="mt-2 text-text-muted text-sm">Lifetime earnings</div>
        </div>
        
        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-text-muted">Average Daily</h3>
            <span className="text-primary text-xl">📅</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(metrics.averageDailyRevenue)}</p>
          <div className="mt-2 text-text-muted text-sm">Per day average</div>
        </div>
        
        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-text-muted">7-Day Average</h3>
            <span className="text-primary text-xl">📊</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(metrics.sevenDayAverage)}</p>
          <div className="mt-2 text-text-muted text-sm">Last week performance</div>
        </div>
        
        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-text-muted">Daily Growth</h3>
            <span className="text-primary text-xl">{growthTrend}</span>
          </div>
          <p className={`text-3xl font-bold ${growthClass}`}>
            {formatPercentage(Math.abs(revenueGrowth))}
            <span className="text-sm ml-1">{revenueGrowth >= 0 ? 'up' : 'down'}</span>
          </p>
          <div className="mt-2 text-text-muted text-sm">Day over day change</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
        <Link href="/liquidations" className="card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium">Liquidations</h3>
            <span className="text-primary text-xl">🌊</span>
          </div>
          <p className="text-2xl font-bold">$123,456</p>
          <div className="mt-2 text-text-muted text-sm">12 events this week</div>
        </Link>
        
        <Link href="/pools" className="card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium">Pool Activity</h3>
            <span className="text-primary text-xl">🏊‍♂️</span>
          </div>
          <p className="text-2xl font-bold">$2.45M</p>
          <div className="mt-2 text-text-muted text-sm">Total value locked</div>
        </Link>
        
        <Link href="/users" className="card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium">Active Users</h3>
            <span className="text-primary text-xl">👥</span>
          </div>
          <p className="text-2xl font-bold">1,234</p>
          <div className="mt-2 text-text-muted text-sm">+5.2% this week</div>
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Over Time Chart */}
        <div className={`card lg:col-span-2 transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Revenue Over Time</h2>
            <div className="flex items-center text-text-muted text-sm">
              <span className="inline-block w-3 h-3 bg-primary rounded-full mr-1"></span>
              <span>Daily Revenue</span>
            </div>
          </div>
          <div className="h-80">
            {dailyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dailyRevenue}
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
                    dataKey="totalUsdValue" 
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

        {/* Wallet Distribution Chart */}
        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '700ms' }}>
          <h2 className="text-xl font-bold mb-6">Revenue by Wallet</h2>
          <div className="h-80">
            {walletRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={walletRevenue}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="totalUsdValue"
                    nameKey="label"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {walletRevenue.map((entry, index) => {
                      const wallet = TRACKED_WALLETS.find(w => w.address === entry.wallet);
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={wallet?.color || COLORS[index % COLORS.length]} 
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip content={<CustomTooltip formatter={(value: number) => `$${value.toLocaleString()}`} />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-text-muted">No data available for the selected time range</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wallet Details Table */}
      <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '800ms' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Wallet Details</h2>
          <Link href="/wallets" className="text-primary text-sm hover:underline">
            View all wallets →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left">Wallet</th>
                <th className="px-4 py-3 text-right">SOL Amount</th>
                <th className="px-4 py-3 text-right">USDC Amount</th>
                <th className="px-4 py-3 text-right">Total USD Value</th>
                <th className="px-4 py-3 text-right">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {walletRevenue.map((wallet) => (
                <tr key={wallet.wallet} className="border-b border-border hover:bg-card-hover transition-colors">
                  <td className="px-4 py-3">
                    {wallet.label || wallet.wallet.substring(0, 8) + '...'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{formatSol(wallet.solAmount)}</td>
                  <td className="px-4 py-3 text-right font-mono">{formatUsdc(wallet.usdcAmount)}</td>
                  <td className="px-4 py-3 text-right font-mono">{formatCurrency(wallet.totalUsdValue)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="badge badge-success">
                      {formatPercentage(wallet.percentage)}
                    </span>
                  </td>
                </tr>
              ))}
              {walletRevenue.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-center text-text-muted">
                    No data available
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

// Array of colors for charts
const COLORS = [
  '#00e4ff', // Aqua
  '#9333ea', // Purple
  '#00ffa3', // Neon green
  '#ffb300', // Amber
  '#ff4d6d', // Pink
];