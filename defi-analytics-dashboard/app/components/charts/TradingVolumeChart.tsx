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

// Mock data for trading volume
const data = [
  { date: 'Jan', volume: 3200, orders: 240 },
  { date: 'Feb', volume: 4500, orders: 320 },
  { date: 'Mar', volume: 6200, orders: 410 },
  { date: 'Apr', volume: 7800, orders: 480 },
  { date: 'May', volume: 9100, orders: 550 },
  { date: 'Jun', volume: 10500, orders: 620 },
  { date: 'Jul', volume: 12800, orders: 710 },
];

export const TradingVolumeChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
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
        <YAxis label={{ value: 'Volume (SOL)', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value) => [`${value} SOL`, undefined]} />
        <Legend />
        <Bar dataKey="volume" fill="#8884d8" name="Trading Volume" />
        <Bar dataKey="orders" fill="#82ca9d" name="Order Count" />
      </BarChart>
    </ResponsiveContainer>
  );
};