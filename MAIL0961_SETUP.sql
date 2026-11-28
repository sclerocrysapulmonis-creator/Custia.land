BEGIN;
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types) VALUES ('custia-mail-media','custia-mail-media',false,10485760,ARRAY['image/png','image/jpeg','image/webp','image/gif']),('custia-mail-stickers','custia-mail-stickers',false,2097152,ARRAY['image/png','image/jpeg','image/webp','image/gif']) ON CONFLICT(id) DO NOTHING;
CREATE OR REPLACE FUNCTION public.custia_mail_media_read(p_path text) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$ SELECT auth.uid() IS NOT NULL AND EXISTS(SELECT 1 FROM public.custia_mail_messages m JOIN public.custia_mail_conversations c ON c.id=m.conversation_id WHERE m.attachment_path=p_path AND m.deleted_at IS NULL AND auth.uid() IN(c.user_a,c.user_b) AND NOT EXISTS(SELECT 1 FROM public.custia_mail_hidden_messages h WHERE h.message_id=m.id AND h.user_id=auth.uid()) AND EXISTS(SELECT 1 FROM public.custia_mail_requests r WHERE r.conversation_id=c.id AND r.status='accepted')); $$;
REVOKE ALL ON FUNCTION public.custia_mail_media_read(text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.custia_mail_media_read(text) TO authenticated;
CREATE POLICY mail0961_media_read ON storage.objects FOR SELECT TO authenticated USING(bucket_id='custia-mail-media' AND public.custia_mail_media_read(name));
CREATE POLICY mail0961_media_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK(bucket_id='custia-mail-media' AND split_part(name,'/',1)=auth.uid()::text AND CASE WHEN split_part(name,'/',2) ~ '^[0-9a-f-]{36}$' THEN public.custia_mail_can_send(split_part(name,'/',2)::uuid) ELSE false END);
CREATE POLICY mail0961_sticker_read ON storage.objects FOR SELECT TO authenticated USING(bucket_id='custia-mail-stickers' AND split_part(name,'/',1)=auth.uid()::text);
CREATE POLICY mail0961_sticker_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK(bucket_id='custia-mail-stickers' AND split_part(name,'/',1)=auth.uid()::text);
CREATE POLICY mail0961_sticker_delete ON storage.objects FOR DELETE TO authenticated USING(bucket_id='custia-mail-stickers' AND split_part(name,'/',1)=auth.uid()::text);
CREATE OR REPLACE FUNCTION public.custia_mail_send_media(p_conversation uuid,p_body text,p_identity_type text,p_character uuid,p_reply_to uuid,p_client_request_id uuid,p_attachment_path text,p_message_type text) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE r jsonb; v_uid uuid:=auth.uid(); v_id uuid;
BEGIN
IF v_uid IS NULL OR p_client_request_id IS NULL OR p_message_type IS NULL OR p_message_type NOT IN ('image','sticker') OR p_attachment_path IS DISTINCT FROM (v_uid::text||'/'||p_conversation::text||'/'||p_client_request_id::text) THEN RAISE EXCEPTION 'Invalid attachment'; END IF;
IF NOT EXISTS(SELECT 1 FROM storage.objects WHERE bucket_id='custia-mail-media' AND name=p_attachment_path AND (metadata->>'size')::bigint <= CASE WHEN p_message_type='sticker' THEN 2097152 ELSE 10485760 END) THEN RAISE EXCEPTION 'Attachment unavailable'; END IF;
r:=public.custia_mail_send(p_conversation,coalesce(nullif(btrim(p_body),''),CASE WHEN p_message_type='image' THEN '[Image]' ELSE '[Sticker]' END),p_identity_type,p_character,p_reply_to,p_client_request_id);
IF r->>'status'='sent' THEN v_id:=(r->>'message_id')::uuid; UPDATE public.custia_mail_messages SET message_type=p_message_type,attachment_path=p_attachment_path WHERE id=v_id AND sender_id=v_uid; END IF;
RETURN r;
END; $$;
REVOKE ALL ON FUNCTION public.custia_mail_send_media(uuid,text,text,uuid,uuid,uuid,text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.custia_mail_send_media(uuid,text,text,uuid,uuid,uuid,text,text) TO authenticated;
COMMIT;
