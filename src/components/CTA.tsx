
import { ArrowRight, Mail, Phone } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 dark:from-blue-800 dark:via-purple-800 dark:to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Online Presence?
          </h2>
          <p className="text-xl text-blue-100 dark:text-purple-100 mb-8 max-w-3xl mx-auto">
            Let's discuss your project and create something amazing together. 
            Get a free consultation and quote for your next website.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="bg-white dark:bg-gray-900 text-blue-600 dark:text-purple-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 flex items-center gap-2 hover:scale-105">
              Get Free Quote
              <ArrowRight size={20} />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 dark:hover:text-purple-600 transition-all duration-300">
              View Portfolio
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto">
            <div className="flex items-center justify-center text-white">
              <Mail size={20} className="mr-2" />
              <span>hello@arpk.dev</span>
            </div>
            <div className="flex items-center justify-center text-white">
              <Phone size={20} className="mr-2" />
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
