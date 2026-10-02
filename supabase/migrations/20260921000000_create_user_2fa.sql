-- Unified 2FA Schema Migration
-- Run this in the Supabase SQL editor, or via `supabase db push`

create table if not exists user_2fa (
  user_id uuid primary key references auth.users(id) on delete cascade,
  encrypted_secret text not null,
  is_enabled boolean not null default false,
  backup_code_hashes text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table user_2fa enable row level security;

-- Users may only READ their own row (to check "is 2FA on?" in the UI).
-- All writes go through Edge Functions using the service_role key, which
-- bypasses RLS entirely — the anon/publishable key can never write here.
create policy "Users can view own 2fa status"
  on user_2fa
  for select
  using (auth.uid() = user_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger user_2fa_updated_at
  before update on user_2fa
  for each row execute function set_updated_at();
