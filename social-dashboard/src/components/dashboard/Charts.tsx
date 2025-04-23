"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  TooltipProps,
} from 'recharts';

// Types
export interface ChartData {
  name: string;
  revenue: number;
  users: number;
  activeUsers: number;
  newPosts: number;
  activeNow: number;
}

export interface UserActivityData {
  hour: string;
  users: number;
}

interface RevenueChartProps {
  data: ChartData[];
}

interface UserActivityChartProps {
  data: UserActivityData[];
}

// Chart Components
export function RevenueChart({ data }: RevenueChartProps) {
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
          <XAxis 
            dataKey="name"
            tick={{ fill: '#666' }}
          />
          <YAxis
            tickFormatter={formatCurrency}
            ticks={[0, 1500, 3000, 4500, 6000]}
            tick={{ fill: '#666' }}
          />
          <Tooltip
            formatter={formatCurrency}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function UserActivityChart({ data }: UserActivityChartProps) {
  const formatUsers = (value: number) => `${value.toLocaleString()} users`;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
          <XAxis 
            dataKey="hour"
            tick={{ fill: '#666' }}
          />
          <YAxis 
            tick={{ fill: '#666' }}
          />
          <Tooltip
            formatter={formatUsers}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <Bar 
            dataKey="users" 
            fill="#82ca9d"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
