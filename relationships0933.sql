begin;
create table if not exists public.custia_relationships (
 a uuid references public.custia_characters(id) on delete cascade,
 b uuid references public.custia_characters(id) on delete cascade,
 kind text not null check(kind in ('Friend','Lover','Enemy','Other')),
 label text not null check(char_length(label) between 1 and 40),
 color text not null check(color ~ '^#[0-9a-fA-F]{6}$'),
 note_a text not null default '' check(char_length(note_a)<=1000),
 note_b text not null default '' check(char_length(note_b)<=1000),
 pos_a jsonb, pos_b jsonb,
 primary key(a,b), check(a<b)
);
alter table public.custia_relationships enable row level security;
revoke all on public.custia_relationships from public, anon, authenticated;
create or replace function public.custia_rel_list(p_character uuid) returns jsonb language sql stable security definer set search_path='' as $$
 select coalesce(jsonb_agg(jsonb_build_object('target',case when a=p_character then b else a end,'kind',kind,'label',label,'color',color,'note',case when a=p_character then note_a else note_b end,'back_note',case when a=p_character then note_b else note_a end,'pos',case when a=p_character then pos_a else pos_b end) order by a,b),'[]'::jsonb) from public.custia_relationships where auth.uid() is not null and (a=p_character or b=p_character);
$$;
create or replace function public.custia_rel_change(p_character uuid,p_other uuid,p_action text,p_kind text,p_label text,p_color text,p_note text,p_pos jsonb) returns void language plpgsql security definer set search_path='' as $$
declare lo uuid:=least(p_character,p_other); hi uuid:=greatest(p_character,p_other);
begin
 if auth.uid() is null or not exists(select 1 from public.custia_characters where id=p_character and owner=auth.uid()) then raise exception 'Not authorized'; end if;
 if p_other is null or p_other=p_character then raise exception 'Invalid relationship'; end if;
 if p_action='add' then insert into public.custia_relationships(a,b,kind,label,color) values(lo,hi,p_kind,p_label,p_color) on conflict(a,b) do nothing;
 elsif p_action='remove' then delete from public.custia_relationships where a=lo and b=hi;
 elsif p_action='note' then update public.custia_relationships set note_a=case when p_character=lo then p_note else note_a end,note_b=case when p_character=hi then p_note else note_b end where a=lo and b=hi;
 elsif p_action='position' then
 if p_pos is null or jsonb_typeof(p_pos->'r') is distinct from 'number' or jsonb_typeof(p_pos->'x') is distinct from 'number' or (p_pos->>'r')::numeric not in (0,1,2) or (p_pos->>'x')::numeric not between 60 and 100000 then raise exception 'Invalid position'; end if;
 update public.custia_relationships set pos_a=case when p_character=lo then p_pos else pos_a end,pos_b=case when p_character=hi then p_pos else pos_b end where a=lo and b=hi;
 else raise exception 'Invalid action'; end if;
end; $$;
revoke all on function public.custia_rel_list(uuid) from public,anon;
revoke all on function public.custia_rel_change(uuid,uuid,text,text,text,text,text,jsonb) from public,anon;
grant execute on function public.custia_rel_list(uuid) to authenticated;
grant execute on function public.custia_rel_change(uuid,uuid,text,text,text,text,text,jsonb) to authenticated;
notify pgrst,'reload schema';
commit;
