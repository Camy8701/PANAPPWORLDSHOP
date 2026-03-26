import HeroSlider from "@/components/home/HeroSlider";
import ProductGrid from "@/components/home/ProductGrid";
import { products } from "@/data/placeholder";

const Index = () => {
  return (
    <main>
      <HeroSlider />
      <ProductGrid products={products} />
    </main>
  );
};

export default Index;
