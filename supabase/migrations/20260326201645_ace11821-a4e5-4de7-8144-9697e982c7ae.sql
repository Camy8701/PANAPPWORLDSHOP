ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS printify_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS printify_variant_mapping jsonb DEFAULT '[]'::jsonb;