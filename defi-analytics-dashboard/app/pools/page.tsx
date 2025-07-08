'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { usePoolsData } from '../hooks/usePoolsData';
import { formatCurrency, formatPercentage } from '../lib/utils';

export default function PoolsPage() {
  const {
    pools,
    isLoading,
    error,
    selectedPool,
    selectedPoolData,
    lastUpdated,
    setSelectedPool,
    metrics,
  } = usePoolsData();

  // Animation state
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    setAnimate(true);
  }, []);

  // Colors for charts
  const COLORS = ['#00e4ff', '#9333ea', '#00ffa3', '#ffb300', '#ff4d6d'];

  if (isLoading) {
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

  // Custom tooltip for charts
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

  // Prepare data for TVL chart
  const tvlData = pools.map(pool => ({
    name: pool.name,
    value: pool.tvl,
  }));

  // Prepare data for utilization chart
  const utilizationData = pools.map(pool => ({
    name: pool.name,
    value: pool.utilizationRate,
  }));

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
          
          <div className="mt-4 md:mt-0">
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
          <p className="text-3xl font-bold gradient-text">{formatCurrency(metrics.totalTVL)}</p>
          <div className="mt-2 text-text-muted text-sm">Across all pools</div>
        </div>
        
        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-text-muted">Avg Utilization</h3>
            <span className="text-primary text-xl">📊</span>
          </div>
          <p className="text-3xl font-bold">{formatPercentage(metrics.averageUtilizationRate)}</p>
          <div className="mt-2 text-text-muted text-sm">Capital efficiency</div>
        </div>
        
        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-text-muted">24h Volume</h3>
            <span className="text-primary text-xl">📈</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(metrics.total24hVolume)}</p>
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

      {/* Selected Pool Details */}
      {selectedPoolData && (
        <div className={`card mb-8 border-primary/30 glow transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <span className="mr-2">🔍</span>
              {selectedPoolData.name} Details
            </h2>
            <div className="badge badge-success">Selected Pool</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-text-muted">Token Pair</h3>
              <p className="text-lg font-bold mt-1 gradient-text">{selectedPoolData.tokenA}/{selectedPoolData.tokenB}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-text-muted">TVL</h3>
              <p className="text-lg font-bold mt-1">{formatCurrency(selectedPoolData.tvl)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-text-muted">Utilization Rate</h3>
              <p className="text-lg font-bold mt-1">{formatPercentage(selectedPoolData.utilizationRate)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-text-muted">APY</h3>
              <p className="text-lg font-bold mt-1 text-success">{formatPercentage(selectedPoolData.apy)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-text-muted">Total Supplied</h3>
              <p className="text-lg font-bold mt-1">{formatCurrency(selectedPoolData.totalSupplied)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-text-muted">Total Borrowed</h3>
              <p className="text-lg font-bold mt-1">{formatCurrency(selectedPoolData.totalBorrowed)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-text-muted">24h Volume</h3>
              <p className="text-lg font-bold mt-1">{formatCurrency(selectedPoolData.volume24h)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-text-muted">Pool Address</h3>
              <p className="text-sm font-mono mt-1 truncate text-text-muted">
                {selectedPoolData.poolAddress}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* TVL Distribution */}
        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">TVL Distribution</h2>
            <div className="flex items-center text-text-muted text-sm">
              <span className="inline-block w-3 h-3 bg-primary rounded-full mr-1"></span>
              <span>By Pool</span>
            </div>
          </div>
          <div className="h-80">
            {pools.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tvlData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {tvlData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip formatter={(value: number) => formatCurrency(value)} />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-text-muted">No pool data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Utilization Rates */}
        <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '700ms' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Utilization Rates</h2>
            <div className="flex items-center text-text-muted text-sm">
              <span className="inline-block w-3 h-3 bg-accent rounded-full mr-1"></span>
              <span>By Pool</span>
            </div>
          </div>
          <div className="h-80">
            {pools.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={utilizationData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 55, 72, 0.3)" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis 
                    stroke="#94a3b8"
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip formatter={(value: number) => `${value.toFixed(2)}%`} />} />
                  <Bar dataKey="value" name="Utilization Rate" radius={[4, 4, 0, 0]}>
                    {utilizationData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.value > 80 ? '#ff4d6d' : entry.value > 50 ? '#ffb300' : '#00ffa3'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-text-muted">No pool data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pools Table */}
      <div className={`card transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '800ms' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">All Pools</h2>
          <div className="badge badge-warning">Live Data</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left">Pool Name</th>
                <th className="px-4 py-3 text-left">Token Pair</th>
                <th className="px-4 py-3 text-right">TVL</th>
                <th className="px-4 py-3 text-right">Utilization</th>
                <th className="px-4 py-3 text-right">APY</th>
                <th className="px-4 py-3 text-right">24h Volume</th>
              </tr>
            </thead>
            <tbody>
              {pools.map((pool) => (
                <tr 
                  key={pool.poolAddress} 
                  className={`border-b border-border cursor-pointer hover:bg-card-hover transition-all duration-300 ${
                    selectedPool === pool.poolAddress ? 'bg-primary/5 border-primary/30' : ''
                  }`}
                  onClick={() => setSelectedPool(pool.poolAddress)}
                >
                  <td className="px-4 py-3">{pool.name}</td>
                  <td className="px-4 py-3">{pool.tokenA}/{pool.tokenB}</td>
                  <td className="px-4 py-3 text-right font-mono">{formatCurrency(pool.tvl)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`badge ${
                      pool.utilizationRate > 80 ? 'badge-danger' : 
                      pool.utilizationRate > 50 ? 'badge-warning' : 
                      'badge-success'
                    }`}>
                      {formatPercentage(pool.utilizationRate)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-success font-mono">{formatPercentage(pool.apy)}</td>
                  <td className="px-4 py-3 text-right font-mono">{formatCurrency(pool.volume24h)}</td>
                </tr>
              ))}
              {pools.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-center text-text-muted">
                    No pool data found 🏊‍♂️
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Fun message at the bottom */}
        <div className="mt-6 text-center text-text-muted text-sm italic">
          Just keep swimming, just keep swimming... 🐠
        </div>
      </div>
    </div>
  );
}