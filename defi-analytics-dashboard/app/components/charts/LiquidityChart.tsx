import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Mock data for asset distribution
const data = [
  { asset: 'SOL', amount: 4000 },
  { asset: 'USDC', amount: 3000 },
  { asset: 'ETH', amount: 2000 },
  { asset: 'BTC', amount: 2780 },
  { asset: 'BONK', amount: 1890 },
  { asset: 'RAY', amount: 2390 },
  { asset: 'USDT', amount: 3490 },
];

export const LiquidityChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{
          top: 5,
          right: 30,
          left: 60,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" label={{ value: 'Amount (USD)', position: 'insideBottom', offset: -5 }} />
        <YAxis dataKey="asset" type="category" label={{ value: 'Asset', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
        <Legend />
        <Bar dataKey="amount" fill="#8884d8" name="Amount (USD)" />
      </BarChart>
    </ResponsiveContainer>
  );
};