import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { servicesAPI, techniciansAPI } from '../services/api';

const Booking = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  // State for services and technicians
  const [services, setServices] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    service: serviceId || '',
    technician: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  
  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);
  
  // Fetch services and technicians on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch only the names and IDs for the dropdowns
        const [servicesRes, techniciansRes] = await Promise.all([
          servicesAPI.getServiceNames(),
          techniciansAPI.getTechnicianNames()
        ]);
        
        setServices(servicesRes.data);
        setTechnicians(techniciansRes.data);
        
        // Set default service if serviceId is provided
        if (serviceId && servicesRes.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            service: serviceId
          }));
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load services and technicians. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [serviceId]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle time selection
  const handleTimeSelect = (time) => {
    setFormData(prev => ({
      ...prev,
      time: time
    }));
  };
  
  // Handle form submission - navigate to payment page
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking submitted:', formData);
    
    // Prepare booking data to pass to payment page
    const selectedService = services.find(s => s._id === formData.service);
    const selectedTechnician = technicians.find(t => t._id === formData.technician);
    
    const bookingData = {
      service: formData.service, // Add service ID
      technician: formData.technician, // Add technician ID
      serviceName: selectedService?.title,
      technicianName: selectedTechnician?.name,
      date: formData.date,
      time: formData.time,
      duration: selectedService?.duration,
      subtotal: selectedService?.price?.toString().replace('$', '').replace(' starting', ''),
      tax: '8.90',
      fee: '9.90',
      total: (parseFloat(selectedService?.price?.toString().replace('$', '').replace(' starting', '')) + 8.90 + 9.90).toFixed(2),
      ...formData
    };
    
    // Navigate to payment page with booking data
    navigate('/payment', { state: bookingData });
  };
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Get available times for selected technician
  const getAvailableTimes = () => {
    // Since we only fetched names, we need to fetch the full technician data when needed
    // In a real app, you might want to fetch full details when a technician is selected
    return ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
  };
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading services and technicians...</p>
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
          <div className="text-center">
            <div className="text-red-500 text-xl font-semibold">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
      
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <a href="/" className="text-blue-600 hover:underline">Home</a>
            <span className="mx-2 text-gray-400">/</span>
            <a href="/services" className="text-blue-600 hover:underline">Services</a>
            {formData.service && (
              <>
                <span className="mx-2 text-gray-400">/</span>
                <a href={`/service/${formData.service}`} className="text-blue-600 hover:underline">
                  {services.find(s => s._id === formData.service)?.title || 'Selected Service'}
                </a>
              </>
            )}
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">Book Service</span>
          </nav>
        </div>
      </div>

      {/* Booking Header */}
      <div className="py-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Book Your Service</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            Schedule your appointment with our professional technicians. 
            Complete the form below to book your service.
          </p>
        </div>
      </div>

      {/* Booking Process */}
      <div className="py-12 bg-gray-50 flex-grow">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex justify-between relative">
                {/* Progress line */}
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0"></div>
                <div 
                  className="absolute top-4 left-0 h-1 bg-blue-600 z-10 transition-all duration-500" 
                  style={{ width: `${(currentStep - 1) * 33.33}%` }}
                ></div>
                
                {/* Step indicators */}
                {[1, 2, 3, 4].map(step => (
                  <div key={step} className="relative z-20">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= step 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-white text-gray-400 border-2 border-gray-300'
                    }`}>
                      {step}
                    </div>
                    <div className="mt-2 text-center text-sm font-medium text-gray-600">
                      {step === 1 && 'Service'}
                      {step === 2 && 'Technician'}
                      {step === 3 && 'Schedule'}
                      {step === 4 && 'Details'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Step Content */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Service Selection */}
                {currentStep === 1 && (
                  <div className="animate-fadeIn">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Select a Service</h2>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2" htmlFor="service">
                        Choose a Service
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select a service</option>
                        {services.map(service => (
                          <option key={service._id} value={service._id}>
                            {service.title} - {service.price}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {formData.service && (
                      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {services.find(s => s._id === formData.service)?.title}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {services.find(s => s._id === formData.service)?.description}
                        </p>
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-800">
                            {services.find(s => s._id === formData.service)?.price}
                          </span>
                          <span className="text-gray-500">
                            {services.find(s => s._id === formData.service)?.duration}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-8 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        disabled={!formData.service}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Technician Selection */}
                {currentStep === 2 && (
                  <div className="animate-fadeIn">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Select a Technician</h2>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2" htmlFor="technician">
                        Choose a Technician
                      </label>
                      <select
                        id="technician"
                        name="technician"
                        value={formData.technician}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select a technician</option>
                        {technicians
                          .filter(tech => tech.status === 'Active')
                          .map(technician => (
                            <option key={technician._id} value={technician._id}>
                              {technician.name} - {technician.specialization} (Rating: {technician.rating}/5)
                            </option>
                          ))}
                      </select>
                    </div>
                    
                    {formData.technician && (
                      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          {/* We don't have the image in the limited data, so we'll show a placeholder */}
                          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                            <span className="text-blue-800 font-bold text-xl">
                              {technicians.find(t => t._id === formData.technician)?.name?.charAt(0) || 'T'}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {technicians.find(t => t._id === formData.technician)?.name}
                            </h3>
                            <p className="text-gray-600">
                              {technicians.find(t => t._id === formData.technician)?.specialization}
                            </p>
                            <div className="flex items-center mt-1">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <i 
                                    key={i} 
                                    className={`fas fa-star ${i < Math.floor(technicians.find(t => t._id === formData.technician)?.rating) ? '' : 'far'}`}
                                  ></i>
                                ))}
                              </div>
                              <span className="ml-2 text-gray-600 text-sm">
                                {technicians.find(t => t._id === formData.technician)?.rating} 
                                ({technicians.find(t => t._id === formData.technician)?.reviews?.length || 0} reviews)
                              </span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">
                              {technicians.find(t => t._id === formData.technician)?.experience} years experience
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        disabled={!formData.technician}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Step 3: Schedule Selection */}
                {currentStep === 3 && (
                  <div className="animate-fadeIn">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Date & Time</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Date</h3>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          min={today}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Time</h3>
                        {formData.technician ? (
                          <div className="grid grid-cols-3 gap-3">
                            {getAvailableTimes().map(time => (
                              <button
                                key={time}
                                type="button"
                                className={`py-3 rounded-lg border ${
                                  formData.time === time
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                                onClick={() => handleTimeSelect(time)}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500">
                            <p>Please select a technician first to see available times.</p>
                            <button
                              type="button"
                              onClick={() => setCurrentStep(2)}
                              className="mt-3 text-blue-600 hover:underline"
                            >
                              Select Technician
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        disabled={!formData.date || !formData.time}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Step 4: Personal Details */}
                {currentStep === 4 && (
                  <div className="animate-fadeIn">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Details</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your full name"
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
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="address">
                          Service Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your address"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2" htmlFor="notes">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Any special instructions or details about your service request..."
                      ></textarea>
                    </div>
                    
                    {/* Booking Summary */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h3>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between pb-2 border-b border-gray-200">
                          <span className="font-medium">Service:</span>
                          <span>{services.find(s => s._id === formData.service)?.title}</span>
                        </div>
                        
                        <div className="flex justify-between pb-2 border-b border-gray-200">
                          <span className="font-medium">Technician:</span>
                          <span>{technicians.find(t => t._id === formData.technician)?.name || 'Not selected'}</span>
                        </div>
                        
                        <div className="flex justify-between pb-2 border-b border-gray-200">
                          <span className="font-medium">Date & Time:</span>
                          <span>{formData.date ? `${formData.date} at ${formData.time || 'Not selected'}` : 'Not selected'}</span>
                        </div>
                        
                        <div className="flex justify-between pb-2 border-b border-gray-200">
                          <span className="font-medium">Price:</span>
                          <span className="font-semibold text-blue-600">
                            {services.find(s => s._id === formData.service)?.price}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
                        disabled={!formData.date || !formData.time}
                      >
                        Confirm Booking & Pay Now
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Booking;