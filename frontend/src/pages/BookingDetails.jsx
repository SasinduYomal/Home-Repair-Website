import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { bookingsAPI } from '../services/api';
import { jsPDF } from 'jspdf';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await bookingsAPI.getBookingById(id);
        setBooking(response.data);
      } catch (err) {
        setError('Failed to fetch booking details');
        console.error('Error fetching booking:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBooking();
    }
  }, [id]);

  const handleCancelBooking = async () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingsAPI.cancelBooking(id);
        // Refresh the booking details
        const response = await bookingsAPI.getBookingById(id);
        setBooking(response.data);
      } catch (err) {
        console.error('Error cancelling booking:', err);
        alert('Failed to cancel booking');
      }
    }
  };

  // Function to generate and download PDF
  const downloadBookingPDF = () => {
    if (!booking) return;

    // Create new PDF document
    const doc = new jsPDF();
    
    // Set font and title
    doc.setFontSize(22);
    doc.text("Booking Details", 105, 20, null, null, "center");
    
    // Add company info
    doc.setFontSize(12);
    doc.text("HomeRepair Services", 105, 30, null, null, "center");
    doc.text("contact@homerepair.com | (123) 456-7890", 105, 37, null, null, "center");
    
    // Add horizontal line
    doc.line(20, 45, 190, 45);
    
    // Booking details section
    doc.setFontSize(16);
    doc.text("Booking Information", 20, 55);
    
    doc.setFontSize(12);
    doc.text(`Booking ID: ${booking._id}`, 20, 65);
    doc.text(`Status: ${booking.status}`, 20, 72);
    doc.text(`Created: ${new Date(booking.createdAt).toLocaleString()}`, 20, 79);
    
    // Service information
    doc.setFontSize(14);
    doc.text("Service Information", 20, 95);
    
    doc.setFontSize(12);
    doc.text(`Service: ${booking.service?.title || 'Not specified'}`, 25, 105);
    doc.text(`Technician: ${booking.technician?.name || 'Not specified'}`, 25, 112);
    doc.text(`Date & Time: ${new Date(booking.date).toLocaleDateString()} at ${booking.time}`, 25, 119);
    
    // Customer information
    doc.setFontSize(14);
    doc.text("Customer Information", 20, 135);
    
    doc.setFontSize(12);
    doc.text(`Name: ${booking.customerInfo?.name || 'Not specified'}`, 25, 145);
    doc.text(`Email: ${booking.customerInfo?.email || 'Not specified'}`, 25, 152);
    doc.text(`Phone: ${booking.customerInfo?.phone || 'Not specified'}`, 25, 159);
    doc.text(`Address:`, 25, 166);
    doc.text(`${booking.customerInfo?.address?.street || ''}`, 30, 173);
    doc.text(`${booking.customerInfo?.address?.city || ''}, ${booking.customerInfo?.address?.zipCode || ''}`, 30, 180);
    
    // Payment information
    doc.setFontSize(14);
    doc.text("Payment Information", 20, 196);
    
    doc.setFontSize(12);
    doc.text(`Payment Method: ${booking.paymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery'}`, 25, 206);
    doc.text(`Transaction ID: ${booking.transactionId || 'N/A'}`, 25, 213);
    doc.text(`Total Amount: $${booking.totalPrice.toFixed(2)}`, 25, 220);
    
    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Thank you for choosing HomeRepair Services!", 105, 270, null, null, "center");
    doc.text("This is an automated confirmation. Please retain for your records.", 105, 275, null, null, "center");
    
    // Save the PDF
    doc.save(`booking-details-${booking._id}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading booking details...</p>
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
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
            <i className="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
            <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <Link 
              to="/my-bookings" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to My Bookings
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md text-center">
            <i className="fas fa-calendar-times text-gray-400 text-4xl mb-4"></i>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link 
              to="/my-bookings" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to My Bookings
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
      
      {/* Header */}
      <div className="py-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Booking Details</h1>
          <p className="text-xl max-w-3xl text-blue-100">
            View your service appointment details
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 bg-gray-50 flex-grow">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking #{booking._id.substring(0, 8)}</h2>
                  <p className="text-gray-600">
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Service Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Service Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="w-12 text-gray-500">
                        <i className="fas fa-toolbox"></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Service</div>
                        <div className="text-gray-600">{booking.service?.title || 'Service'}</div>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-12 text-gray-500">
                        <i className="fas fa-user"></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Technician</div>
                        <div className="text-gray-600">{booking.technician?.name || 'Technician'}</div>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-12 text-gray-500">
                        <i className="fas fa-calendar"></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Date & Time</div>
                        <div className="text-gray-600">
                          {new Date(booking.date).toLocaleDateString()} at {booking.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Customer Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Customer Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="w-12 text-gray-500">
                        <i className="fas fa-user"></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Name</div>
                        <div className="text-gray-600">{booking.customerInfo?.name || 'N/A'}</div>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-12 text-gray-500">
                        <i className="fas fa-envelope"></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Email</div>
                        <div className="text-gray-600">{booking.customerInfo?.email || 'N/A'}</div>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-12 text-gray-500">
                        <i className="fas fa-phone"></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Phone</div>
                        <div className="text-gray-600">{booking.customerInfo?.phone || 'N/A'}</div>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-12 text-gray-500">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Service Address</div>
                        <div className="text-gray-600">
                          {booking.customerInfo?.address?.street || ''}<br />
                          {booking.customerInfo?.address?.city || ''}, {booking.customerInfo?.address?.zipCode || ''}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex">
                      <div className="w-12 text-gray-500">
                        <i className="fas fa-credit-card"></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Payment Method</div>
                        <div className="text-gray-600">
                          {booking.paymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery'}
                        </div>
                      </div>
                    </div>
                    
                    {booking.transactionId && (
                      <div className="flex mt-4">
                        <div className="w-12 text-gray-500">
                          <i className="fas fa-receipt"></i>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">Transaction ID</div>
                          <div className="text-gray-600 font-mono">{booking.transactionId}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span>Total Amount:</span>
                      <span className="font-bold">${booking.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={downloadBookingPDF}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <i className="fas fa-download mr-2"></i>
                  Download Details
                </button>
                <Link 
                  to="/my-bookings" 
                  className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to Bookings
                </Link>
              </div>
              
              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                <button
                  onClick={handleCancelBooking}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <i className="fas fa-times-circle mr-2"></i>
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingDetails;