import { NextRequest, NextResponse } from "next/server";
import { signPlayback } from "@/lib/mux";
import { createServiceClient } from "@/lib/supabase/server";
import { getState } from "@/lib/time";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: session, error } = await supabase
    .from("sessions")
    .select("id, start_time, duration_seconds, mux_playback_id")
    .eq("id", sessionId)
    .maybeSingle();

  if (error || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (!session.mux_playback_id) {
    return NextResponse.json(
      { error: "No playback configured for this session" },
      { status: 400 },
    );
  }

  const startMs = new Date(session.start_time).getTime();
  const { state } = getState(
    Date.now(),
    startMs,
    session.duration_seconds,
  );

  if (state !== "during") {
    return NextResponse.json(
      { error: "Playback tokens are only available during the live window" },
      { status: 403 },
    );
  }

  try {
    const token = signPlayback(session.mux_playback_id);
    return NextResponse.json({ token });
  } catch {
    return NextResponse.json(
      { error: "Mux signing is not configured on the server" },
      { status: 503 },
    );
  }
}
