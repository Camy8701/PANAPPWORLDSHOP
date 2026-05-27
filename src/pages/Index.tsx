import { useMemo } from "react";
import HeroSlider from "@/components/home/HeroSlider";
import { useProducts } from "@/hooks/useProducts";
import HeroGallerySection from "@/components/home/HeroGallerySection";
import PanappWhySection from "@/components/home/PanappWhySection";
import ParallaxDreamSection from "@/components/home/ParallaxDreamSection";
import ProductRail from "@/components/home/ProductRail";
import TrustStrip from "@/components/home/TrustStrip";
import EmailCaptureBand from "@/components/home/EmailCaptureBand";

const Index = () => {
  const { data: products = [], isLoading } = useProducts();

  const newArrivals = useMemo(
    () =>
      [...products]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 8),
    [products]
  );

  const featured = useMemo(
    () => products.filter((p) => p.featured).slice(0, 8),
    [products]
  );

  return (
    <main>
      <HeroSlider products={products} />

      {!isLoading && (
        <ProductRail
          eyebrow="Just dropped"
          title="New Arrivals"
          products={newArrivals}
          layout="grid"
        />
      )}

      <HeroGallerySection />

      {!isLoading && featured.length > 0 && (
        <ProductRail
          eyebrow="Editor's pick"
          title="Featured"
          products={featured}
          layout="scroller"
        />
      )}

      <PanappWhySection />
      <TrustStrip />
      <ParallaxDreamSection />
      <EmailCaptureBand />
    </main>
  );
};

export default Index;
