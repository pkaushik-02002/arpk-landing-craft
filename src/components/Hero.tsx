
import { HeroSection } from '@/components/ui/hero-section-dark';

const Hero = () => {
  return (
    <HeroSection
      title="Professional Web Development"
      subtitle={{
        regular: "We Build Modern ",
        gradient: "Websites That Drive Results",
      }}
      description="ARPK specializes in creating stunning, high-performance websites that help businesses grow. From concept to launch, we deliver exceptional digital experiences."
      ctaText="Start Your Project"
      ctaHref="#contact"
      bottomImage={{
        light: "https://www.launchuicomponents.com/app-light.png",
        dark: "https://www.launchuicomponents.com/app-dark.png",
      }}
      gridOptions={{
        angle: 65,
        opacity: 0.4,
        cellSize: 50,
        lightLineColor: "#4a4a4a",
        darkLineColor: "#2a2a2a",
      }}
    />
  );
};

export default Hero;
