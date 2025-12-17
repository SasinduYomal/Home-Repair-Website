import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-700 text-white">
      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Professional Home Repair & Maintenance Services
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Connect with trusted technicians for all your plumbing, electrical, cleaning, and repair needs. Fast, reliable, and affordable service at your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/services" 
                className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold text-lg hover:bg-blue-50 transition duration-300 text-center"
              >
                Book a Service
              </Link>
              <Link 
                to="/about" 
                className="border-2 border-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-white hover:text-blue-600 transition duration-300 text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-white p-4 rounded-lg shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
                alt="Home Repair Service" 
                className="rounded-lg w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;