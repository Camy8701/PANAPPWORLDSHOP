import HeroSlider from "@/components/home/HeroSlider";
import { useProducts } from "@/hooks/useProducts";
import HeroGallerySection from "@/components/home/HeroGallerySection";

const Index = () => {
  const { data: products = [], isLoading } = useProducts();

  return (
    <main>
      <HeroSlider products={products} />
      <HeroGallerySection />
    </main>
  );
};

export default Index;
