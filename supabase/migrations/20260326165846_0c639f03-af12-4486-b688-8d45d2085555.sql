-- Create collections table
CREATE TABLE public.collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  sizes TEXT[] NOT NULL DEFAULT '{}',
  in_stock BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public read access (storefront is public)
CREATE POLICY "Collections are publicly readable"
  ON public.collections FOR SELECT USING (true);

CREATE POLICY "Products are publicly readable"
  ON public.products FOR SELECT USING (true);

-- Create indexes
CREATE INDEX idx_products_collection ON public.products(collection_id);
CREATE INDEX idx_products_featured ON public.products(featured) WHERE featured = true;