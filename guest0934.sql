-- Guest read-only character projection. No account identifiers or OOC contacts.
begin;
create or replace function public.custia_guest_records() returns jsonb
language sql stable security definer set search_path='' as $$
select coalesce(jsonb_agg(jsonb_build_object('id',id,'number',number,'alias',alias,'zone',zone,'bio',bio,'age',age,'height',height,'weight',weight,'gender',gender,'skill1',skill1,'skill2',skill2,'skill3',skill3,'skill4',skill4,'rp',rp,'portrait',portrait,'fullbody',fullbody) order by created_at desc),'[]'::jsonb) from public.custia_characters;
$$;
revoke all on function public.custia_guest_records() from public;
grant execute on function public.custia_guest_records() to anon,authenticated;
-- Only images referenced by character records may be signed by guests.
create or replace function public.custia_guest_image(p_path text) returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from public.custia_characters where portrait=p_path or fullbody=p_path); $$;
revoke all on function public.custia_guest_image(text) from public;
grant execute on function public.custia_guest_image(text) to anon;
drop policy if exists custia_guest_character_image on storage.objects;
create policy custia_guest_character_image on storage.objects for select to anon using(bucket_id='custia-portraits' and public.custia_guest_image(name));
notify pgrst,'reload schema';
commit;
