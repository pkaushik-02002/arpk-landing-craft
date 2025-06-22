
const TrustedBy = () => {
  const brands = [
    "TechCorp", "InnovateX", "StartupHub", "DigitalPro", "WebSolutions", "CloudTech"
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-gray-500 tracking-wide uppercase mb-4">
            Trusted by Leading Companies
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-60">
          {brands.map((brand, index) => (
            <div
              key={brand}
              className="text-center hover:opacity-100 transition-opacity duration-300"
            >
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-lg font-bold text-gray-700">{brand}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Join <span className="font-semibold text-blue-600">50+</span> satisfied clients who trust ARPK
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
