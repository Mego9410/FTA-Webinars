"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RetentionChart } from "@/components/admin/RetentionChart";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  DashboardSummary,
  EmailFunnel,
  JoinBucket,
  RetentionPoint,
  SessionMetrics,
} from "@/lib/analytics";

type AnalyticsDashboardProps = {
  summary: DashboardSummary;
  sessions: SessionMetrics[];
  selectedSessionId: string | null;
  retention: RetentionPoint[];
  joinHistogram: JoinBucket[];
  emailFunnel: EmailFunnel;
  defaultFrom: string;
  defaultTo: string;
};

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

export function AnalyticsDashboard({
  summary,
  sessions,
  selectedSessionId,
  retention,
  joinHistogram,
  emailFunnel,
  defaultFrom,
  defaultTo,
}: AnalyticsDashboardProps) {
  const [from, setFrom] = useState(defaultFrom.slice(0, 10));
  const [to, setTo] = useState(defaultTo.slice(0, 10));

  const selected = useMemo(
    () => sessions.find((s) => s.id === selectedSessionId) ?? sessions[0] ?? null,
    [sessions, selectedSessionId],
  );

  return (
    <div className="fta-container space-y-10 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--fg-1)]">Analytics</h1>
          <p className="text-sm text-[var(--fg-3)]">First-party funnel and session engagement</p>
        </div>
        <Link href="/admin" className="text-sm font-bold text-[var(--gold-deep)] hover:underline">
          ← Sessions
        </Link>
      </div>

      <form className="flex flex-wrap items-end gap-3" method="get">
        <label className="space-y-1 text-sm">
          <span className="font-bold text-[var(--fg-1)]">From</span>
          <input className="field h-10" type="date" name="from" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-bold text-[var(--fg-1)]">To</span>
          <input className="field h-10" type="date" name="to" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
        <Button type="submit">Apply</Button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total users", value: summary.totalUsers },
          { label: "Signups (period)", value: summary.signupsInPeriod },
          { label: "Avg attendance %", value: `${summary.avgAttendanceRate}%` },
          { label: "Last session peak", value: summary.lastSessionPeakConcurrent },
        ].map((card) => (
          <div key={card.label} className="rounded-[var(--r-lg)] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-sm)]">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--fg-3)]">{card.label}</p>
            <p className="mt-2 text-2xl font-extrabold text-[var(--fg-1)]">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-[var(--r-lg)] border border-[var(--border)] bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Registrants</TableHead>
              <TableHead>Attendees</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>Avg watch</TableHead>
              <TableHead>Peak</TableHead>
              <TableHead>CTA %</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>{new Date(session.start_time).toLocaleDateString("en-GB")}</TableCell>
                <TableCell>{session.topic}</TableCell>
                <TableCell>{session.registrants}</TableCell>
                <TableCell>{session.attendees}</TableCell>
                <TableCell>{session.attendanceRate}%</TableCell>
                <TableCell>{formatDuration(session.avgWatchSec)}</TableCell>
                <TableCell>{session.peakConcurrent}</TableCell>
                <TableCell>{session.ctaRate}%</TableCell>
                <TableCell>
                  <Link href={`/admin/analytics?from=${from}&to=${to}&session=${session.id}`} className="text-sm font-bold text-[var(--gold-deep)]">
                    Detail
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selected ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[var(--r-lg)] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
            <h2 className="mb-4 font-bold text-[var(--fg-1)]">Retention — {selected.topic}</h2>
            <RetentionChart data={retention} />
          </div>
          <div className="rounded-[var(--r-lg)] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
            <h2 className="mb-4 font-bold text-[var(--fg-1)]">Join-time distribution</h2>
            <ul className="space-y-2 text-sm">
              {joinHistogram.length ? (
                joinHistogram.map((b) => (
                  <li key={b.bucket} className="flex justify-between border-b border-[var(--border)] py-2">
                    <span>{b.bucket}</span>
                    <span className="font-bold">{b.count}</span>
                  </li>
                ))
              ) : (
                <li className="text-[var(--fg-3)]">No join events yet</li>
              )}
            </ul>
          </div>
          <div className="rounded-[var(--r-lg)] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)] lg:col-span-2">
            <h2 className="mb-4 font-bold text-[var(--fg-1)]">Email funnel</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Sent", value: emailFunnel.sent },
                { label: "Delivered", value: emailFunnel.delivered },
                { label: "Opened", value: emailFunnel.opened },
                { label: "Clicked", value: emailFunnel.clicked },
              ].map((item) => (
                <div key={item.label} className="rounded-[var(--r-md)] bg-[var(--surface-2)] p-4 text-center">
                  <p className="text-xs font-bold uppercase text-[var(--fg-3)]">{item.label}</p>
                  <p className="mt-1 text-xl font-extrabold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
