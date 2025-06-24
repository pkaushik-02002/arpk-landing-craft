
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import TrustedBy from "@/components/TrustedBy";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Navbar />
      <Hero />
      <Features />
      <TrustedBy />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
