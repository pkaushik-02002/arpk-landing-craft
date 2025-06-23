
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects";

const Features = () => {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose ARPK?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the features that make ARPK the perfect choice for your business needs
          </p>
        </div>
        <FeaturesSectionWithHoverEffects />
      </div>
    </section>
  );
};

export default Features;
