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

const engagementData = [
  { date: '2024-01', total: 4000 },
  { date: '2024-02', total: 3000 },
  { date: '2024-03', total: 2000 },
  { date: '2024-04', total: 2780 },
  { date: '2024-05', total: 1890 },
  { date: '2024-06', total: 2390 },
  { date: '2024-07', total: 3490 },
];

const platformColors = {
  twitter: '#1DA1F2',
  instagram: '#E4405F',
  linkedin: '#0A66C2',
  youtube: '#FF0000',
  tiktok: '#000000',
  pinterest: '#E60023',
} as const;

const followerGrowthData = [
  { month: 'Jan', twitter: 1200, instagram: 900, linkedin: 600, youtube: 800, tiktok: 1100, pinterest: 400 },
  { month: 'Feb', twitter: 1800, instagram: 1500, linkedin: 900, youtube: 1200, tiktok: 1600, pinterest: 700 },
  { month: 'Mar', twitter: 2200, instagram: 2100, linkedin: 1400, youtube: 1800, tiktok: 2200, pinterest: 1100 },
  { month: 'Apr', twitter: 2800, instagram: 2600, linkedin: 1800, youtube: 2300, tiktok: 2900, pinterest: 1500 },
  { month: 'May', twitter: 3500, instagram: 3200, linkedin: 2300, youtube: 2900, tiktok: 3500, pinterest: 1900 },
  { month: 'Jun', twitter: 4200, instagram: 3800, linkedin: 2800, youtube: 3400, tiktok: 4200, pinterest: 2400 },
  { month: 'Jul', twitter: 4800, instagram: 4300, linkedin: 3200, youtube: 3900, tiktok: 4800, pinterest: 2800 },
  { month: 'Aug', twitter: 5300, instagram: 4700, linkedin: 3600, youtube: 4300, tiktok: 5300, pinterest: 3200 },
  { month: 'Sep', twitter: 5800, instagram: 5100, linkedin: 4000, youtube: 4800, tiktok: 5700, pinterest: 3600 },
  { month: 'Oct', twitter: 5500, instagram: 4800, linkedin: 3800, youtube: 4500, tiktok: 5400, pinterest: 3400 },
  { month: 'Nov', twitter: 5900, instagram: 5200, linkedin: 4200, youtube: 4900, tiktok: 5800, pinterest: 3800 },
  { month: 'Dec', twitter: 6000, instagram: 5500, linkedin: 4500, youtube: 5200, tiktok: 6000, pinterest: 4000 },
];

const platformPerformanceData = [
  { platform: 'Twitter', followers: 6000 },
  { platform: 'Instagram', followers: 5500 },
  { platform: 'LinkedIn', followers: 4500 },
  { platform: 'YouTube', followers: 5200 },
  { platform: 'TikTok', followers: 6000 },
  { platform: 'Pinterest', followers: 4000 },
];

const followersPieData = [
  { name: 'Followers', value: 31200 },
  { name: 'Non-Followers', value: 68800 },
];

const COLORS = ['#0088FE', '#CCCCCC'];

export default function Charts() {
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
