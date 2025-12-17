import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { jsPDF } from "jspdf";
import { bookingsAPI } from '../services/api';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData, paymentData, transactionId } = location.state || {};

  // Generate a random booking ID if not provided
  const bookingId = bookingData?.bookingId || 'BK-' + Math.floor(Math.random() * 1000000);
  
  // State for booking
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create booking in database when component mounts
  useEffect(() => {
    const createBookingInDatabase = async () => {
      if (bookingData && paymentData) {
        setLoading(true);
        setError(null);
        
        // Debug: Check if token exists
        const token = localStorage.getItem('token');
        console.log('Token exists:', !!token);
        if (token) {
          console.log('Token length:', token.length);
        } else {
          console.log('No token found in localStorage');
          setError('Authentication required. Please log in again.');
          setLoading(false);
          return;
        }
        
        try {
          // Prepare customer info with proper validation
          // Try to get name from various sources
          let customerName = '';
          if (paymentData.cardName && paymentData.cardName.trim()) {
            customerName = paymentData.cardName.trim();
          } else if (paymentData.name && paymentData.name.trim()) {
            customerName = paymentData.name.trim();
          }
          
          const customerInfo = {
            name: customerName || 'Unknown Customer',
            email: paymentData.email?.trim() || 'unknown@example.com',
            phone: paymentData.phone?.trim() || '',
            address: {
              street: paymentData.billingAddress?.trim() || '',
              city: paymentData.city?.trim() || '',
              zipCode: paymentData.zipCode?.trim() || '',
            }
          };

          // Validate required fields
          if (!customerInfo.name || customerInfo.name === 'Unknown Customer') {
            throw new Error('Customer name is required. Please provide your full name.');
          }
          
          if (!customerInfo.email || customerInfo.email === 'unknown@example.com') {
            throw new Error('Customer email is required. Please provide your email address.');
          }

          console.log('Creating booking with data:', {
            service: bookingData.serviceId || bookingData.service,
            technician: bookingData.technicianId || bookingData.technician,
            date: bookingData.date,
            time: bookingData.time,
            totalPrice: parseFloat(bookingData.total || 0),
            paymentMethod: paymentData.paymentMethod || 'card',
            transactionId: transactionId,
            customerInfo: customerInfo
          });

          const bookingPayload = {
            service: bookingData.serviceId || bookingData.service,
            technician: bookingData.technicianId || bookingData.technician,
            date: bookingData.date,
            time: bookingData.time,
            totalPrice: parseFloat(bookingData.total || 0),
            paymentMethod: paymentData.paymentMethod || 'card',
            transactionId: transactionId,
            customerInfo: customerInfo
          };

          const response = await bookingsAPI.createBooking(bookingPayload);
          console.log('Booking created successfully:', response.data);
          setBooking(response.data);
        } catch (error) {
          console.error('Error creating booking:', error);
          if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            if (error.response.status === 401) {
              setError('Authentication failed. Please log in again.');
              // Remove invalid token
              localStorage.removeItem('token');
            } else {
              setError(error.response.data.message || 'Failed to create booking');
            }
          } else {
            setError(error.message || 'Failed to create booking');
          }
          // Even if there's an error, we still want to show the confirmation page
        } finally {
          setLoading(false);
        }
      }
    };

    createBookingInDatabase();
  }, [bookingData, paymentData, transactionId]);

  // Function to generate and download PDF
  const downloadBookingPDF = () => {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Set font and title
    doc.setFontSize(22);
    doc.text("Booking Confirmation", 105, 20, null, null, "center");
    
    // Add company info
    doc.setFontSize(12);
    doc.text("HomeRepair Services", 105, 30, null, null, "center");
    doc.text("contact@homerepair.com | (123) 456-7890", 105, 37, null, null, "center");
    
    // Add horizontal line
    doc.line(20, 45, 190, 45);
    
    // Booking details section
    doc.setFontSize(16);
    doc.text("Booking Details", 20, 55);
    
    doc.setFontSize(12);
    doc.text(`Booking ID: ${booking?._id || bookingId}`, 20, 65);
    doc.text(`Transaction ID: ${transactionId || 'N/A'}`, 20, 72);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 79);
    
    // Service information
    doc.setFontSize(14);
    doc.text("Service Information", 20, 95);
    
    doc.setFontSize(12);
    doc.text(`Service: ${bookingData?.serviceName || 'Not specified'}`, 25, 105);
    doc.text(`Technician: ${bookingData?.technicianName || 'Not specified'}`, 25, 112);
    doc.text(`Date & Time: ${bookingData?.date || 'Not specified'} at ${bookingData?.time || 'Not specified'}`, 25, 119);
    doc.text(`Duration: ${bookingData?.duration || 'Not specified'}`, 25, 126);
    
    // Customer information
    doc.setFontSize(14);
    doc.text("Customer Information", 20, 142);
    
    doc.setFontSize(12);
    doc.text(`Name: ${paymentData?.cardName || paymentData?.name || 'John Doe'}`, 25, 152);
    doc.text(`Email: ${paymentData?.email || 'john@example.com'}`, 25, 159);
    doc.text(`Phone: ${paymentData?.phone || 'Not specified'}`, 25, 166);
    doc.text(`Address:`, 25, 173);
    doc.text(`${paymentData?.billingAddress || ''}`, 30, 180);
    doc.text(`${paymentData?.city || ''}, ${paymentData?.zipCode || ''}`, 30, 187);
    
    // Payment summary
    doc.setFontSize(14);
    doc.text("Payment Summary", 20, 203);
    
    doc.setFontSize(12);
    doc.text(`Subtotal: $${bookingData?.subtotal || '89.00'}`, 25, 213);
    doc.text(`Tax: $${bookingData?.tax || '8.90'}`, 25, 220);
    doc.text(`Service Fee: $${bookingData?.fee || '9.90'}`, 25, 227);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Paid: $${bookingData?.total || '107.80'}`, 25, 237);
    
    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Thank you for choosing HomeRepair Services!", 105, 270, null, null, "center");
    doc.text("This is an automated confirmation. Please retain for your records.", 105, 275, null, null, "center");
    
    // Save the PDF
    doc.save(`booking-confirmation-${booking?._id || bookingId}.pdf`);
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Confirmation Header */}
      <div className="py-16 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-check text-green-500 text-3xl"></i>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Booking Confirmed!</h1>
          <p className="text-xl max-w-3xl mx-auto text-green-100">
            Thank you for your booking. Your service appointment has been successfully scheduled.
          </p>
        </div>
      </div>

      {/* Confirmation Content */}
      <div className="py-12 bg-gray-50 flex-grow">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">Error: {error}</p>
                {error.includes('Authentication') && (
                  <button
                    onClick={handleLoginRedirect}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Go to Login
                  </button>
                )}
              </div>
            )}
            
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Details</h2>
                <p className="text-gray-600">Your booking reference: <span className="font-mono font-bold">{booking?._id || bookingId}</span></p>
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
                        <div className="text-gray-600">{bookingData?.serviceName || 'Plumbing Service'}</div>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-12 text-gray-500">
                        <i className="fas fa-user"></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Technician</div>
                        <div className="text-gray-600">{bookingData?.technicianName || 'John Smith'}</div>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-12 text-gray-500">
                        <i className="fas fa-calendar"></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Date & Time</div>
                        <div className="text-gray-600">{bookingData?.date || 'Dec 15, 2023'} at {bookingData?.time || '10:00 AM'}</div>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-12 text-gray-500">
                        <i className="fas fa-clock"></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Duration</div>
                        <div className="text-gray-600">{bookingData?.duration || '2 hours'}</div>
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
                        <div className="text-gray-600">{paymentData?.cardName || paymentData?.name || 'John Doe'}</div>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-12 text-gray-500">
                        <i className="fas fa-envelope"></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Email</div>
                        <div className="text-gray-600">{paymentData?.email || 'john@example.com'}</div>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-12 text-gray-500">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Service Address</div>
                        <div className="text-gray-600">
                          {paymentData?.billingAddress || '123 Main Street'}<br />
                          {paymentData?.city || 'New York'}, {paymentData?.zipCode || '10001'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-12 text-gray-500">
                        <i className="fas fa-receipt"></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Transaction ID</div>
                        <div className="text-gray-600 font-mono">{transactionId || 'TXN-1234567'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Summary */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Summary</h3>
                
                <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>${bookingData?.subtotal || '89.00'}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Tax:</span>
                    <span>${bookingData?.tax || '8.90'}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Service Fee:</span>
                    <span>${bookingData?.fee || '9.90'}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-300">
                    <span>Total Paid:</span>
                    <span>${bookingData?.total || '107.80'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Next Steps</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-calendar-check text-blue-600"></i>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Confirmation Email</h3>
                  <p className="text-gray-600 text-sm">Check your email for booking confirmation and details.</p>
                </div>
                
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-bell text-green-600"></i>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Reminders</h3>
                  <p className="text-gray-600 text-sm">We'll send you reminders before your appointment.</p>
                </div>
                
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-headset text-purple-600"></i>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Customer Support</h3>
                  <p className="text-gray-600 text-sm">Contact us anytime if you need to make changes.</p>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={downloadBookingPDF}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-center flex items-center justify-center"
              >
                <i className="fas fa-download mr-2"></i>
                Download Booking
              </button>
              <Link 
                to="/my-bookings" 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
              >
                <i className="fas fa-list mr-2"></i>
                View My Bookings
              </Link>
              <Link 
                to="/" 
                className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
              >
                <i className="fas fa-home mr-2"></i>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Confirmation;