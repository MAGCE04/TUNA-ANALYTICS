import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Mock data for revenue trend
const data = [
  { date: 'Jan', revenue: 2400, expenses: 1400 },
  { date: 'Feb', revenue: 3000, expenses: 1500 },
  { date: 'Mar', revenue: 5000, expenses: 1700 },
  { date: 'Apr', revenue: 8100, expenses: 2000 },
  { date: 'May', revenue: 7200, expenses: 2100 },
  { date: 'Jun', revenue: 9000, expenses: 2400 },
  { date: 'Jul', revenue: 12000, expenses: 2800 },
];

export const RevenueChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" label={{ value: 'Month', position: 'insideBottomRight', offset: -10 }} />
        <YAxis label={{ value: 'Amount (SOL)', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value) => [`${value} SOL`, undefined]} />
        <Legend />
        <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="expenses" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
      </AreaChart>
    </ResponsiveContainer>
  );
};