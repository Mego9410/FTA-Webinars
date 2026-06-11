"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RetentionPoint } from "@/lib/analytics";

type RetentionChartProps = {
  data: RetentionPoint[];
};

export function RetentionChart({ data }: RetentionChartProps) {
  if (!data.length) {
    return (
      <p className="text-sm text-fta-muted">No heartbeat data for this session yet.</p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid stroke="var(--fta-border)" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="minute"
            tick={{ fontSize: 12, fill: "var(--fta-muted)" }}
            axisLine={{ stroke: "var(--fta-border)" }}
            tickLine={false}
            label={{
              value: "Minute",
              position: "insideBottom",
              offset: -2,
              fill: "var(--fta-muted)",
              fontSize: 12,
            }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "var(--fta-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "var(--radius-card)",
              border: "1px solid var(--fta-border)",
              boxShadow: "var(--shadow-card)",
              fontSize: 13,
            }}
          />
          <Line
            type="monotone"
            dataKey="viewers"
            stroke="var(--fta-gold)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: "var(--fta-gold)", stroke: "var(--fta-ink)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
