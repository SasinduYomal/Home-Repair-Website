import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { bookingsAPI } from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log('Fetching bookings...');
        // Check if token exists
        const token = localStorage.getItem('token');
        console.log('Token exists:', !!token);
        if (!token) {
          setError('No authentication token found. Please log in again.');
          setLoading(false);
          return;
        }
        
        const response = await bookingsAPI.getMyBookings();
        console.log('Bookings fetched successfully:', response.data);
        setBookings(response.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        if (err.response) {
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          if (err.response.status === 401) {
            setError('Authentication failed. Please log in again.');
            // Remove invalid token
            localStorage.removeItem('token');
          } else {
            setError(`Failed to fetch bookings: ${err.response.data.message || err.response.statusText}`);
          }
        } else if (err.request) {
          console.error('Request made but no response received:', err.request);
          setError('Network error. Please check your connection and try again.');
        } else {
          console.error('Error setting up request:', err.message);
          setError(`Failed to fetch bookings: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your bookings...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-xl text-blue-100">View and manage your service appointments</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <i className="fas fa-exclamation-circle text-red-500 mr-2"></i>
                  <span className="text-red-700">{error}</span>
                </div>
                {error.includes('Authentication') && (
                  <Link 
                    to="/login" 
                    className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Go to Login
                  </Link>
                )}
              </div>
            )}

            {bookings.length === 0 && !loading && !error && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-calendar text-gray-400 text-2xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Yet</h2>
                <p className="text-gray-600 mb-6">You haven't made any bookings. Start by exploring our services.</p>
                <Link 
                  to="/services" 
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Browse Services
                </Link>
              </div>
            )}

            {bookings.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Your Bookings ({bookings.length})</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center">
                            <div className="mb-2 md:mb-0 md:mr-6">
                              <h3 className="text-lg font-semibold text-gray-800">
                                {booking.service?.title || 'Service Title'}
                              </h3>
                              <p className="text-gray-600">
                                with {booking.technician?.name || 'Technician Name'}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 md:mt-0">
                              <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Date</div>
                                <div className="font-medium">{formatDate(booking.date)}</div>
                              </div>
                              
                              <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Time</div>
                                <div className="font-medium">{booking.time}</div>
                              </div>
                              
                              <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Amount</div>
                                <div className="font-medium">${booking.totalPrice.toFixed(2)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center mt-4 md:mt-0">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium mb-2 sm:mb-0 sm:mr-3 ${getStatusBadgeClass(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                          
                          <Link 
                            to={`/booking/${booking._id}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyBookings;