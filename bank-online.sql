BEGIN;
CREATE TABLE IF NOT EXISTS public.custia_online_wallet (
 character_id uuid PRIMARY KEY REFERENCES public.custia_characters(id) ON DELETE CASCADE,
 balance integer NOT NULL DEFAULT 2 CHECK(balance >= 0)
);
CREATE TABLE IF NOT EXISTS public.custia_online_awakening (
 character_id uuid NOT NULL REFERENCES public.custia_characters(id) ON DELETE CASCADE,
 request_id uuid NOT NULL,
 outcome text NOT NULL CHECK(outcome IN ('none','new','original')),
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(character_id,request_id)
);
ALTER TABLE public.custia_online_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custia_online_awakening ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.custia_online_wallet, public.custia_online_awakening FROM PUBLIC, anon, authenticated;
CREATE OR REPLACE FUNCTION public.custia_bank_state(p_character uuid) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE b integer; h jsonb;
BEGIN
 IF auth.uid() IS NULL OR NOT EXISTS (SELECT 1 FROM public.custia_characters WHERE id=p_character AND owner=auth.uid()) THEN RAISE EXCEPTION 'Not authorized'; END IF;
 INSERT INTO public.custia_online_wallet(character_id) VALUES(p_character) ON CONFLICT DO NOTHING;
 SELECT balance INTO b FROM public.custia_online_wallet WHERE character_id=p_character;
 SELECT coalesce(jsonb_agg(jsonb_build_object('date',created_at,'outcome',outcome) ORDER BY created_at DESC),'[]'::jsonb) INTO h FROM public.custia_online_awakening WHERE character_id=p_character;
 RETURN jsonb_build_object('balance',b,'history',h);
END; $$;
CREATE OR REPLACE FUNCTION public.custia_consume(p_character uuid,p_request uuid) RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE b integer; r double precision; result text;
BEGIN
 IF auth.uid() IS NULL OR NOT EXISTS (SELECT 1 FROM public.custia_characters WHERE id=p_character AND owner=auth.uid()) THEN RAISE EXCEPTION 'Not authorized'; END IF;
 IF p_request IS NULL THEN RAISE EXCEPTION 'Missing request'; END IF;
 INSERT INTO public.custia_online_wallet(character_id) VALUES(p_character) ON CONFLICT DO NOTHING;
 SELECT balance INTO b FROM public.custia_online_wallet WHERE character_id=p_character FOR UPDATE;
 SELECT outcome INTO result FROM public.custia_online_awakening WHERE character_id=p_character AND request_id=p_request;
 IF FOUND THEN RETURN result; END IF;
 IF b<1 THEN RAISE EXCEPTION 'Insufficient Custia'; END IF;
 r:=random(); result:=CASE WHEN r<0.01 THEN 'original' WHEN r<0.42 THEN 'new' ELSE 'none' END;
 UPDATE public.custia_online_wallet SET balance=balance-1 WHERE character_id=p_character;
 INSERT INTO public.custia_online_awakening(character_id,request_id,outcome) VALUES(p_character,p_request,result);
 RETURN result;
END; $$;
REVOKE ALL ON FUNCTION public.custia_bank_state(uuid), public.custia_consume(uuid,uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.custia_bank_state(uuid), public.custia_consume(uuid,uuid) TO authenticated;
COMMIT;
NOTIFY pgrst, 'reload schema';
