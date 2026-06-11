import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/server";

type SessionPayload = {
  id?: string;
  topic?: string;
  description?: string | null;
  host_name?: string;
  start_time?: string;
  duration_seconds?: number;
  mux_playback_id?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
};

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .order("start_time", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ sessions: data });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as SessionPayload;
  if (!body.topic?.trim() || !body.host_name?.trim() || !body.start_time) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("sessions")
    .insert({
      topic: body.topic.trim(),
      description: body.description ?? null,
      host_name: body.host_name.trim(),
      start_time: body.start_time,
      duration_seconds: body.duration_seconds ?? 3600,
      mux_playback_id: body.mux_playback_id ?? null,
      cta_label: body.cta_label ?? null,
      cta_url: body.cta_url ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: data });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as SessionPayload;
  if (!body.id) {
    return NextResponse.json({ error: "Missing session id" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("sessions")
    .update({
      topic: body.topic,
      description: body.description,
      host_name: body.host_name,
      start_time: body.start_time,
      duration_seconds: body.duration_seconds,
      mux_playback_id: body.mux_playback_id,
      cta_label: body.cta_label,
      cta_url: body.cta_url,
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: data });
}
