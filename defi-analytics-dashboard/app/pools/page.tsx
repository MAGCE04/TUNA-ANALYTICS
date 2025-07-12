'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell
} from 'recharts';
import { usePoolsData } from '../hooks/usePoolsData';
import { formatCurrency, formatPercentage } from '../lib/utils';
import { LiquidityChart } from '../components/charts/LiquidityChart';
import { TimeRange } from '../types';

export default function PoolsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const {
    pools,
    loading,
    error,
    totalTVL,
    totalVolume,
    avgUtilizationRate,
  } = usePoolsData(timeRange);

  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const selectedPoolData = pools.find((p) => p.poolAddress === selectedPool) || null;
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    setAnimate(true);
    if (!loading) {
      setLastUpdated(new Date());
    }
  }, [loading]);

  const [animate, setAnimate] = useState(false);

  const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="tooltip-custom">
          <p className="text-sm font-medium mb-1">{label}</p>
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

  const utilizationData = pools.map(pool => ({
    name: pool.name,
    value: pool.utilizationRate,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl animate-pulse">🏊‍♂️</span>
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className={`transition-all duration-1000 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center">
              <span className="gradient-text">Pool Insights</span>
              <span className="ml-3 text-3xl">🏊‍♂️</span>
            </h1>
            <p className="text-text-muted">
              Last updated: {format(lastUpdated, 'MMM d, yyyy HH:mm')} •
              <span className="ml-1">Dive into the deep end of liquidity</span>
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-2">
            <select
              className="select w-full md:w-auto bg-card border-primary/30 focus:border-primary"
              value={selectedPool || ''}
              onChange={(e) => setSelectedPool(e.target.value || null)}
            >
              <option value="">🔍 All Pools Overview</option>
              {pools.map((pool) => (
                <option key={pool.poolAddress} value={pool.poolAddress}>
                  {pool.name} ({pool.tokenA}/{pool.tokenB})
                </option>
              ))}
            </select>

            <select
              className="select w-full md:w-auto bg-card border-primary/30 focus:border-primary"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '100ms' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-text-muted">Total Value Locked</h3>
            <span className="text-primary text-xl">💰</span>
          </div>
          <p className="text-3xl font-bold gradient-text">{formatCurrency(totalTVL)}</p>
          <div className="mt-2 text-text-muted text-sm">Across all pools</div>
        </div>

        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-text-muted">Avg Utilization</h3>
            <span className="text-primary text-xl">📊</span>
          </div>
          <p className="text-3xl font-bold">{formatPercentage(avgUtilizationRate)}</p>
          <div className="mt-2 text-text-muted text-sm">Capital efficiency</div>
        </div>

        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-text-muted">24h Volume</h3>
            <span className="text-primary text-xl">📈</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totalVolume)}</p>
          <div className="mt-2 text-text-muted text-sm">Trading activity</div>
        </div>

        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-text-muted">Active Pools</h3>
            <span className="text-primary text-xl">🌊</span>
          </div>
          <p className="text-3xl font-bold">{pools.length}</p>
          <div className="mt-2 text-text-muted text-sm">Liquidity sources</div>
        </div>
      </div>
    </div>
  );
}