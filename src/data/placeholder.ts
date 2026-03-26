import { Product, Collection } from "@/types";

const CDN = "https://cdn.shopify.com/s/files/1/0933/4436/6887/files";

export const collections: Collection[] = [
  { id: "1", name: "ALL", slug: "all", description: "All products" },
  { id: "2", name: "TOPS", slug: "tops", description: "Tops and knitwear" },
  { id: "3", name: "BOTTOMS", slug: "bottoms", description: "Pants and shorts" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "CAUSALITY KNIT",
    slug: "causality-knit",
    description: "Premium heavyweight knit sweater with custom embroidered artwork and dropped shoulders.",
    price: 180,
    collection_id: "2",
    images: [
      `${CDN}/causality-knit-front.jpg`,
      `${CDN}/causality-knit-front.jpg`,
    ],
    sizes: ["S", "M", "L", "XL"],
    in_stock: true,
    featured: true,
    created_at: "2024-01-01",
  },
  {
    id: "2",
    name: "TREE OF DEATH KNIT",
    slug: "tree-of-death-knit",
    description: "Oversized knit sweater featuring the tree of death artwork with detailed embroidery.",
    price: 180,
    collection_id: "2",
    images: [
      `${CDN}/tree-of-death-front.jpg`,
      `${CDN}/tree-of-death-back.jpg`,
    ],
    sizes: ["S", "M", "L", "XL"],
    in_stock: true,
    featured: true,
    created_at: "2024-01-02",
  },
  {
    id: "3",
    name: "GREAT RED DRAGON KNIT",
    slug: "great-red-dragon-knit",
    description: "Statement knit with the great red dragon design, custom artwork throughout.",
    price: 180,
    collection_id: "2",
    images: [
      `${CDN}/great-red-dragon-front.jpg`,
      `${CDN}/great-red-dragon-back.jpg`,
    ],
    sizes: ["S", "M", "L", "XL"],
    in_stock: true,
    featured: true,
    created_at: "2024-01-03",
  },
  {
    id: "4",
    name: "ESSENTIAL TWILL PANT",
    slug: "essential-twill-pant",
    description: "Essential twill pant with a relaxed fit and premium construction.",
    price: 80,
    collection_id: "3",
    images: [
      `${CDN}/twill-pant-front.jpg`,
      `${CDN}/twill-pant-front.jpg`,
    ],
    sizes: ["S", "M", "L", "XL"],
    in_stock: true,
    featured: false,
    created_at: "2024-01-04",
  },
  {
    id: "5",
    name: "ESSENTIAL MESH SHORT",
    slug: "essential-mesh-short",
    description: "Lightweight mesh shorts with contrast paneling and elastic waist.",
    price: 55,
    collection_id: "3",
    images: [
      `${CDN}/mesh-short-front.jpg`,
      `${CDN}/mesh-short-front.jpg`,
    ],
    sizes: ["S", "M", "L", "XL"],
    in_stock: true,
    featured: false,
    created_at: "2024-01-05",
  },
];

export const heroSlides = [
  {
    id: 1,
    image: `${CDN}/tree-of-death-carousel.jpg`,
    productId: "2",
  },
  {
    id: 2,
    image: `${CDN}/causality-knit-front.jpg`,
    productId: "1",
  },
  {
    id: 3,
    image: `${CDN}/great-red-dragon-front.jpg`,
    productId: "3",
  },
  {
    id: 4,
    image: `${CDN}/tree-of-death-front.jpg`,
    productId: "2",
  },
];
