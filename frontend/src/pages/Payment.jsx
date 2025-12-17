import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get booking data from location state (if available)
  const bookingData = location.state || {};
  
  // Form state
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    email: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: 'United States',
    saveInfo: false
  });
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate payment processing
    try {
      // In a real app, you would integrate with a payment gateway here
      // For demo purposes, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.2; // 80% success rate
      
      if (isSuccess) {
        setSuccess(true);
        // Redirect to confirmation page after a delay
        setTimeout(() => {
          navigate('/confirmation', { 
            state: { 
              bookingData,
              paymentData: formData,
              transactionId: 'TXN-' + Math.floor(Math.random() * 1000000)
            } 
          });
        }, 2000);
      } else {
        throw new Error('Payment processing failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during payment processing.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format card number as user types
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };
  
  // Handle card number input with formatting
  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      cardNumber: formattedValue
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <a href="/" className="text-blue-600 hover:underline">Home</a>
            <span className="mx-2 text-gray-400">/</span>
            <a href="/services" className="text-blue-600 hover:underline">Services</a>
            <span className="mx-2 text-gray-400">/</span>
            <a href="/booking" className="text-blue-600 hover:underline">Booking</a>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">Payment</span>
          </nav>
        </div>
      </div>

      {/* Payment Header */}
      <div className="py-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Secure Payment</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            Complete your booking by securely paying for your service. 
            All transactions are encrypted and protected.
          </p>
        </div>
      </div>

      {/* Payment Content */}
      <div className="py-12 bg-gray-50 flex-grow">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                    Payment processing successful! Redirecting to confirmation...
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  {/* Payment Method Selection */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer text-center ${
                          paymentMethod === 'card' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <i className="fab fa-cc-visa text-2xl text-blue-600 mb-2"></i>
                        <div className="font-medium text-gray-800">Credit Card</div>
                      </div>
                      
                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer text-center ${
                          paymentMethod === 'cod' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setPaymentMethod('cod')}
                      >
                        <i className="fas fa-money-bill-wave text-2xl text-green-600 mb-2"></i>
                        <div className="font-medium text-gray-800">Cash on Delivery</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Credit Card Form */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="cardNumber">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength="19"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <i className="far fa-credit-card text-gray-400"></i>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 font-medium mb-2" htmlFor="expiryDate">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 font-medium mb-2" htmlFor="cvv">
                            CVV
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              id="cvv"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleChange}
                              maxLength="4"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                              placeholder="123"
                              required
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <i className="fas fa-question-circle text-gray-400"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="cardName">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Cash on Delivery Form */}
                  {paymentMethod === 'cod' && (
                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                      <i className="fas fa-money-bill-wave text-5xl text-green-600 mb-4"></i>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Cash on Delivery</h3>
                      <p className="text-gray-600 mb-6">
                        Pay with cash when your service is completed. 
                        Please have the exact amount ready for the technician.
                      </p>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
                        <h4 className="font-semibold text-yellow-800 mb-2">Important Information</h4>
                        <ul className="text-yellow-700 text-sm list-disc pl-5 space-y-1">
                          <li>Have exact cash amount ready for the technician</li>
                          <li>Technician will provide an official receipt</li>
                          <li>No additional fees for cash payments</li>
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {/* Billing Information */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Billing Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="billingAddress">
                          Billing Address
                        </label>
                        <input
                          type="text"
                          id="billingAddress"
                          name="billingAddress"
                          value={formData.billingAddress}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="123 Main Street"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="city">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="City"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="zipCode">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="12345"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="country">
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="saveInfo"
                          checked={formData.saveInfo}
                          onChange={handleChange}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">Save my information for future purchases</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={isLoading || success}
                      className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-colors ${
                        isLoading || success
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing Payment...
                        </div>
                      ) : success ? (
                        'Payment Successful!'
                      ) : (
                        paymentMethod === 'card' ? 'Pay with Credit Card' : 'Confirm Cash on Delivery'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between pb-2 border-b border-gray-200">
                    <span className="font-medium">Service:</span>
                    <span>{bookingData.serviceName || 'Plumbing Service'}</span>
                  </div>
                  
                  <div className="flex justify-between pb-2 border-b border-gray-200">
                    <span className="font-medium">Technician:</span>
                    <span>{bookingData.technicianName || 'John Smith'}</span>
                  </div>
                  
                  <div className="flex justify-between pb-2 border-b border-gray-200">
                    <span className="font-medium">Date & Time:</span>
                    <span>{bookingData.date || 'Dec 15, 2023'} at {bookingData.time || '10:00 AM'}</span>
                  </div>
                  
                  <div className="flex justify-between pb-2 border-b border-gray-200">
                    <span className="font-medium">Duration:</span>
                    <span>{bookingData.duration || '2 hours'}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>${bookingData.subtotal || '89.00'}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Tax:</span>
                    <span>${bookingData.tax || '8.90'}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Service Fee:</span>
                    <span>${bookingData.fee || '9.90'}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-300">
                    <span>Total:</span>
                    <span>${bookingData.total || '107.80'}</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-2">Payment Security</h3>
                  <p className="text-gray-600 text-sm">
                    <i className="fas fa-shield-alt text-blue-600 mr-2"></i>
                    Your payment information is securely encrypted and processed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Payment;