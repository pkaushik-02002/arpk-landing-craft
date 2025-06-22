
import { Globe, Smartphone, Zap, Shield, Headphones, BarChart } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Globe,
      title: "Modern Web Design",
      description: "Beautiful, responsive websites that look perfect on all devices and browsers."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed with latest technologies ensuring quick load times."
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Every website is designed with mobile users in mind from the ground up."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Built with security best practices and reliable hosting solutions."
    },
    {
      icon: BarChart,
      title: "SEO Optimized",
      description: "Search engine optimized to help your business get found online."
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Ongoing support and maintenance to keep your website running smoothly."
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose ARPK?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We combine cutting-edge technology with creative design to deliver websites 
            that not only look amazing but also drive business results.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
            >
              <div className="bg-blue-100 rounded-xl p-3 w-fit mb-6 group-hover:bg-blue-200 transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
