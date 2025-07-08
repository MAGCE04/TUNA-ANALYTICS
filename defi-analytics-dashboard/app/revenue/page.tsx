'use client';

import { useRevenueData } from '../hooks/useRevenueData';
import { format } from 'date-fns';
import { formatCurrency, formatPercentage } from '../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenuePage() {
  const {
    dailyRevenue,
    metrics,
    isLoading,
    error,
    timeRange,
    lastUpdated,
    setTimeRange,
  } = useRevenueData();

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="gradient-text">Revenue Analytics</span>
          </h1>
          <p className="text-text-muted">
            Last updated: {format(lastUpdated || new Date(), 'MMM d, yyyy HH:mm')}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
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

      {/* Revenue Chart */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Revenue Over Time</h2>
        </div>
        <div className="h-96">
          {dailyRevenue && dailyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyRevenue}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
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
                <Line 
                  type="monotone" 
                  dataKey="totalUsdValue" 
                  stroke="var(--primary)" 
                  activeDot={{ r: 8, strokeWidth: 0, fill: 'var(--primary)' }} 
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-text-muted">No data available for the selected time range</p>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-text-muted">Total Revenue</h3>
            <span className="text-primary text-xl">💰</span>
          </div>
          <p className="text-3xl font-bold gradient-text">{formatCurrency(metrics?.totalRevenue || 0)}</p>
          <div className="mt-2 text-text-muted text-sm">Lifetime earnings</div>
        </div>
        
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-text-muted">Average Daily</h3>
            <span className="text-primary text-xl">📅</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(metrics?.averageDailyRevenue || 0)}</p>
          <div className="mt-2 text-text-muted text-sm">Per day average</div>
        </div>
        
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-text-muted">7-Day Average</h3>
            <span className="text-primary text-xl">📊</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(metrics?.sevenDayAverage || 0)}</p>
          <div className="mt-2 text-text-muted text-sm">Last week performance</div>
        </div>
        
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-text-muted">Daily Growth</h3>
            <span className="text-primary text-xl">{metrics?.dailyGrowthPercentage >= 0 ? '📈' : '📉'}</span>
          </div>
          <p className={`text-3xl font-bold ${metrics?.dailyGrowthPercentage >= 0 ? 'text-success' : 'text-danger'}`}>
            {formatPercentage(Math.abs(metrics?.dailyGrowthPercentage || 0))}
            <span className="text-sm ml-1">{metrics?.dailyGrowthPercentage >= 0 ? 'up' : 'down'}</span>
          </p>
          <div className="mt-2 text-text-muted text-sm">Day over day change</div>
        </div>
      </div>
    </div>
  );
}