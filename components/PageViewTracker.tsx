"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

type PageViewTrackerProps = {
  page: "landing" | "webinar";
  sessionId?: string;
};

export function PageViewTracker({ page, sessionId }: PageViewTrackerProps) {
  useEffect(() => {
    void track("page_view", { page, session_id: sessionId });
  }, [page, sessionId]);

  return null;
}
