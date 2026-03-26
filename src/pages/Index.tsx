import HeroSlider from "@/components/home/HeroSlider";
import ProductGrid from "@/components/home/ProductGrid";
import { useProducts } from "@/hooks/useProducts";

const Index = () => {
  const { data: products = [], isLoading } = useProducts();

  return (
    <main>
      <HeroSlider products={products} />
      {isLoading ? null : <ProductGrid products={products} />}
    </main>
  );
};

export default Index;
