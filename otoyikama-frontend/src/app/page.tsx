import { Button } from "@/components/ui/Button";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";

export default function HomePage() {
  return (
    // İleride buraya 'Testimonials' gibi yeni bileşenler gap ile eklenecek.
    <div className="flex flex-col w-full">
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}