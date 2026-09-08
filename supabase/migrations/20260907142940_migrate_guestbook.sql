begin;
create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  notion_page_id uuid unique,
  username text not null,
  title text not null,
  content text not null,
  icon text not null default '🥳',
  source_user_id text,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.guestbook enable row level security;
-- All public reads and password-verified mutations go through Next.js routes.
revoke all on public.guestbook from anon, authenticated;
grant select, insert, update, delete on public.guestbook to service_role;
create index if not exists guestbook_created_id_idx on public.guestbook (created_at desc, id asc);
commit;
