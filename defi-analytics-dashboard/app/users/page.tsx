'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, PieChart, Pie, Cell
} from 'recharts';
import { useUserActivityData } from '../hooks/useUserActivityData';
import { formatPercentage } from '../lib/utils';
import { UserGrowthChart } from '../components/charts/UserGrowthChart';

export default function UsersPage() {
  const {
    userActivity,
    metrics,
    isLoading,
    error,
    timeRange,
    lastUpdated,
    setTimeRange,
    totalUniqueUsers,
    newUserGrowthRate,
  } = useUserActivityData();

  // Colors for charts
  const COLORS = ['#6366f1', '#10b981'];

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

  // Prepare data for user type pie chart
  const userTypeData = [
    { name: 'New Users', value: userActivity.reduce((sum, day) => sum + day.newUsers, 0) },
    { name: 'Returning Users', value: userActivity.reduce((sum, day) => sum + day.returningUsers, 0) },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">User Activity Dashboard</h1>
        <p className="text-text-muted mt-1">
          Last updated: {format(lastUpdated, 'MMM d, yyyy HH:mm')}
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
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

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <h3 className="text-sm font-medium text-text-muted">Daily Active Users (DAU)</h3>
          <p className="text-2xl font-bold mt-2">{metrics.dau.toLocaleString()}</p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-text-muted">Weekly Active Users (WAU)</h3>
          <p className="text-2xl font-bold mt-2">{metrics.wau.toLocaleString()}</p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-text-muted">Monthly Active Users (MAU)</h3>
          <p className="text-2xl font-bold mt-2">{metrics.mau.toLocaleString()}</p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-text-muted">Retention Rate</h3>
          <p className="text-2xl font-bold mt-2">{formatPercentage(metrics.retentionRate)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Daily Active Users Chart */}
        <div className="card lg:col-span-2">
          <h2 className="text-lg font-bold mb-4">Daily Active Users</h2>
          <div className="h-80">
            <UserGrowthChart />
          </div>
        </div>

        {/* User Type Distribution */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4">User Type Distribution</h2>
          <div className="h-80">
            {userTypeData.some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell key="new" fill={COLORS[0]} />
                    <Cell key="returning" fill={COLORS[1]} />
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString(), 'Users']}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                  />
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

      {/* New vs Returning Users Chart */}
      <div className="card mb-8">
        <h2 className="text-lg font-bold mb-4">New vs Returning Users</h2>
        <div className="h-80">
          {userActivity.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userActivity}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#94a3b8"
                  tickFormatter={(timestamp) => format(new Date(timestamp), 'MMM d')}
                />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  formatter={(value: number) => [value.toLocaleString(), 'Users']}
                  labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                />
                <Legend />
                <Bar dataKey="newUsers" name="New Users" stackId="a" fill="#6366f1" />
                <Bar dataKey="returningUsers" name="Returning Users" stackId="a" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-text-muted">No data available for the selected time range</p>
            </div>
          )}
        </div>
      </div>

      {/* User Activity Table */}
      <div className="card">
        <h2 className="text-lg font-bold mb-4">Daily User Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-right">Unique Users</th>
                <th className="px-4 py-2 text-right">New Users</th>
                <th className="px-4 py-2 text-right">Returning Users</th>
                <th className="px-4 py-2 text-right">Total Transactions</th>
              </tr>
            </thead>
            <tbody>
              {userActivity.slice(0, 10).map((day) => (
                <tr key={day.timestamp} className="border-b border-border">
                  <td className="px-4 py-2">
                    {format(new Date(day.timestamp), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-2 text-right">{day.uniqueUsers.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">{day.newUsers.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">{day.returningUsers.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">{day.totalTransactions.toLocaleString()}</td>
                </tr>
              ))}
              {userActivity.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-center text-text-muted">
                    No user activity data found
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