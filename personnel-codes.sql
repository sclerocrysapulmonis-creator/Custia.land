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
