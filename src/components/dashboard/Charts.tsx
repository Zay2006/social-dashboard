"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { useEffect, useState } from 'react';
import {
  generateRandomEngagementData,
  generateRandomFollowerGrowthData,
  generateRandomPlatformPerformance
} from '@/lib/data/generators';

const platformColors = {
  twitter: '#1DA1F2',
  instagram: '#E4405F',
  linkedin: '#0A66C2',
  youtube: '#FF0000',
  tiktok: '#000000',
  pinterest: '#E60023',
} as const;

const COLORS = ['#0088FE', '#CCCCCC'];

export default function Charts() {
  const [engagementData, setEngagementData] = useState(generateRandomEngagementData());
  const [followerGrowthData, setFollowerGrowthData] = useState(generateRandomFollowerGrowthData());
  const [platformPerformanceData, setPlatformPerformanceData] = useState(generateRandomPlatformPerformance());
  const [followersPieData, setFollowersPieData] = useState([
    { name: 'Followers', value: Math.floor(Math.random() * 50000) + 20000 },
    { name: 'Non-Followers', value: Math.floor(Math.random() * 100000) + 50000 },
  ]);

  useEffect(() => {
    // Update data every minute
    const interval = setInterval(() => {
      setEngagementData(generateRandomEngagementData());
      setFollowerGrowthData(generateRandomFollowerGrowthData());
      setPlatformPerformanceData(generateRandomPlatformPerformance());
      setFollowersPieData([
        { name: 'Followers', value: Math.floor(Math.random() * 50000) + 20000 },
        { name: 'Non-Followers', value: Math.floor(Math.random() * 100000) + 50000 },
      ]);
    }, 60000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Engagement Overview</CardTitle>
          <CardDescription>Total engagement across all platforms</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={engagementData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audience Reach</CardTitle>
          <CardDescription>Percentage of total potential audience reached</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={followersPieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {followersPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Follower Growth</CardTitle>
          <CardDescription>Year-to-date follower growth by platform</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={followerGrowthData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 6000]} ticks={[0, 1500, 3000, 4500, 6000]} />
              <Tooltip />
              <Legend />
              {Object.keys(platformColors).map((platform) => (
                <Area
                  key={platform}
                  type="monotone"
                  dataKey={platform}
                  stroke={platformColors[platform as keyof typeof platformColors]}
                  fill={platformColors[platform as keyof typeof platformColors]}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription>Current follower count by platform</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={platformPerformanceData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="followers" fill="#8884d8">
                {platformPerformanceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={platformColors[entry.platform.toLowerCase() as keyof typeof platformColors]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
