import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { techniciansAPI } from '../services/api';

const TechnicianDetails = () => {
  const { id } = useParams();
  const [technician, setTechnician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTechnician = async () => {
      try {
        const response = await techniciansAPI.getTechnicianById(id);
        setTechnician(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch technician details');
        setLoading(false);
      }
    };

    fetchTechnician();
  }, [id]);

  // Render stars based on rating
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-yellow-400"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-400"></i>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-yellow-400"></i>);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading technician details...</p>
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
            <Link 
              to="/technicians"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Back to Technicians
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!technician) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="text-center">
            <div className="text-red-500 text-2xl mb-4">
              <i className="fas fa-user-slash"></i>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Technician Not Found</h3>
            <p className="text-gray-600 mb-6">
              The technician you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              to="/technicians"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Back to Technicians
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Technician Header */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        <div className="container mx-auto px-4 relative -mt-32">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl mx-auto">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img 
                  src={technician.image} 
                  alt={technician.name} 
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{technician.name}</h1>
                    <p className="text-blue-600 font-medium">{technician.specialization}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    technician.availability === 'Available' ? 'bg-green-100 text-green-800' :
                    technician.availability === 'Busy' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {technician.availability}
                  </span>
                </div>
                
                <div className="flex items-center mt-4">
                  <div className="flex">
                    {renderRating(technician.rating)}
                  </div>
                  <span className="text-gray-600 ml-2">({technician.rating})</span>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <i className="fas fa-briefcase text-blue-600 mr-2"></i>
                    <span>{technician.experience} years of experience</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-phone-alt text-blue-600 mr-2"></i>
                    <span>{technician.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-envelope text-blue-600 mr-2"></i>
                    <span>{technician.email}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {technician.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technician Details Content */}
      <div className="py-12 bg-gray-50 flex-grow">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About {technician.name}</h2>
            <p className="text-gray-600 leading-relaxed">{technician.bio}</p>
          </div>

          {technician.certifications && technician.certifications.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Certifications</h2>
              <div className="space-y-4">
                {technician.certifications.map((cert, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                    <p className="text-gray-600">Issued by {cert.issuer}</p>
                    {cert.date && (
                      <p className="text-gray-500 text-sm">
                        Issued on {new Date(cert.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/booking"
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-indigo-800 transition shadow-lg text-center"
            >
              Book a Service
            </Link>
            <Link 
              to="/contact"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition text-center"
            >
              Contact Technician
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TechnicianDetails;