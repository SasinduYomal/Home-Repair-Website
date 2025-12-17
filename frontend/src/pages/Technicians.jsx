import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TechnicianCard from '../components/TechnicianCard';
import { techniciansAPI } from '../services/api';

const Technicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await techniciansAPI.getAllTechnicians();
        setTechnicians(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch technicians');
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading technicians...</p>
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
      
      {/* Technicians Header */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Skilled Technicians</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            Meet our team of experienced professionals dedicated to providing exceptional service.
          </p>
        </div>
      </div>

      {/* Technicians Content */}
      <div className="py-12 bg-gray-50 flex-grow">
        <div className="container mx-auto px-4">
          {technicians.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {technicians.map(technician => (
                <TechnicianCard key={technician._id} technician={technician} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto">
                <i className="fas fa-user-hard-hat text-6xl text-gray-300 mb-6"></i>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">No Technicians Found</h3>
                <p className="text-gray-600 mb-6">
                  There are currently no technicians available.
                </p>
                <Link 
                  to="/"
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-full font-medium hover:from-blue-700 hover:to-indigo-800 transition shadow-lg"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Technicians;