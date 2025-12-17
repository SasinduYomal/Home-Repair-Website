import React, { useState, useRef, useEffect } from 'react';
import { useCategories } from '../context/CategoryContext';
import { servicesAPI } from '../api/serviceAPI';
import ActionButtons from '../components/ActionButtons';

const ManageServices = () => {
  const { categories } = useCategories();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Refs for form inputs
  const titleRef = useRef(null);
  const categoryRef = useRef(null);
  const descriptionRef = useRef(null);
  const detailedDescriptionRef = useRef(null);
  const imageRef = useRef(null);
  const iconRef = useRef(null);
  const priceRef = useRef(null);
  const durationRef = useRef(null);
  const featuresRef = useRef(null);
  const benefitsRef = useRef(null);
  const faqsRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await servicesAPI.getAllServices();
        setServices(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch services');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await servicesAPI.deleteService(serviceId);
        setServices(services.filter(service => service._id !== serviceId));
      } catch (err) {
        setError('Failed to delete service');
        console.error('Error deleting service:', err);
      }
    }
  };

  const handleToggleStatus = async (serviceId) => {
    const service = services.find(serv => serv._id === serviceId);
    if (service) {
      try {
        const updatedService = await servicesAPI.updateService(serviceId, {
          ...service,
          status: service.status === 'Active' ? 'Inactive' : 'Active'
        });
        setServices(services.map(serv => 
          serv._id === serviceId ? updatedService.data : serv
        ));
      } catch (err) {
        setError('Failed to update service status');
        console.error('Error updating service status:', err);
      }
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setImagePreview(service.image);
    setShowModal(true);
  };

  const handleAddService = () => {
    setEditingService(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const title = titleRef.current.value.trim();
    const category = categoryRef.current.value;
    const description = descriptionRef.current.value.trim();
    const detailedDescription = detailedDescriptionRef.current.value.trim();
    const image = imagePreview || imageRef.current.value.trim();
    const icon = iconRef.current.value.trim();
    const price = priceRef.current.value.trim();
    const duration = durationRef.current.value.trim();
    const featuresText = featuresRef.current.value.trim();
    const benefitsText = benefitsRef.current.value.trim();
    const faqsText = faqsRef.current.value.trim();
    
    if (!title || !category || !description || !detailedDescription || !image || !icon || !price || !duration) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Parse features, benefits, and FAQs
    const features = featuresText.split('\n').filter(f => f.trim() !== '');
    const benefits = benefitsText.split('\n').filter(b => b.trim() !== '');
    
    // Parse FAQs (question:answer format)
    const faqs = faqsText.split('\n').filter(line => line.includes(':')).map(line => {
      const [question, answer] = line.split(':').map(str => str.trim());
      return { question, answer };
    });
    
    const serviceData = {
      category,
      title,
      description,
      detailedDescription,
      image,
      icon,
      price,
      duration,
      features,
      benefits,
      faqs,
      status: 'Active'
    };
    
    setIsSubmitting(true);
    
    try {
      if (editingService) {
        // Update existing service
        const response = await servicesAPI.updateService(editingService._id, serviceData);
        setServices(services.map(service => 
          service._id === editingService._id ? response.data : service
        ));
      } else {
        // Add new service
        const response = await servicesAPI.createService(serviceData);
        setServices([...services, response.data]);
      }
      
      handleCloseModal();
    } catch (err) {
      alert('Failed to save service. Please try again.');
      console.error('Error saving service:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error} <button onClick={() => window.location.reload()} className="font-medium underline">Refresh</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Services</h1>
        <button 
          onClick={handleAddService}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
        >
          Add New Service
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search services..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServices.map((service) => (
                <tr key={service._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={service.image} alt={service.title} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{service.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${service.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <ActionButtons
                      onEdit={() => handleEditService(service)}
                      onToggleStatus={() => handleToggleStatus(service._id)}
                      onDelete={() => handleDeleteService(service._id)}
                      isActive={service.status === 'Active'}
                      itemType="service"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Adding/Editing Service */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
                        Service Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        ref={titleRef}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={editingService?.title || ''}
                        autoFocus
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="category">
                        Category *
                      </label>
                      <select
                        id="category"
                        ref={categoryRef}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={editingService?.category || ''}
                      >
                        <option value="">Select a category</option>
                        {categories
                          .filter(category => category.status === 'Active')
                          .map(category => (
                            <option key={category._id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="price">
                        Price *
                      </label>
                      <input
                        type="text"
                        id="price"
                        ref={priceRef}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={editingService?.price || ''}
                        placeholder="$75/hr or $200"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="duration">
                        Duration *
                      </label>
                      <input
                        type="text"
                        id="duration"
                        ref={durationRef}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={editingService?.duration || ''}
                        placeholder="2-4 hours or 1-3 days"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="icon">
                        Icon Class (Font Awesome) *
                      </label>
                      <input
                        type="text"
                        id="icon"
                        ref={iconRef}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={editingService?.icon || ''}
                        placeholder="e.g., fa fa-faucet"
                      />
                    </div>
                  </div>
                  
                  <div>
                    {/* Image Upload Section */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Service Image *
                      </label>
                      
                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="mb-3">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-48 object-cover rounded-md border border-gray-300"
                          />
                        </div>
                      )}
                      
                      {/* File Upload */}
                      <div className="mb-3">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload an image file (JPG, PNG, GIF)</p>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="text"
                          ref={imageRef}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          defaultValue={editingService?.image || ''}
                          placeholder="Or enter image URL"
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-gray-500">OR</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                    Short Description *
                  </label>
                  <textarea
                    id="description"
                    ref={descriptionRef}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={editingService?.description || ''}
                    placeholder="Brief description of the service"
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="detailedDescription">
                    Detailed Description *
                  </label>
                  <textarea
                    id="detailedDescription"
                    ref={detailedDescriptionRef}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={editingService?.detailedDescription || ''}
                    placeholder="Comprehensive description of the service, including what's included"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="features">
                        Features (one per line) *
                      </label>
                      <textarea
                        id="features"
                        ref={featuresRef}
                        rows="5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={editingService?.features?.join('\n') || ''}
                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      ></textarea>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="benefits">
                        Benefits (one per line) *
                      </label>
                      <textarea
                        id="benefits"
                        ref={benefitsRef}
                        rows="5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={editingService?.benefits?.join('\n') || ''}
                        placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="faqs">
                        FAQs (Question:Answer format, one per line) *
                      </label>
                      <textarea
                        id="faqs"
                        ref={faqsRef}
                        rows="12"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={editingService?.faqs?.map(faq => `${faq.question}: ${faq.answer}`).join('\n') || ''}
                        placeholder="What is included in the service?: We provide comprehensive service including...&#10;How long does it take?: Typically 2-4 hours..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : (editingService ? 'Update Service' : 'Add Service')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;