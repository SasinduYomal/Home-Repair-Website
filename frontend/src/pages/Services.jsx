import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServicesCard from '../components/ServicesCard';
import { servicesAPI, categoriesAPI } from '../services/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter services by category
  const [activeCategory, setActiveCategory] = useState('All');

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
          price: service.price,
          features: service.features.slice(0, 5) // Take only first 5 features
        }));

        // Extract category names
        const categoryNames = categoriesResponse.data.map(category => category.name);

        setServices(transformedServices);
        setCategories(['All', ...categoryNames]);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredServices = activeCategory === 'All' 
    ? services 
    : services.filter(service => service.category === activeCategory);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading services...</p>
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
      
      {/* Services Header */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            Professional home services tailored to your needs. Quality workmanship guaranteed.
          </p>
        </div>
      </div>

      {/* Services Content */}
      <div className="py-12 bg-gray-50 flex-grow">
        <div className="container mx-auto px-4">
          {/* Enhanced Category Filter */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Filter by Category</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map(service => (
                <ServicesCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto">
                <i className="fas fa-tools text-6xl text-gray-300 mb-6"></i>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">No Services Found</h3>
                <p className="text-gray-600 mb-6">
                  {activeCategory === 'All' 
                    ? 'There are currently no services available.' 
                    : `There are no services available in the "${activeCategory}" category.`}
                </p>
                <button 
                  onClick={() => setActiveCategory('All')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-full font-medium hover:from-blue-700 hover:to-indigo-800 transition shadow-lg"
                >
                  View All Services
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Services;