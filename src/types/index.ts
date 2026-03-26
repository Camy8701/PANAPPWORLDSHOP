export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  collection_id: string;
  images: string[];
  sizes: string[];
  in_stock: boolean;
  featured: boolean;
  created_at: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface CartItem {
  id: string;
  product: Product;
  size: string;
  quantity: number;
}
