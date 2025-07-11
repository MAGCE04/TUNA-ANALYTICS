'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area
} from 'recharts';
import { useLiquidationsData } from '../hooks/useLiquidationsData';
import { formatCurrency } from '../lib/utils';
import { TimeRange } from '../types';

export default function LiquidationsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const {
    liquidations,
    dailyLiquidations,
    loading,
    error,
    totalLiquidated,
    avgLiquidationSize
  } = useLiquidationsData(timeRange);

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const lastUpdated = new Date();

  const metrics = {
    totalLiquidationVolume: totalLiquidated,
    averageDailyVolume: avgLiquidationSize,
    mostLiquidatedToken: {
      token: '',
      volume: 0
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl animate-pulse">🌊</span>
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
      <div className={`transition-all duration-1000 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center">
              <span className="gradient-text">Liquidations Tracker</span>
              <span className="ml-3 text-3xl">🌊</span>
            </h1>
            <p className="text-text-muted">
              Last updated: {format(lastUpdated, 'MMM d, yyyy HH:mm')} • 
              <span className="ml-1">Tracking the big fish getting reeled in</span>
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <div className="flex space-x-2">
              {(['7d', '30d', '90d', 'all'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  className={`btn text-sm ${timeRange === range ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '100ms' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-text-muted">Total Liquidation Volume</h3>
            <span className="text-primary text-xl">💦</span>
          </div>
          <p className="text-3xl font-bold gradient-text">{formatCurrency(metrics.totalLiquidationVolume)}</p>
          <div className="mt-2 text-text-muted text-sm">Total value liquidated</div>
        </div>

        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-text-muted">Average Daily Volume</h3>
            <span className="text-primary text-xl">📊</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(metrics.averageDailyVolume)}</p>
          <div className="mt-2 text-text-muted text-sm">Daily average</div>
        </div>

        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-text-muted">Most Liquidated Token</h3>
            <span className="text-primary text-xl">🪙</span>
          </div>
          <p className="text-3xl font-bold">
            {metrics.mostLiquidatedToken.token || 'N/A'}
          </p>
          <div className="mt-2 text-text-muted text-sm">
            {formatCurrency(metrics.mostLiquidatedToken.volume)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Liquidation Volume Over Time</h2>
            <div className="flex items-center text-text-muted text-sm">
              <span className="inline-block w-3 h-3 bg-primary rounded-full mr-1"></span>
              <span>Daily Volume</span>
            </div>
          </div>
          <div className="h-80">
            {dailyLiquidations.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyLiquidations} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorLiquidation" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00e4ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00e4ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 55, 72, 0.3)" />
                  <XAxis dataKey="date" stroke="#94a3b8" tickFormatter={(date) => format(new Date(date), 'MMM d')} />
                  <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value.toLocaleString()}`} />
                  <Tooltip content={<CustomTooltip formatter={(value: number) => `$${value.toLocaleString()}`} />} />
                  <Area type="monotone" dataKey="totalUsdValue" stroke="#00e4ff" fillOpacity={1} fill="url(#colorLiquidation)" activeDot={{ r: 8, strokeWidth: 0, fill: '#00e4ff' }} name="Liquidation Volume" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-text-muted">No data available for the selected time range</p>
              </div>
            )}
          </div>
        </div>

        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Liquidation Count by Day</h2>
            <div className="flex items-center text-text-muted text-sm">
              <span className="inline-block w-3 h-3 bg-secondary rounded-full mr-1"></span>
              <span>Daily Count</span>
            </div>
          </div>
          <div className="h-80">
            {dailyLiquidations.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyLiquidations} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 55, 72, 0.3)" />
                  <XAxis dataKey="date" stroke="#94a3b8" tickFormatter={(date) => format(new Date(date), 'MMM d')} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#9333ea" name="Liquidation Count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-text-muted">No data available for the selected time range</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
