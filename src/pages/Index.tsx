import HeroSlider from "@/components/home/HeroSlider";
import ProductGrid from "@/components/home/ProductGrid";
import { products } from "@/data/placeholder";

const Index = () => {
  const featured = products.filter((p) => p.featured);

  return (
    <main>
      <HeroSlider />
      <ProductGrid products={featured} title="FEATURED" />
      <ProductGrid products={products} title="ALL PRODUCTS" />
    </main>
  );
};

export default Index;
