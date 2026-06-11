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
      <p className="text-sm text-[var(--fg-3)]">No heartbeat data for this session yet.</p>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="minute" tick={{ fontSize: 12 }} label={{ value: "Minute", position: "insideBottom", offset: -2 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="viewers" stroke="#E4AD25" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
