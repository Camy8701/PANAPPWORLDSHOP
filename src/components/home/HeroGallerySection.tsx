import {
  ContainerAnimated,
  ContainerScroll,
  ContainerStagger,
  ContainerSticky,
  GalleryCol,
  GalleryContainer,
} from "@/components/blocks/animated-gallery";
import { Button } from "@/components/ui/button";
import { Video as VideoIcon } from "lucide-react";
import { Link } from "react-router-dom";

type GalleryItem = {
  src: string;
  alt: string;
  href?: string;
  label?: string;
  objectPosition?: string;
  imageClassName?: string;
};

const IMAGES_1: GalleryItem[] = [
  {
    src: "https://images.unsplash.com/photo-1529218402470-5dec8fea0761?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGFkfGVufDB8fDB8fHww",
    alt: "Editorial city image",
  },
  {
    src: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRva3lvfGVufDB8MHwwfHx8Mg%3D%3D",
    alt: "Street portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1604928141064-207cea6f571f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dG9reW98ZW58MHwwfDB8fHwy",
    alt: "Neon city scene",
  },
];

const IMAGES_2: GalleryItem[] = [
  {
    src: "https://images.unsplash.com/photo-1542052125323-e69ad37a47c2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHRva3lvfGVufDB8MHwwfHx8Mg%3D%3D",
    alt: "Urban scene",
  },
  {
    src: "https://images.unsplash.com/photo-1564284369929-026ba231f89b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Creative studio",
  },
  {
    src: "https://images.unsplash.com/photo-1532236204992-f5e85c024202?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fHRva3lvfGVufDB8MHwwfHx8Mg%3D%3D",
    alt: "Night lights",
  },
  {
    src: "https://images.unsplash.com/photo-1493515322954-4fa727e97985?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRva3lvfGVufDB8MHwwfHx8Mg%3D%3D",
    alt: "Fashion editorial image",
  },
];

const IMAGES_3: GalleryItem[] = [
  {
    src: "/malcolm-x-wallpaper.webp",
    alt: "Malcolm X portrait",
    href: "/product/malcolm-x-tribute-tee",
    label: "MALCOLM X",
    objectPosition: "60% 34%",
    imageClassName: "scale-[1.18]",
  },
  {
    src: "https://images.unsplash.com/photo-1608875004752-2fdb6a39ba4c?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Black and white portrait",
  },
];

const GalleryCard = ({ item }: { item: GalleryItem }) => {
  const media = (
    <>
      <img
        className={[
          "block aspect-video h-auto max-h-full w-full rounded-md object-cover shadow transition-transform duration-300",
          item.imageClassName ?? "",
        ].join(" ")}
        src={item.src}
        alt={item.alt}
        style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
      />
      {item.label ? (
        <div className="absolute inset-0 flex items-end rounded-md bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="text-sm font-black uppercase tracking-[0.28em] text-white md:text-base">
            {item.label}
          </span>
        </div>
      ) : null}
    </>
  );

  if (item.href) {
    return (
      <Link to={item.href} className="group relative block overflow-hidden rounded-md">
        {media}
      </Link>
    );
  }

  return <div className="relative">{media}</div>;
};

const HeroGallerySection = () => {
  return (
    <div className="relative bg-white">
      <ContainerStagger className="relative z-[9999] -mb-12 place-self-center px-6 pt-12 text-center">
        <ContainerAnimated>
          <h1 className="font-serif text-4xl font-extralight md:text-5xl">
            Your{" "}
            <span className="font-serif font-extralight text-indigo-600">
              one source
            </span>
          </h1>
        </ContainerAnimated>
        <ContainerAnimated>
          <h1 className="font-serif text-4xl font-extralight md:text-5xl">
            for all your designs
          </h1>
        </ContainerAnimated>

        <ContainerAnimated className="my-4">
          <p className="leading-normal tracking-tight text-muted-foreground">
            No waste of time and money, we provide you with
            <br /> collection of designs to plan your next project.
          </p>
        </ContainerAnimated>

        <ContainerAnimated>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button className="gap-1 bg-indigo-700">
              Book free call <VideoIcon className="size-4" />
            </Button>
            <Button variant={"link"} className="text-sencondary">
              About Us
            </Button>
          </div>
        </ContainerAnimated>
      </ContainerStagger>

      <div
        className="pointer-events-none absolute z-10 h-[70vh] w-full"
        style={{
          background: "linear-gradient(to right, gray, rebeccapurple, blue)",
          filter: "blur(84px)",
          mixBlendMode: "screen",
        }}
      />

      <ContainerScroll className="relative h-[350vh]">
        <ContainerSticky className="h-svh">
          <GalleryContainer className="">
            <GalleryCol yRange={["-10%", "2%"]} className="-mt-2">
              {IMAGES_1.map((item, index) => (
                <GalleryCard
                  key={`${item.src}-${index}`}
                  item={item}
                />
              ))}
            </GalleryCol>
            <GalleryCol className="mt-[-50%]" yRange={["15%", "5%"]}>
              {IMAGES_2.map((item, index) => (
                <GalleryCard
                  key={`${item.src}-${index}`}
                  item={item}
                />
              ))}
            </GalleryCol>
            <GalleryCol yRange={["-10%", "2%"]} className="-mt-2">
              {IMAGES_3.map((item, index) => (
                <GalleryCard
                  key={`${item.src}-${index}`}
                  item={item}
                />
              ))}
            </GalleryCol>
          </GalleryContainer>
        </ContainerSticky>
      </ContainerScroll>
    </div>
  );
};

export default HeroGallerySection;
