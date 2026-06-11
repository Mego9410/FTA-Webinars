"use client";

import { useCallback, useEffect, useState } from "react";
import { adminLogout } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FtaAdminTabs } from "@/components/fta/FtaAdminTabs";
import { FtaCard } from "@/components/fta/FtaCard";

type Session = {
  id: string;
  topic: string;
  description: string | null;
  host_name: string;
  start_time: string;
  duration_seconds: number;
  mux_playback_id: string | null;
  cta_label: string | null;
  cta_url: string | null;
};

const emptyForm = {
  topic: "",
  description: "",
  host_name: "Frank Taylor",
  start_time: "",
  duration_seconds: "3600",
  mux_playback_id: "",
  cta_label: "",
  cta_url: "",
};

function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function SessionManager() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadSessions = useCallback(async () => {
    const res = await fetch("/api/admin/session");
    const data = (await res.json()) as { sessions?: Session[]; error?: string };
    if (res.ok && data.sessions) {
      setSessions(data.sessions);
    } else {
      setError(data.error ?? "Could not load sessions");
    }
  }, []);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function startEdit(session: Session) {
    setEditingId(session.id);
    setForm({
      topic: session.topic,
      description: session.description ?? "",
      host_name: session.host_name,
      start_time: toLocalInputValue(session.start_time),
      duration_seconds: String(session.duration_seconds),
      mux_playback_id: session.mux_playback_id ?? "",
      cta_label: session.cta_label ?? "",
      cta_url: session.cta_url ?? "",
    });
    setMessage(null);
    setError(null);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const payload = {
      ...(editingId ? { id: editingId } : {}),
      topic: form.topic,
      description: form.description || null,
      host_name: form.host_name,
      start_time: new Date(form.start_time).toISOString(),
      duration_seconds: Number(form.duration_seconds) || 3600,
      mux_playback_id: form.mux_playback_id || null,
      cta_label: form.cta_label || null,
      cta_url: form.cta_url || null,
    };

    const res = await fetch("/api/admin/session", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as { error?: string };

    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Save failed");
      return;
    }

    setMessage(editingId ? "Session updated" : "Session created");
    resetForm();
    await loadSessions();
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-6 py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <h1 className="font-display text-3xl font-bold text-fta-ink">Session admin</h1>
          <p className="text-sm text-fta-muted">Create and edit webinar sessions</p>
          <FtaAdminTabs />
        </div>
        <form action={adminLogout} className="w-full sm:w-auto">
          <Button type="submit" variant="outline-ink" className="w-full sm:w-auto">
            Sign out
          </Button>
        </form>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid gap-4 rounded-card border border-fta-border bg-fta-bg p-6 shadow-card md:grid-cols-2 md:p-8"
      >
        <div className="md:col-span-2">
          <h2 className="font-bold text-[var(--fg-1)]">
            {editingId ? "Edit session" : "New session"}
          </h2>
        </div>

        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input id="topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="host_name">Host</Label>
          <Input id="host_name" value={form.host_name} onChange={(e) => setForm({ ...form, host_name: e.target.value })} required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="start_time">Start time</Label>
          <Input id="start_time" type="datetime-local" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration_seconds">Duration (seconds)</Label>
          <Input id="duration_seconds" type="number" value={form.duration_seconds} onChange={(e) => setForm({ ...form, duration_seconds: e.target.value })} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="mux_playback_id">Mux playback ID</Label>
          <Input id="mux_playback_id" value={form.mux_playback_id} onChange={(e) => setForm({ ...form, mux_playback_id: e.target.value })} placeholder="Add after uploading to Mux" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cta_label">CTA label</Label>
          <Input id="cta_label" value={form.cta_label} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} placeholder="Download our Exit Readiness Planner" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cta_url">CTA URL</Label>
          <Input id="cta_url" value={form.cta_url} onChange={(e) => setForm({ ...form, cta_url: e.target.value })} placeholder="https://…" />
        </div>

        {error ? <p className="md:col-span-2 text-sm text-red-700" role="alert">{error}</p> : null}
        {message ? <p className="md:col-span-2 text-sm text-[var(--available-fg)]" role="status">{message}</p> : null}

        <div className="flex gap-2 md:col-span-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : editingId ? "Update session" : "Create session"}
          </Button>
          {editingId ? (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel edit
            </Button>
          ) : null}
        </div>
      </form>

      <FtaCard className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Start</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Host</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="whitespace-nowrap text-sm">
                  {new Date(session.start_time).toLocaleString("en-GB")}
                </TableCell>
                <TableCell>{session.topic}</TableCell>
                <TableCell>{session.host_name}</TableCell>
                <TableCell>{Math.round(session.duration_seconds / 60)} min</TableCell>
                <TableCell>
                  <Button type="button" variant="ghost" size="sm" onClick={() => startEdit(session)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </FtaCard>
    </div>
  );
}
