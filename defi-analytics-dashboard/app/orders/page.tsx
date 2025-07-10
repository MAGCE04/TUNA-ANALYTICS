'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { useLimitOrdersData } from '../hooks/useLimitOrdersData';
import { formatCurrency, formatPercentage } from '../lib/utils';
import { ActivityChart } from '../components/charts/ActivityChart';

export default function OrdersPage() {
  const {
    orders,
    ordersByPair,
    stats,
    isLoading,
    error,
    selectedPair,
    selectedStatus,
    availablePairs,
    lastUpdated,
    setSelectedPair,
    setSelectedStatus,
    fillRate,
  } = useLimitOrdersData();

  // Colors for charts
  const COLORS = ['#6366f1', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];
  const STATUS_COLORS = {
    open: '#10b981',
    filled: '#6366f1',
    canceled: '#ef4444',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="card bg-red-900/20 border border-red-800">
          <h2 className="text-xl font-bold text-red-400">Error</h2>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // Prepare data for status pie chart
  const statusData = [
    { name: 'Open', value: stats.openOrders },
    { name: 'Filled', value: stats.filledOrders },
    { name: 'Canceled', value: stats.canceledOrders },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Limit Orders Monitor</h1>
        <p className="text-text-muted mt-1">
          Last updated: {format(lastUpdated, 'MMM d, yyyy HH:mm')}
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Trading Pair</label>
            <select 
              className="select w-full"
              value={selectedPair || ''}
              onChange={(e) => setSelectedPair(e.target.value || null)}
            >
              <option value="">All Pairs</option>
              {availablePairs.map((pair) => (
                <option key={pair} value={pair}>{pair}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Order Status</label>
            <div className="flex flex-wrap gap-2">
              <button
                className={`btn text-sm ${selectedStatus === null ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedStatus(null)}
              >
                All
              </button>
              <button
                className={`btn text-sm ${selectedStatus === 'open' ? 'btn-primary' : 'btn-outline'}`}
                style={{ backgroundColor: selectedStatus === 'open' ? STATUS_COLORS.open : 'transparent' }}
                onClick={() => setSelectedStatus('open')}
              >
                Open
              </button>
              <button
                className={`btn text-sm ${selectedStatus === 'filled' ? 'btn-primary' : 'btn-outline'}`}
                style={{ backgroundColor: selectedStatus === 'filled' ? STATUS_COLORS.filled : 'transparent' }}
                onClick={() => setSelectedStatus('filled')}
              >
                Filled
              </button>
              <button
                className={`btn text-sm ${selectedStatus === 'canceled' ? 'btn-primary' : 'btn-outline'}`}
                style={{ backgroundColor: selectedStatus === 'canceled' ? STATUS_COLORS.canceled : 'transparent' }}
                onClick={() => setSelectedStatus('canceled')}
              >
                Canceled
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <h3 className="text-sm font-medium text-text-muted">Total Orders</h3>
          <p className="text-2xl font-bold mt-2">{stats.totalOrders.toLocaleString()}</p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-text-muted">Open Orders</h3>
          <p className="text-2xl font-bold mt-2 text-success">{stats.openOrders.toLocaleString()}</p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-text-muted">Fill Rate</h3>
          <p className="text-2xl font-bold mt-2 text-primary">{formatPercentage(fillRate)}</p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-text-muted">Total Volume</h3>
          <p className="text-2xl font-bold mt-2">{formatCurrency(stats.totalVolume)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Order Status Distribution */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Order Status Distribution</h2>
          <div className="h-80">
            {statusData.some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell key="open" fill={STATUS_COLORS.open} />
                    <Cell key="filled" fill={STATUS_COLORS.filled} />
                    <Cell key="canceled" fill={STATUS_COLORS.canceled} />
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString(), 'Orders']}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-text-muted">No data available for the selected filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Trading Pair Distribution */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Trading Pair Distribution</h2>
          <div className="h-80">
            <ActivityChart />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <h2 className="text-lg font-bold mb-4">
          {selectedStatus ? `${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Orders` : 'All Orders'}
          {selectedPair ? ` - ${selectedPair}` : ''}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-2 text-left">Pair</th>
                <th className="px-4 py-2 text-left">Side</th>
                <th className="px-4 py-2 text-right">Price</th>
                <th className="px-4 py-2 text-right">Size</th>
                <th className="px-4 py-2 text-right">USD Value</th>
                <th className="px-4 py-2 text-right">Status</th>
                <th className="px-4 py-2 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((order) => (
                <tr key={order.orderId} className="border-b border-border">
                  <td className="px-4 py-2">{order.pair}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.side === 'buy' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                    }`}>
                      {order.side.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">{order.price.toFixed(4)}</td>
                  <td className="px-4 py-2 text-right">{order.size.toFixed(4)}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(order.usdValue)}</td>
                  <td className="px-4 py-2 text-right">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.status === 'open' ? 'bg-green-900/30 text-green-400' : 
                      order.status === 'filled' ? 'bg-blue-900/30 text-blue-400' : 
                      'bg-red-900/30 text-red-400'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    {format(new Date(order.timestamp), 'MMM d, HH:mm')}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-2 text-center text-text-muted">
                    No orders found matching the selected filters
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