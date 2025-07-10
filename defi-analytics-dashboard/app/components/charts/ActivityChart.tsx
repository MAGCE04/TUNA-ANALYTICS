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

// Mock data for activity per day
const data = [
  { day: 'Mon', trades: 120, orders: 80 },
  { day: 'Tue', trades: 150, orders: 100 },
  { day: 'Wed', trades: 180, orders: 120 },
  { day: 'Thu', trades: 200, orders: 140 },
  { day: 'Fri', trades: 250, orders: 160 },
  { day: 'Sat', trades: 180, orders: 120 },
  { day: 'Sun', trades: 100, orders: 70 },
];

export const ActivityChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" label={{ value: 'Day of Week', position: 'insideBottomRight', offset: -10 }} />
        <YAxis label={{ value: 'Number of Activities', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="trades" fill="#8884d8" name="Trades" />
        <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
      </BarChart>
    </ResponsiveContainer>
  );
};