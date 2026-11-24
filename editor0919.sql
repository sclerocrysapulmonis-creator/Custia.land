BEGIN;
ALTER TABLE public.custia_characters ADD COLUMN IF NOT EXISTS fullbody text;
GRANT INSERT(fullbody), UPDATE(fullbody,name,alias,zone,bio,portrait) ON public.custia_characters TO authenticated;
ALTER TABLE public.custia_characters DROP CONSTRAINT IF EXISTS custia_fullbody_owner_path;
ALTER TABLE public.custia_characters ADD CONSTRAINT custia_fullbody_owner_path CHECK (fullbody IS NULL OR (length(fullbody)<=500 AND fullbody LIKE owner::text || '/%'));
COMMIT;
NOTIFY pgrst,'reload schema';
