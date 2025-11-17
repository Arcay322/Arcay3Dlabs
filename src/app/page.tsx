import { Header } from "@/components/layout/header";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { QuoteForm } from "@/components/sections/quote-form";
import { Gallery } from "@/components/sections/gallery";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <FeaturedProducts />
        <QuoteForm />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
