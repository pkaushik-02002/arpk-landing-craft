
import { ArrowRight, Code, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="pt-16 pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <Zap size={16} />
              <span>Professional Web Development</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            We Build
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Modern </span>
            Websites That Drive Results
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            ARPK specializes in creating stunning, high-performance websites that help businesses grow. 
            From concept to launch, we deliver exceptional digital experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 hover:scale-105">
              Start Your Project
              <ArrowRight size={20} />
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
              View Our Work
            </button>
          </div>
          
          <div className="mt-16">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center text-gray-500 mb-4">
                <Code size={24} />
                <span className="ml-2 text-sm font-medium">Latest Technologies</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="p-4">
                  <div className="text-2xl font-bold text-blue-600 mb-1">React</div>
                  <div className="text-sm text-gray-600">Frontend</div>
                </div>
                <div className="p-4">
                  <div className="text-2xl font-bold text-green-600 mb-1">Node.js</div>
                  <div className="text-sm text-gray-600">Backend</div>
                </div>
                <div className="p-4">
                  <div className="text-2xl font-bold text-purple-600 mb-1">Next.js</div>
                  <div className="text-sm text-gray-600">Full-stack</div>
                </div>
                <div className="p-4">
                  <div className="text-2xl font-bold text-orange-600 mb-1">AWS</div>
                  <div className="text-sm text-gray-600">Cloud</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
