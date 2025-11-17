import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { QuoteForm } from "@/components/sections/quote-form";
import { Gallery } from "@/components/sections/gallery";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FeaturedProducts />
      <QuoteForm />
      <Gallery />
    </>
  );
}
