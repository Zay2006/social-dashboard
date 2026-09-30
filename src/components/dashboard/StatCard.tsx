import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatNumber, formatSignedPercent } from "@/lib/format";

interface StatCardProps {
  label: string;
  value: number;
  /** Percentage movement since the previous refresh, or null on first load. */
  delta: number | null;
}

export function StatCard({ label, value, delta }: StatCardProps) {
  const improving = delta !== null && delta >= 0;
  const Icon = improving ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold tabular-nums">{formatNumber(value)}</p>
        {delta === null ? (
          <p className="mt-1 text-xs text-muted-foreground">Awaiting next refresh</p>
        ) : (
          <p
            className={cn(
              "mt-1 flex items-center gap-1 text-xs font-medium",
              // 600-weight greens and reds fail contrast on white, so the
              // accessible token/700 shades are used instead.
              improving ? "text-success" : "text-destructive",
            )}
          >
            <Icon className="h-3 w-3" aria-hidden="true" />
            <span>{formatSignedPercent(delta)} from last refresh</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
