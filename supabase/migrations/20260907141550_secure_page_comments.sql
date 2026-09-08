-- Existing public.user and public.comment tables are reused without moving data.
-- Deploy the server-action implementation with SUPABASE_SERVICE_ROLE_KEY.
-- No public policies: username/password verification runs only on the server.
begin;
alter table public."user" enable row level security;
alter table public.comment enable row level security;
create index if not exists comment_post_created_id_idx
  on public.comment (post_id, created_at desc, id);
create index if not exists comment_user_notion_id_idx
  on public.comment (user_notion_id);
commit;
