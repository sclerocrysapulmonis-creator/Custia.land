-- Run after the profiles migration. Safe to rerun.
begin;
create table if not exists public.custia_characters (
 id uuid primary key default gen_random_uuid(),
 owner uuid not null default auth.uid() references auth.users(id) on delete cascade,
 number text unique check (number ~ '^[0-9]{1,30}$'),
 name text not null check (char_length(name) between 1 and 100),
 alias text not null default '' check (char_length(alias)<=100),
 zone text not null default '' check (zone in ('','O','G','D','B','A','S','E')),
 bio text not null default '' check (char_length(bio)<=3000),
 portrait text check (portrait is null or char_length(portrait)<=500),
 created_at timestamptz not null default now()
);
alter table public.custia_characters enable row level security;
revoke all on public.custia_characters from anon, authenticated;
grant select on public.custia_characters to authenticated;
grant insert (id,number,name,alias,zone,bio,portrait) on public.custia_characters to authenticated;
grant update (number,name,alias,zone,bio,portrait) on public.custia_characters to authenticated;
drop policy if exists custia_read on public.custia_characters;
create policy custia_read on public.custia_characters for select to authenticated using (true);
drop policy if exists custia_insert on public.custia_characters;
create policy custia_insert on public.custia_characters for insert to authenticated with check (owner=auth.uid() and (portrait is null or portrait like auth.uid()::text || '/%'));
drop policy if exists custia_update on public.custia_characters;
create policy custia_update on public.custia_characters for update to authenticated using (owner=auth.uid()) with check (owner=auth.uid() and (portrait is null or portrait like auth.uid()::text || '/%'));
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types) values ('custia-portraits','custia-portraits',false,2097152,array['image/png','image/jpeg','image/webp']) on conflict (id) do nothing;
drop policy if exists custia_portrait_read on storage.objects;
create policy custia_portrait_read on storage.objects for select to authenticated using (bucket_id='custia-portraits');
drop policy if exists custia_portrait_insert on storage.objects;
create policy custia_portrait_insert on storage.objects for insert to authenticated with check (bucket_id='custia-portraits' and (storage.foldername(name))[1]=auth.uid()::text);
do $$ begin if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='custia_characters') then alter publication supabase_realtime add table public.custia_characters; end if; end $$;
commit;
