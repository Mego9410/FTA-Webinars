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

-- GRANULAR EVENTS
create table public.events (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in
    ('page_view','signup','join','heartbeat','cta_click','leave')),
  user_id uuid references public.users(id) on delete set null,
  session_id uuid references public.sessions(id) on delete cascade,
  page text,
  offset_sec int,
  created_at timestamptz not null default now()
);
create index events_session_idx on public.events (session_id, type, created_at);
create index events_user_idx on public.events (user_id);

-- EMAIL ENGAGEMENT
create table public.email_events (
  id uuid primary key default gen_random_uuid(),
  email text,
  session_id uuid references public.sessions(id) on delete set null,
  type text,
  created_at timestamptz not null default now()
);

-- VIEW: per-minute concurrency / retention curve
create view public.session_concurrency with (security_invoker = true) as
select session_id,
       floor(offset_sec / 60)::int as minute,
       count(distinct user_id) as viewers
from public.events
where type = 'heartbeat'
group by session_id, floor(offset_sec / 60);

-- RLS
alter table public.users enable row level security;
alter table public.sessions enable row level security;
alter table public.email_log enable row level security;
alter table public.events enable row level security;
alter table public.email_events enable row level security;

create policy "public can read sessions"
  on public.sessions for select
  to anon using (true);
