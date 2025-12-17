import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { servicesAPI, categoriesAPI } from '../services/api';

const Home = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both services and categories in parallel
        const [servicesResponse, categoriesResponse] = await Promise.all([
          servicesAPI.getAllServices(),
          categoriesAPI.getAllCategories()
        ]);

        // Transform services data
        const transformedServices = servicesResponse.data.map(service => ({
          id: service._id,
          category: service.category,
          title: service.title,
          description: service.description,
          image: service.image,
          icon: service.icon,
          price: service.price
        }));

        // Transform categories data
        const transformedCategories = categoriesResponse.data
          .filter(category => category.status === 'Active')
          .map(category => ({
            name: category.name,
            image: category.image,
            icon: category.icon
          }));

        setServices(transformedServices);
        setCategories(transformedCategories);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get featured services (first 6 services)
  const featuredServices = services.slice(0, 6);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="text-center">
            <div className="text-red-500 text-2xl mb-4">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <p className="text-gray-800 text-xl mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Professional Home Services You Can Trust</h1>
            <p className="text-xl mb-8 text-blue-100">
              Expert solutions for all your home repair and maintenance needs. Quality workmanship guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/services" 
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
              >
                Book a Service
              </Link>
              <Link 
                to="/contact" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide a wide range of professional home services to keep your property in perfect condition.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <i className={`${service.icon} text-blue-600`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">{service.price}</span>
                    <Link 
                      to={`/service/${service.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/services" 
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-lg font-bold hover:from-blue-700 hover:to-indigo-800 transition shadow-lg"
            >
              View All Services
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Browse by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find the perfect service for your home needs with our specialized categories.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center hover:shadow-lg transition cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-10 h-10 object-contain"
                    />
                  ) : category.icon ? (
                    <i className={`${category.icon} text-blue-600 text-2xl`}></i>
                  ) : (
                    <span className="text-blue-600 font-bold text-xl">{category.name.charAt(0)}</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{category.name}</h3>
                <Link 
                  to={`/services?category=${category.name}`}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Explore Services →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose HomeRepair?</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              We stand out from the competition with our commitment to excellence and customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-award text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Licensed Professionals</h3>
              <p className="text-blue-100">
                All our technicians are licensed, insured, and extensively trained in their specialties.
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Satisfaction Guarantee</h3>
              <p className="text-blue-100">
                We guarantee our work and offer a warranty on all services to ensure your peace of mind.
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clock text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Prompt Service</h3>
              <p className="text-blue-100">
                We respect your time and arrive on schedule, completing jobs efficiently and cleanly.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;