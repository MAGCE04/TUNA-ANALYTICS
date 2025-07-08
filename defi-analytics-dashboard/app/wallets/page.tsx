'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useTopWalletsData } from '../hooks/useTopWalletsData';
import { formatCurrency } from '../lib/utils';

export default function WalletsPage() {
  const {
    topWallets,
    isLoading,
    error,
    limit,
    lastUpdated,
    setLimit,
  } = useTopWalletsData();

  // Colors for charts
  const COLORS = ['#6366f1', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#8b5cf6', '#0ea5e9'];

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

  // Prepare data for favorite token chart
  const tokenData = topWallets.reduce((acc, wallet) => {
    if (wallet.favoriteToken) {
      const token = wallet.favoriteToken;
      if (!acc[token]) {
        acc[token] = { name: token, count: 0 };
      }
      acc[token].count++;
    }
    return acc;
  }, {} as Record<string, { name: string, count: number }>);

  const favoriteTokenData = Object.values(tokenData).sort((a, b) => b.count - a.count);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Top Wallet Leaderboard</h1>
        <p className="text-text-muted mt-1">
          Last updated: {format(lastUpdated, 'MMM d, yyyy HH:mm')}
        </p>
      </div>

      {/* Limit Selector */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Show top:</label>
          <select 
            className="select"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value, 10))}
          >
            <option value="5">5 wallets</option>
            <option value="10">10 wallets</option>
            <option value="20">20 wallets</option>
            <option value="50">50 wallets</option>
          </select>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Trade Volume Chart */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Trade Volume by Wallet</h2>
          <div className="h-80">
            {topWallets.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topWallets.slice(0, 10)} // Only show top 10 in chart
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis 
                    type="category" 
                    dataKey="shortAddress" 
                    stroke="#94a3b8" 
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Volume']}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                  />
                  <Bar dataKey="tradeVolume" name="Trade Volume">
                    {topWallets.slice(0, 10).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-text-muted">No wallet data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Favorite Token Distribution */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Favorite Token Distribution</h2>
          <div className="h-80">
            {favoriteTokenData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={favoriteTokenData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {favoriteTokenData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value.toString(), 'Wallets']}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-text-muted">No token data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Wallets Table */}
      <div className="card">
        <h2 className="text-lg font-bold mb-4">Top Wallets Leaderboard</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-2 text-left">Rank</th>
                <th className="px-4 py-2 text-left">Wallet</th>
                <th className="px-4 py-2 text-right">Trade Volume</th>
                <th className="px-4 py-2 text-right">Trade Count</th>
                <th className="px-4 py-2 text-right">Favorite Token</th>
                <th className="px-4 py-2 text-right">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {topWallets.map((wallet, index) => (
                <tr key={wallet.address} className="border-b border-border">
                  <td className="px-4 py-2">#{index + 1}</td>
                  <td className="px-4 py-2">{wallet.shortAddress}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(wallet.tradeVolume)}</td>
                  <td className="px-4 py-2 text-right">{wallet.tradeCount.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">{wallet.favoriteToken || 'N/A'}</td>
                  <td className="px-4 py-2 text-right">
                    {format(new Date(wallet.lastActive), 'MMM d, yyyy')}
                  </td>
                </tr>
              ))}
              {topWallets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-2 text-center text-text-muted">
                    No wallet data found
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