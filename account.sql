begin;
create table if not exists public.custia_account_details (id uuid primary key references auth.users(id) on delete cascade, about text not null default '' check(length(about)<=2000), avatar text check(avatar is null or avatar like id::text || '/%'));
alter table public.custia_account_details enable row level security;
revoke all on public.custia_account_details from anon,authenticated;
grant select,insert,update on public.custia_account_details to authenticated;
drop policy if exists own_details on public.custia_account_details;
create policy own_details on public.custia_account_details for all to authenticated using(id=auth.uid()) with check(id=auth.uid());
create schema if not exists custia_private;
revoke all on schema custia_private from public,anon,authenticated;
create table if not exists custia_private.invites(code text primary key, role text not null check(role in ('Guard','Manager','Special Manager','Clairvoyant')));
create table if not exists custia_private.staff(id uuid primary key references auth.users(id) on delete cascade, role text not null);
create or replace function public.custia_staff_role() returns text language sql security definer set search_path='' as $$ select role from custia_private.staff where id=auth.uid() $$;
create or replace function public.custia_redeem_staff(p_code text) returns text language plpgsql security definer set search_path='' as $$ declare r text; begin if auth.uid() is null then raise exception 'Sign in required'; end if; delete from custia_private.invites where code=p_code returning role into r; if r is null then return null; end if; insert into custia_private.staff values(auth.uid(),r) on conflict(id) do update set role=excluded.role; return r; end $$;
revoke all on function public.custia_staff_role() from public,anon;
revoke all on function public.custia_redeem_staff(text) from public,anon;
grant execute on function public.custia_staff_role(),public.custia_redeem_staff(text) to authenticated;
commit;
-- Run separately to issue fresh single-use random codes; results are private to administrator.
-- insert into custia_private.invites select replace(gen_random_uuid()::text,'-',''), r from unnest(array['Guard','Manager','Special Manager','Clairvoyant']) r returning role,code;
-- Run account.sql first if not already installed. Run this in SQL Editor only.
-- Administrator must assign the role to each trusted account first (example below).
begin;
create or replace function public.custia_redeem_staff(p_code text) returns text language plpgsql security definer set search_path='' as $$
declare r text; expected text;
begin
 if auth.uid() is null then return null; end if;
 select role into r from custia_private.staff where id=auth.uid();
 expected := case r when 'Manager' then '827' when 'Guard' then '164' when 'Clairvoyant' then '928' when 'Special Manager' then '280' else null end;
 if expected is not null and p_code=expected then return r; end if;
 return null;
end $$;
revoke all on function public.custia_redeem_staff(text) from public,anon;
grant execute on function public.custia_redeem_staff(text) to authenticated;
commit;
-- Example: replace UUID with trusted user's ID from Authentication > Users.
-- insert into custia_private.staff(id,role) values ('YOUR-USER-UUID','Manager') on conflict(id) do update set role=excluded.role;
