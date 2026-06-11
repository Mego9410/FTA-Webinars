"use client";

export const EVENT_TYPES = [
  "page_view",
  "signup",
  "join",
  "heartbeat",
  "cta_click",
  "leave",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export type TrackPayload = {
  session_id?: string;
  page?: "landing" | "webinar";
  offset_sec?: number;
};

export async function track(type: EventType, payload: TrackPayload = {}) {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, ...payload }),
      keepalive: type === "leave",
    });
  } catch {
    // Tracking must never block UX.
  }
}
