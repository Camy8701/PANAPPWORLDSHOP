import { Product, Collection } from "@/types";

export const collections: Collection[] = [
  { id: "1", name: "ESSENTIALS", slug: "essentials", description: "Core wardrobe pieces" },
  { id: "2", name: "OUTERWEAR", slug: "outerwear", description: "Jackets and coats" },
  { id: "3", name: "ACCESSORIES", slug: "accessories", description: "Complete the look" },
];

export const products: Product[] = [
  {
    id: "1", name: "OVERSIZED TEE", slug: "oversized-tee", description: "Premium heavyweight cotton oversized tee with dropped shoulders and raw hem finish.",
    price: 89, collection_id: "1", images: ["/placeholder.svg", "/placeholder.svg"], sizes: ["S", "M", "L", "XL"], in_stock: true, featured: true, created_at: "2024-01-01",
  },
  {
    id: "2", name: "CARGO PANTS", slug: "cargo-pants", description: "Relaxed fit cargo pants with adjustable waist and multiple utility pockets.",
    price: 145, collection_id: "1", images: ["/placeholder.svg", "/placeholder.svg"], sizes: ["S", "M", "L", "XL"], in_stock: true, featured: true, created_at: "2024-01-02",
  },
  {
    id: "3", name: "BOMBER JACKET", slug: "bomber-jacket", description: "Heavyweight nylon bomber with satin lining and custom PANAPPWORLD embroidery.",
    price: 295, collection_id: "2", images: ["/placeholder.svg", "/placeholder.svg"], sizes: ["S", "M", "L", "XL"], in_stock: true, featured: true, created_at: "2024-01-03",
  },
  {
    id: "4", name: "HOODIE", slug: "hoodie", description: "Brushed fleece hoodie with kangaroo pocket and embossed logo.",
    price: 165, collection_id: "1", images: ["/placeholder.svg", "/placeholder.svg"], sizes: ["S", "M", "L", "XL"], in_stock: false, featured: false, created_at: "2024-01-04",
  },
  {
    id: "5", name: "TRACK PANTS", slug: "track-pants", description: "Tapered track pants with side stripe detail and elastic cuffs.",
    price: 120, collection_id: "1", images: ["/placeholder.svg", "/placeholder.svg"], sizes: ["S", "M", "L", "XL"], in_stock: true, featured: false, created_at: "2024-01-05",
  },
  {
    id: "6", name: "CAP", slug: "cap", description: "Structured six-panel cap with embroidered logo and adjustable strap.",
    price: 45, collection_id: "3", images: ["/placeholder.svg", "/placeholder.svg"], sizes: ["ONE SIZE"], in_stock: true, featured: true, created_at: "2024-01-06",
  },
];

export const heroSlides = [
  { id: 1, title: "NEW ARRIVALS", subtitle: "SPRING / SUMMER 2024", productId: "1" },
  { id: 2, title: "ESSENTIALS", subtitle: "REDEFINE YOUR WARDROBE", productId: "2" },
  { id: 3, title: "OUTERWEAR", subtitle: "LAYER UP", productId: "3" },
  { id: 4, title: "ACCESSORIES", subtitle: "COMPLETE THE LOOK", productId: "6" },
];
