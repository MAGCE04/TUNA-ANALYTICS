import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Mock data for protocol performance
const data = [
  { date: 'Jan', tvl: 1200, apy: 5.2 },
  { date: 'Feb', tvl: 1800, apy: 5.8 },
  { date: 'Mar', tvl: 2400, apy: 6.1 },
  { date: 'Apr', tvl: 3600, apy: 5.9 },
  { date: 'May', tvl: 4800, apy: 6.3 },
  { date: 'Jun', tvl: 5400, apy: 6.5 },
  { date: 'Jul', tvl: 6200, apy: 6.8 },
];

export const ProtocolPerformanceChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
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
        <YAxis yAxisId="left" label={{ value: 'TVL (SOL)', angle: -90, position: 'insideLeft' }} />
        <YAxis yAxisId="right" orientation="right" label={{ value: 'APY (%)', angle: 90, position: 'insideRight' }} />
        <Tooltip formatter={(value, name) => [
          name === 'tvl' ? `${value} SOL` : `${value}%`,
          name === 'tvl' ? 'TVL' : 'APY'
        ]} />
        <Legend />
        <Bar yAxisId="left" dataKey="tvl" fill="#8884d8" name="TVL" />
        <Line yAxisId="right" type="monotone" dataKey="apy" stroke="#ff7300" name="APY" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};