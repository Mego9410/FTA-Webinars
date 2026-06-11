# FTA Webinar Platform — Cursor Build Spec

A platform that streams **pre-recorded webinars as if they are live**. Recurring series. No login — name + email only. Built to be handed to Cursor and built incrementally.

---

## 0. How to use this in Cursor

1. Save this file as `/docs/spec.md` in a fresh repo.
2. Paste the **Cursor rules** block below into `.cursorrules` (or your Cursor Project Rules).
3. Work the **Build Sequence** (§15) one step at a time. Do not let the agent build ahead.

### `.cursorrules`

```
You are building the FTA Webinar Platform. Follow /docs/spec.md as the source of truth.

WORKING STYLE — non-negotiable:
- Work in SMALL incremental steps. One Build Sequence step at a time.
- Change ONLY the files required for the current step. No drive-by edits.
- After each step, state the acceptance criteria and how to verify it.
- Use inline UI messages for user feedback — never browser alert()/confirm().
- Ask before introducing a new dependency.

STACK: Next.js (App Router, TypeScript) + Supabase + Tailwind + shadcn/ui. Deploy: Vercel. Email: Resend. Video: Mux.

SECURITY:
- Never commit .env files.
- Frontend config uses NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY only.
- SUPABASE_SERVICE_ROLE_KEY is server-side only — never imported into a client component.
- All tables have RLS enabled. Public clients can never read the subscriber list.

CONVENTIONS:
- Server time is the single source of truth for all webinar timing. Never trust the client clock for play position.
- All currency/branding is FTA. CTA copy and links come from session config, not hardcoded.
```

---

## 1. Overview

| | |
|---|---|
| **Goal** | Capture leads via email, deliver pre-recorded webinars that feel live, drive a CTA. |
| **Auth** | None. Name + email. Returning users recognised by cookie (per device). |
| **Series** | Recurring — admin sets each session's topic, time, video, CTA. |
| **Scale** | ~50 concurrent peak. |
| **Live feel** | Playback synced to wall clock; late joiners start mid-stream; no seek, no download. |
| **Emails** | Welcome (on signup) + reminders at 1h, 15m, and "live now". |
| **Branding** | FTA. |
| **Analytics** | Built-in, first-party (events stored in Supabase). View tracking + funnel + per-session engagement, surfaced in admin. No third-party trackers. |

---

## 2. Tech stack

- **Next.js** 14+ (App Router, TypeScript, React Server Components)
- **Supabase** (Postgres + RLS) — data only, no Supabase Auth
- **Tailwind CSS** + **shadcn/ui**
- **Mux** (`@mux/mux-node`, `@mux/mux-player-react`) — signed playback
- **Resend** (`resend`) — transactional email + webhook for email analytics
- **Vercel** — hosting + Cron
- **jsonwebtoken** — Mux signed playback tokens (or use mux-node's helper)
- **recharts** — admin-only charts (retention curve, funnel)

---

## 3. Environment variables

```bash
# Supabase (frontend)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# Supabase (server only — NEVER client)
SUPABASE_SERVICE_ROLE_KEY=

# Mux
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
MUX_SIGNING_KEY_ID=
MUX_SIGNING_KEY_PRIVATE=   # base64-encoded private key

# Resend
RESEND_API_KEY=
EMAIL_FROM="FTA Webinars <webinars@CONFIG_DOMAIN>"   # see §16
RESEND_WEBHOOK_SECRET=     # verifies email-event webhook

# App
NEXT_PUBLIC_APP_URL=https://CONFIG_DOMAIN
ADMIN_PASSWORD=            # gates /admin
CRON_SECRET=              # gates the reminder cron route
```

`.env.local` is gitignored. Same vars set in Vercel project settings.

---

## 4. Project structure

```
/app
  /page.tsx                  # Landing: topic + countdown + capture form
  /webinar/page.tsx          # The webinar room (before/during/after states)
  /admin/page.tsx            # Password-gated session CRUD
  /admin/analytics/page.tsx  # Dashboard: funnel + per-session engagement
  /api
    /now/route.ts            # Returns server time
    /signup/route.ts         # Upsert user, set cookie, fire welcome email
    /mux-token/route.ts      # Returns short-lived signed playback token
    /track/route.ts          # First-party event capture (views, joins, heartbeats, CTA)
    /cron/reminders/route.ts # Vercel Cron target
    /admin/session/route.ts  # Create/update sessions (password-checked)
    /webhooks/resend/route.ts# Email delivery/open/click events
/components
  Countdown.tsx
  CaptureForm.tsx
  WebinarStage.tsx           # state machine wrapper
  LivePlayer.tsx             # locked Mux player
  WaitingRoom.tsx
  MissedState.tsx
  /admin
    AnalyticsDashboard.tsx   # cards + per-session table
    RetentionChart.tsx       # viewers-over-time / drop-off curve
/lib
  supabase/server.ts         # service-role client (server only)
  supabase/client.ts         # anon client
  time.ts                    # offset / state helpers
  mux.ts                     # token signing
  email.ts                   # Resend helpers + templates
  track.ts                   # client helper: track(type, payload)
/docs/spec.md                # this file
vercel.json                  # cron schedule
```

---

## 5. Data model + SQL

```sql
-- USERS
create table public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  welcomed boolean not null default false,
  subscribed boolean not null default true,
  created_at timestamptz not null default now()
);

-- SESSIONS
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  description text,
  host_name text not null,
  start_time timestamptz not null,
  duration_seconds int not null default 3600,
  mux_playback_id text,
  cta_label text,
  cta_url text,
  created_at timestamptz not null default now()
);
create index sessions_start_time_idx on public.sessions (start_time);

-- EMAIL LOG (dedupe)
create table public.email_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  session_id uuid references public.sessions(id) on delete cascade,
  type text not null check (type in ('welcome','1h','15m','live')),
  sent_at timestamptz not null default now(),
  unique (user_id, session_id, type)
);

-- GRANULAR EVENTS (powers all analytics)
create table public.events (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in
    ('page_view','signup','join','heartbeat','cta_click','leave')),
  user_id uuid references public.users(id) on delete set null,
  session_id uuid references public.sessions(id) on delete cascade,
  page text,                 -- page_view: 'landing' | 'webinar'
  offset_sec int,            -- position in the webinar when the event fired
  created_at timestamptz not null default now()
);
create index events_session_idx on public.events (session_id, type, created_at);
create index events_user_idx on public.events (user_id);

-- EMAIL ENGAGEMENT (populated by Resend webhook)
create table public.email_events (
  id uuid primary key default gen_random_uuid(),
  email text,
  session_id uuid references public.sessions(id) on delete set null,
  type text,                 -- 'delivered' | 'opened' | 'clicked' | 'bounced'
  created_at timestamptz not null default now()
);

-- VIEW: per-minute concurrency / retention curve
create view public.session_concurrency as
select session_id,
       floor(offset_sec / 60)::int as minute,
       count(distinct user_id) as viewers
from public.events
where type = 'heartbeat'
group by session_id, floor(offset_sec / 60);
```

### RLS

```sql
alter table public.users enable row level security;
alter table public.sessions enable row level security;
alter table public.email_log enable row level security;
alter table public.events enable row level security;
alter table public.email_events enable row level security;

-- Anon clients may read upcoming session info ONLY (topic/time/etc).
create policy "public can read sessions"
  on public.sessions for select
  to anon using (true);

-- No anon access to users, email_log, events, or email_events.
-- Event capture is write-only via /api/track (service role); reads are
-- admin-only via service-role queries. Session writes go through server
-- routes using the SERVICE ROLE key (bypasses RLS).
```

> Note: the anon `sessions` read is fine — it only exposes topic/time/playback_id, never subscribers. Playback is still protected because the Mux stream needs a signed token (§9).

---

## 6. Core concept — the live sync engine

This is the heart of the product. Get it right first.

### Principle
The **server clock** decides where playback is. Compute an `offset` (seconds since the session started) and derive one of three states:

```ts
// /lib/time.ts
export type WebinarState = 'before' | 'during' | 'after';

export function getState(serverNowMs: number, startMs: number, durationSec: number) {
  const offsetSec = (serverNowMs - startMs) / 1000;
  let state: WebinarState = 'before';
  if (offsetSec >= 0 && offsetSec < durationSec) state = 'during';
  else if (offsetSec >= durationSec) state = 'after';
  return { state, offsetSec: Math.max(0, offsetSec) };
}
```

### Getting trustworthy "now" on the client
Server-render the webinar page and pass `serverNow` + `startTime`, then keep ticking locally with `performance.now()` so it's smooth and tamper-resistant:

```ts
// useServerClock — returns a function giving the current server-aligned time
export function useServerClock(serverNowMs: number) {
  const baseRef = useRef({ serverNowMs, perf: performance.now() });
  return useCallback(() => {
    const elapsed = performance.now() - baseRef.current.perf;
    return baseRef.current.serverNowMs + elapsed;
  }, []);
}
```

`/api/now` exists as a lightweight re-sync endpoint (call on tab refocus to correct drift). Never compute play position from `Date.now()` alone.

### State machine (webinar page)
- `before` → `WaitingRoom` (topic, host, "starting soon", countdown)
- `during` → `LivePlayer` seeked to `offsetSec`
- `after` → `MissedState` (next session topic + countdown)

Re-evaluate the state on a 1s tick so it auto-transitions before → during → after without a refresh.

---

## 7. Pages

### `/` Landing
- Hero: next session **topic** + `Countdown` to `start_time`.
- `CaptureForm` (name, email). On submit → POST `/api/signup` → set cookie → `router.push('/webinar')`.
- If `fta_uid` cookie present on load: skip the form, show "Welcome back, {name}" + a button to `/webinar`.
- Inline validation + inline success/error messages (no alerts).

### `/webinar`
- Server component fetches the next/active session + `serverNow`.
- Renders `<WebinarStage>` which runs the §6 state machine.
- **Autoplay gotcha:** browsers block autoplay-with-sound until a gesture. Since the user clicked through from the form/button, attempt autoplay; if it throws, show a single full-screen "▶ Join the live session" overlay — one tap starts playback at the correct `offset`.

### `/admin`
- Password gate (compare against `ADMIN_PASSWORD` server-side; store a signed session cookie).
- Form to create/edit sessions: topic, description, host, start time (timezone-aware), duration, Mux playback id, CTA label, CTA url.
- Table of upcoming + past sessions.

---

## 8. Components

| Component | Responsibility |
|---|---|
| `Countdown` | Given a target time + server clock, renders ticking dd:hh:mm:ss. Reused on landing + waiting room. |
| `CaptureForm` | Controlled name/email inputs, inline errors, calls `/api/signup`. |
| `WebinarStage` | Holds session + serverNow; runs state machine; renders the right child. |
| `WaitingRoom` | Topic, host, countdown, "starting soon". |
| `LivePlayer` | Locked Mux player (see §9). |
| `MissedState` | "You missed it" + next session info + CTA. |

---

## 9. Server API routes

### `/api/now`
```ts
export async function GET() {
  return Response.json({ now: Date.now() });
}
```

### `/api/signup`
1. Validate name + email.
2. `upsert` into `users` by email (service-role client).
3. If newly created (or `welcomed = false`): send welcome email, set `welcomed = true`, log `email_log` type `welcome`.
4. Set httpOnly cookie `fta_uid` = user id (signed).
5. Return the user.

### `/api/mux-token` — signed playback
Returns a short-lived JWT so the stream can't be hot-linked or downloaded.
```ts
// /lib/mux.ts
import jwt from 'jsonwebtoken';

export function signPlayback(playbackId: string) {
  const key = Buffer.from(process.env.MUX_SIGNING_KEY_PRIVATE!, 'base64').toString('utf8');
  return jwt.sign(
    { sub: playbackId, aud: 'v', exp: Math.floor(Date.now() / 1000) + 60 * 60 },
    key,
    { algorithm: 'RS256', keyid: process.env.MUX_SIGNING_KEY_ID }
  );
}
```
Route: validate the session is currently `during` (don't hand out tokens before start), then return `{ token }`.

### `/api/cron/reminders` — see §11.

### `/api/admin/session`
- Require admin cookie. CRUD on `sessions` via service-role client.

---

## 10. Mux — the locked player

Upload each webinar to Mux, set **playback policy = signed**, store the `playback_id` on the session.

```tsx
// LivePlayer.tsx (sketch)
<MuxPlayer
  playbackId={playbackId}
  tokens={{ playback: token }}
  autoPlay
  startTime={offsetSec}          // join at the live position
  nohotkeys
  onSeeking={snapBackToLive}      // cancel any scrub: set currentTime back to expected offset
  style={{
    // hide the scrubber + skip buttons via Mux Player CSS vars
    ['--seek-backward-button' as any]: 'none',
    ['--seek-forward-button' as any]: 'none',
    ['--time-range' as any]: 'none',
    ['--rendition-menu-button' as any]: 'none',
  }}
/>
```

Lockdown layers:
1. **Signed playback** → no static, downloadable file URL.
2. **Hidden seek bar + nohotkeys** → no UI to skip.
3. **`onSeeking` guard** → snap `currentTime` back to the live offset if anyone tries programmatically.
4. **Disable context menu** on the player container.

> Honest limit: this defeats normal users entirely. It does not stop screen recording — no platform does. Acceptable for this use case.

---

## 11. Email (Resend) + cron

### Templates (FTA-branded)
- **Welcome** — sent on signup.
- **1h / 15m reminders** — "Your webinar starts soon" + join link.
- **Live now** — "We're live" + join link.

All include an unsubscribe link (`/unsubscribe?u=<id>` → sets `users.subscribed = false`).

### Cron route logic
```
/api/cron/reminders (GET, requires CRON_SECRET header)
For each upcoming/active session:
  - find sessions where (start_time - now) in window → send '1h' / '15m'
  - find sessions where now >= start_time and just crossed → send 'live'
  For each, select subscribed users with NO email_log(user, session, type), send, log.
```
Use ranges (e.g. between 59–61 min) so a per-minute cron never misses the boundary; `email_log` uniqueness guarantees no duplicates.

### `vercel.json`
```json
{
  "crons": [
    { "path": "/api/cron/reminders", "schedule": "* * * * *" }
  ]
}
```
(Per-minute cron requires a Vercel plan that allows it; otherwise widen the windows to match the interval.)

---

## 12. Admin

- `/admin` posts the password to a server action; on match, set a signed `fta_admin` cookie (short expiry).
- All session writes check that cookie server-side.
- Minimal shadcn form + table. Internal use only.

---

## 13. Analytics & view tracking (built into admin)

First-party only — every event is written to your own `events` table via `/api/track`. No Google Analytics, no third-party pixel. Privacy-friendly and matches the rest of the build.

### What gets captured

| Event | Fired when | Payload |
|---|---|---|
| `page_view` | Landing or webinar page mounts | `page` |
| `signup` | `/api/signup` succeeds | `user_id` |
| `join` | `LivePlayer` first starts playing | `user_id, session_id, offset_sec` |
| `heartbeat` | Every 20s while playing | `user_id, session_id, offset_sec` |
| `cta_click` | CTA button clicked | `user_id, session_id` |
| `leave` | Page hidden / unmounts during playback | `user_id, session_id, offset_sec` |
| email events | Resend webhook (delivered/opened/clicked/bounced) | `email, session_id, type` |

### Capture mechanics
- **`/lib/track.ts`** — thin client helper `track(type, payload)` → POST `/api/track`. Attaches the `fta_uid` cookie server-side; the client never sends the user id directly.
- **`/api/track`** — validates `type`, resolves the user from the cookie, inserts the event. **Throttles heartbeats** server-side (ignore if <15s since that user's last heartbeat for the session) so the table stays sane (~50 viewers × 60 min ≈ a few thousand rows/session — trivial for Postgres).
- **Heartbeats** are added inside `LivePlayer` on a 20s interval while `playing`; this single stream powers watch time, concurrency, and the drop-off curve.
- **`/api/webhooks/resend`** — verifies `RESEND_WEBHOOK_SECRET`, maps Resend events into `email_events`.

### Metrics the admin computes

**Overall funnel (date-range filtered):**
`landing views → signups → attendees → CTA clicks`, with conversion % at each step. Plus total users and new-vs-returning split, and a users-over-time growth line.

**Per session:**
| Metric | How it's derived |
|---|---|
| Registrants | distinct users who signed up before `start_time` |
| Attendees (unique) | distinct `user_id` with a `join` event |
| Attendance rate | attendees ÷ registrants |
| Avg watch time | per user: `last heartbeat offset − join offset`; then averaged |
| Peak concurrent | max `viewers` across minutes in `session_concurrency` |
| Retention / drop-off | `session_concurrency` plotted as viewers vs minute |
| Join-time distribution | histogram of `join.offset_sec` (how late people arrive) |
| CTA clicks + CTA % | distinct `cta_click` users ÷ attendees |
| Email funnel | sent (`email_log`) → delivered → opened → clicked (`email_events`) |

The per-minute `session_concurrency` view (defined in §5) does the heavy lifting for the retention curve.

### Admin UI (`/admin/analytics`)
- **Top cards:** total users, signups (period), avg attendance rate, last session's peak concurrent.
- **Sessions table:** date, topic, registrants, attendees, attendance %, avg watch, peak concurrent, CTA %.
- **Session detail:** `RetentionChart` (recharts line — viewers over each minute), join-time histogram, email funnel bars.
- **Date-range filter** across the whole dashboard.
- Same `fta_admin` cookie gate as the rest of admin; all reads run server-side with the service-role client.

---

## 14. Security checklist

- [ ] `.env*` gitignored; secrets only in Vercel.
- [ ] Service-role key never imported in a `'use client'` file.
- [ ] RLS on all tables; anon can read `sessions` only.
- [ ] Mux playback policy = signed; tokens short-lived (≤1h) and only issued during `during`.
- [ ] Admin + cron routes gated (password / `CRON_SECRET`).
- [ ] Cookies httpOnly + signed.
- [ ] Unsubscribe honoured before every send.
- [ ] `/api/track` validates `type`, resolves user from cookie (client never sends user id), throttles heartbeats; `events`/`email_events` never anon-readable.
- [ ] Resend webhook verifies `RESEND_WEBHOOK_SECRET`.

---

## 15. Build sequence (ordered Cursor tasks)

Do these strictly in order. Each is one step; verify before moving on.

**Step 1 — Skeleton.** Next.js + TS + Tailwind + shadcn + Supabase clients (`/lib/supabase/*`). Env wired.
*Accept:* app runs; a test query reads from Supabase.

**Step 2 — Database.** Run §5 SQL (tables + RLS). Seed one test session ~2 min in the future, 5-min duration.
*Accept:* tables exist; seed session reads through the anon client; `users`/`email_log` are not anon-readable.

**Step 3 — Countdown.** `Countdown` + `/api/now` + `useServerClock`.
*Accept:* renders correct, ticking time-to-go on the landing page.

**Step 4 — Landing + capture.** Hero (topic + countdown), `CaptureForm`, `/api/signup` (upsert + cookie). Returning-user "Welcome back" path.
*Accept:* new email creates a user; same email is recognised; cookie skips the form on reload; all feedback inline.

**Step 5 — Webinar state machine.** `/webinar` server fetch + `WebinarStage` running §6 logic with placeholder player.
*Accept:* editing the seed session's `start_time` flips the page across before/during/after, and it auto-transitions on the 1s tick.

**Step 6 — Locked Mux player.** `/api/mux-token`, `LivePlayer`, autoplay-with-gesture fallback.
*Accept:* joining "late" starts mid-video; scrubbing impossible; no downloadable URL in the network tab; token only issued during `during`.

**Step 7 — Welcome email.** Resend + welcome template; fires once on first signup; `welcomed` flips.
*Accept:* a brand-new signup gets exactly one FTA welcome email.

**Step 8 — Reminder cron.** `/api/cron/reminders` + `vercel.json`; 1h/15m/live logic with `email_log` dedupe + unsubscribe.
*Accept:* a soon-scheduled session triggers each email once, to subscribed users only, no duplicates.

**Step 9 — Admin.** Password gate + session CRUD.
*Accept:* create and edit a live session end-to-end without touching the DB.

**Step 10 — Event capture.** `events` table (done in Step 2), `/lib/track.ts`, `/api/track` with heartbeat throttling. Wire `page_view`, `signup`, `join`, `heartbeat`, `cta_click`, `leave` into the existing pages/components.
*Accept:* each action writes the right event row; heartbeats fire ~every 20s and are throttled server-side; no user id is sent from the client.

**Step 11 — Email events.** `/api/webhooks/resend` → `email_events`, secret-verified; configure the webhook in Resend.
*Accept:* a test send produces delivered/opened/clicked rows.

**Step 12 — Analytics dashboard.** `session_concurrency` view + `/admin/analytics` (cards, sessions table, `RetentionChart`, join-time histogram, email funnel, date filter).
*Accept:* a seeded session with fake joins/heartbeats shows correct attendees, attendance %, peak concurrent, and a retention curve; CTA % and email funnel populate.

**Step 13 — Polish.** FTA branding, CTA wiring, unsubscribe page, mobile pass.
*Accept:* looks like FTA; CTA + unsubscribe both work on mobile and desktop.

---

## 16. Config placeholders (fill before Step 1)

These three are the only unknowns; set them as config, don't hardcode:

- **`cta_label` / `cta_url`** — currently "Download our Exit Readiness Planner" → *[destination URL TBC]*. Set per-session in admin.
- **`EMAIL_FROM` domain** — the FTA sending address, e.g. `webinars@[fta-domain]`. Must be a verified Resend domain.
- **Default `duration_seconds`** — assumed 3600 (60 min). Change the table default if your standard length differs.
