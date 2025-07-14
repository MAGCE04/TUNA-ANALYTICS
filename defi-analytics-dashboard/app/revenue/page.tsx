'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useRevenueData } from '../hooks/useRevenueData';
import { formatCurrency, formatPercentage } from '../lib/utils';
import { RevenueData } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function RevenuePage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('7d');
  const {
    revenueData,
    metrics,
    loading,
    error
  } = useRevenueData(timeRange);

  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    setLastUpdated(new Date());
  }, [revenueData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="tooltip-custom">
          <p className="text-sm font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              Revenue: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartData = revenueData.map((item: RevenueData) => ({
    date: new Date(item.timestamp).toLocaleDateString(),
    revenue: item.totalUsdValue,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        <h2 className="text-xl font-bold">⚠️ Error loading data</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">📊 Revenue Dashboard</h1>
          <p className="text-gray-500">
            Last updated: {format(lastUpdated, 'MMM d, yyyy HH:mm')}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <select
            className="select bg-card border border-gray-300 p-2 rounded-md"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="card p-4 bg-white shadow">
          <h3 className="text-sm text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</p>
        </div>
        <div className="card p-4 bg-white shadow">
          <h3 className="text-sm text-gray-500">Average Daily Revenue</h3>
          <p className="text-2xl font-bold">{formatCurrency(metrics.averageDailyRevenue)}</p>
        </div>
        <div className="card p-4 bg-white shadow">
          <h3 className="text-sm text-gray-500">Growth vs. Prev Period</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatPercentage(metrics.dailyGrowthPercentage)}
          </p>
        </div>
        <div className="card p-4 bg-white shadow">
          <h3 className="text-sm text-gray-500">Top Revenue Day</h3>
          <p className="text-md font-semibold">{metrics.topRevenueDay.date}</p>
          <p className="text-xl font-bold">{formatCurrency(metrics.topRevenueDay.amount)}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="card bg-white shadow p-6">
        <h2 className="text-lg font-bold mb-4">Daily Revenue</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00bcd4" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00bcd4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" tickFormatter={(val) => `$${val}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#00bcd4"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center">No revenue data available.</p>
        )}
      </div>
    </div>
  );
}
