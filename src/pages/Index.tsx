import HeroSlider from "@/components/home/HeroSlider";
import { useProducts } from "@/hooks/useProducts";
import HeroGallerySection from "@/components/home/HeroGallerySection";
import PanappWhySection from "@/components/home/PanappWhySection";
import ParallaxDreamSection from "@/components/home/ParallaxDreamSection";

const Index = () => {
  const { data: products = [] } = useProducts();

  return (
    <main>
      <HeroSlider products={products} />
      <HeroGallerySection />
      <PanappWhySection />
      <ParallaxDreamSection />
    </main>
  );
};

export default Index;
