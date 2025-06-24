
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import TrustedBy from "@/components/TrustedBy";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  return (
    <div className="min-h-screen flex">
      {/* Chat Interface - Left Side */}
      <div className="w-1/3 max-w-md min-w-[320px] h-screen sticky top-0">
        <ChatInterface />
      </div>
      
      {/* Main Content - Right Side */}
      <div className="flex-1 bg-white dark:bg-gray-900">
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
    </div>
  );
};

export default Index;
