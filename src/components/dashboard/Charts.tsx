"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PLATFORMS, PLATFORM_LIST } from "@/lib/platforms";
import { useTheme } from "@/lib/theme/ThemeContext";
import { formatCompactNumber, formatNumber } from "@/lib/format";
import { followerGrowthCeiling, type DashboardSeries } from "@/lib/data/metrics";

interface ChartsProps {
  series: DashboardSeries;
}

/**
 * Recharts writes colours as SVG presentation attributes, which cannot resolve
 * `var(--token)`, so the palette has to be selected in JavaScript from the
 * resolved theme rather than inherited from CSS.
 */
function useChartPalette() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  return {
    dark,
    accent: dark ? "#818cf8" : "#4f46e5",
    reached: dark ? "#818cf8" : "#4f46e5",
    remaining: dark ? "#3f3f46" : "#d4d4d8",
    tooltip: {
      backgroundColor: dark ? "hsl(240 6% 8%)" : "#ffffff",
      border: `1px solid ${dark ? "hsl(240 3.7% 18%)" : "hsl(240 5.9% 90%)"}`,
      borderRadius: "0.5rem",
      color: dark ? "hsl(0 0% 98%)" : "hsl(240 10% 3.9%)",
      fontSize: "0.8125rem",
    } satisfies React.CSSProperties,
    platform: (id: keyof typeof PLATFORMS) => PLATFORMS[id].chartColor[dark ? "dark" : "light"],
  };
}

const AXIS_MARGIN = { top: 8, right: 16, left: 0, bottom: 0 };

export function Charts({ series }: ChartsProps) {
  const palette = useChartPalette();
  const growthCeiling = followerGrowthCeiling(series.followerGrowth);
  const { followers, total } = series.audienceReach;
  const reachPercent = Math.round((followers / total) * 100);

  const reachData = [
    { name: "Reached", value: followers },
    { name: "Not yet reached", value: Math.max(0, total - followers) },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Engagement Overview</CardTitle>
          <CardDescription>Total monthly engagement across all platforms</CardDescription>
        </CardHeader>
        <CardContent className="chart-surface h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={series.engagement}
              margin={AXIS_MARGIN}
              accessibilityLayer
              title="Engagement Overview"
              desc={`Monthly engagement from ${series.engagement[0]?.month} to ${
                series.engagement[series.engagement.length - 1]?.month
              }.`}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} />
              <YAxis tickFormatter={formatCompactNumber} tickLine={false} width={44} />
              <Tooltip
                contentStyle={palette.tooltip}
                formatter={(value: number) => [formatNumber(value), "Engagements"]}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke={palette.accent}
                fill={palette.accent}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Audience Reach</CardTitle>
          <CardDescription>
            {formatNumber(followers)} of {formatNumber(total)} addressable accounts reached
          </CardDescription>
        </CardHeader>
        <CardContent className="chart-surface relative h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={reachData}
                cx="50%"
                cy="50%"
                innerRadius={72}
                outerRadius={96}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
                isAnimationActive={false}
              >
                {reachData.map((slice) => (
                  <Cell
                    key={slice.name}
                    fill={slice.name === "Reached" ? palette.reached : palette.remaining}
                    aria-label={`${slice.name}: ${formatNumber(slice.value)}`}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={palette.tooltip}
                formatter={(value: number, name) => [formatNumber(value), name]}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* A centred label reads better than per-slice labels, which
              overflowed the card at narrow widths. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          >
            <span className="text-3xl font-bold tabular-nums">{reachPercent}%</span>
            <span className="text-xs text-muted-foreground">reached</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Follower Growth</CardTitle>
          <CardDescription>Cumulative followers by platform, year to date</CardDescription>
        </CardHeader>
        <CardContent className="chart-surface h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            {/* Lines rather than six translucent overlapping areas, which were
                unreadable, and an axis domain derived from the data instead of a
                hardcoded 6000 that clipped the taller series. */}
            <LineChart
              data={series.followerGrowth}
              margin={AXIS_MARGIN}
              accessibilityLayer
              title="Follower Growth"
              desc="Cumulative follower count per platform for each month of the year."
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} />
              <YAxis
                domain={[0, growthCeiling]}
                tickFormatter={formatCompactNumber}
                tickLine={false}
                width={44}
              />
              <Tooltip
                contentStyle={palette.tooltip}
                formatter={(value: number, name) => [
                  formatNumber(value),
                  PLATFORMS[name as keyof typeof PLATFORMS]?.label ?? name,
                ]}
              />
              <Legend
                formatter={(value) => PLATFORMS[value as keyof typeof PLATFORMS]?.label ?? value}
              />
              {PLATFORM_LIST.map((platform) => (
                <Line
                  key={platform.id}
                  type="monotone"
                  dataKey={platform.id}
                  stroke={palette.platform(platform.id)}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Platform Performance</CardTitle>
          <CardDescription>Current follower count by platform</CardDescription>
        </CardHeader>
        <CardContent className="chart-surface h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={series.platformPerformance}
              margin={{ ...AXIS_MARGIN, bottom: 8 }}
              accessibilityLayer
              title="Platform Performance"
              desc="Current follower count for each connected platform."
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="platform"
                // interval={0} stops Recharts from silently dropping labels when
                // the card is narrow, which left half the bars unlabelled.
                interval={0}
                tickLine={false}
                tickFormatter={(value: string) =>
                  PLATFORMS[value as keyof typeof PLATFORMS]?.label ?? value
                }
                tick={{ fontSize: 11 }}
              />
              <YAxis tickFormatter={formatCompactNumber} tickLine={false} width={44} />
              <Tooltip
                contentStyle={palette.tooltip}
                formatter={(value: number) => [formatNumber(value), "Followers"]}
                labelFormatter={(value: string) =>
                  PLATFORMS[value as keyof typeof PLATFORMS]?.label ?? value
                }
              />
              <Bar dataKey="followers" radius={[4, 4, 0, 0]}>
                {series.platformPerformance.map((entry) => (
                  <Cell key={entry.platform} fill={palette.platform(entry.platform)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
