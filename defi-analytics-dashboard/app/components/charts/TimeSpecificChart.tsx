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

// Mock data for different time periods
const data7d = [
  { date: 'Mon', revenue: 2400, expenses: 1400 },
  { date: 'Tue', revenue: 3000, expenses: 1500 },
  { date: 'Wed', revenue: 3500, expenses: 1600 },
  { date: 'Thu', revenue: 4200, expenses: 1700 },
  { date: 'Fri', revenue: 4800, expenses: 1800 },
  { date: 'Sat', revenue: 5500, expenses: 1900 },
  { date: 'Sun', revenue: 6000, expenses: 2000 },
];

const data30d = [
  { date: 'Week 1', revenue: 12000, expenses: 6000 },
  { date: 'Week 2', revenue: 15000, expenses: 7000 },
  { date: 'Week 3', revenue: 18000, expenses: 8000 },
  { date: 'Week 4', revenue: 22000, expenses: 9000 },
];

const data90d = [
  { date: 'Jan', revenue: 30000, expenses: 15000 },
  { date: 'Feb', revenue: 40000, expenses: 18000 },
  { date: 'Mar', revenue: 50000, expenses: 22000 },
];

interface TimeSpecificChartProps {
  timeRange: '7d' | '30d' | '90d';
  title: string;
}

export const TimeSpecificChart: React.FC<TimeSpecificChartProps> = ({ timeRange, title }) => {
  // Select the appropriate data based on the time range
  const chartData = timeRange === '7d' ? data7d : timeRange === '30d' ? data30d : data90d;
  
  // Customize the X-axis label based on the time range
  const xAxisLabel = timeRange === '7d' ? 'Day' : timeRange === '30d' ? 'Week' : 'Month';
  
  return (
    <div className="card mb-6">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" label={{ value: xAxisLabel, position: 'insideBottomRight', offset: -10 }} />
            <YAxis label={{ value: 'Amount (SOL)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => [`${value} SOL`, undefined]} />
            <Legend />
            <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" />
            <Area type="monotone" dataKey="expenses" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};