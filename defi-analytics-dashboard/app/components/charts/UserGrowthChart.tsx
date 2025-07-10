import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Mock data for user growth
const data = [
  { date: 'Jan', users: 4000 },
  { date: 'Feb', users: 5000 },
  { date: 'Mar', users: 6800 },
  { date: 'Apr', users: 7300 },
  { date: 'May', users: 9000 },
  { date: 'Jun', users: 10500 },
  { date: 'Jul', users: 11800 },
];

export const UserGrowthChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" label={{ value: 'Month', position: 'insideBottomRight', offset: -10 }} />
        <YAxis label={{ value: 'Users', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="users"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};