
const TrustedBy = () => {
  const brands = [
    {
      name: "Figma",
      logo: "/lovable-uploads/caf52266-b50f-42e6-8441-d48ede18eeb0.png",
      alt: "Figma Logo"
    },
    {
      name: "Stripe",
      logo: "/lovable-uploads/4af2ab63-9747-4511-b3d9-2b416f3f6d11.png",
      alt: "Stripe Logo"
    },
    {
      name: "Firebase",
      logo: "/lovable-uploads/201ee9d1-17b1-4d79-8f0d-adaa106d3cdb.png",
      alt: "Firebase Logo"
    },
    {
      name: "Figma Light",
      logo: "/lovable-uploads/d5ea309a-4091-486f-8f25-cc9cef2d9ccb.png",
      alt: "Figma Light Logo"
    },
    {
      name: "Brand 5",
      logo: "/lovable-uploads/27f2ab12-de05-4636-94ba-325f20e1e072.png",
      alt: "Brand 5 Logo"
    },
    {
      name: "Brand 6",
      logo: "/lovable-uploads/47ed4d34-b921-42c8-8b08-4a595f6d09a3.png",
      alt: "Brand 6 Logo"
    }
  ];

  // Duplicate the brands array to create seamless loop
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section className="py-16 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase mb-4">
            Trusted by Leading Companies
          </h2>
        </div>
        
        {/* Marquee Container */}
        <div className="relative">
          <div className="flex animate-marquee space-x-12 items-center">
            {duplicatedBrands.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex-shrink-0 group cursor-pointer"
              >
                <div className="rounded-lg p-6 hover:bg-accent transition-all duration-300 group-hover:scale-105 min-w-[200px] h-24 flex items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={brand.alt}
                    className="max-h-12 max-w-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Join <span className="font-semibold text-primary">50+</span> satisfied clients who trust ARPK
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
