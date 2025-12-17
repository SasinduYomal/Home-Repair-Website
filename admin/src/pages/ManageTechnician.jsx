import React, { useState, useRef, useEffect } from 'react';
import { techniciansAPI } from '../api/technicianAPI';
import ActionButtons from '../components/ActionButtons';

const ManageTechnician = () => {
  const [technicians, setTechnicians] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [certifications, setCertifications] = useState([]);
  const [newCertification, setNewCertification] = useState({ name: '', issuer: '', date: '' });
  
  // Refs for form inputs
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const specializationRef = useRef(null);
  const experienceRef = useRef(null);
  const bioRef = useRef(null);
  const availabilityRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await techniciansAPI.getAllTechnicians();
        setTechnicians(response.data);
      } catch (error) {
        console.error('Error fetching technicians:', error);
        alert('Failed to fetch technicians: ' + (error.response?.data?.message || error.message));
      }
    };

    fetchTechnicians();
  }, []);

  const filteredTechnicians = technicians.filter(technician => 
    technician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    technician.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteTechnician = async (technicianId) => {
    if (window.confirm('Are you sure you want to delete this technician?')) {
      try {
        await techniciansAPI.deleteTechnician(technicianId);
        setTechnicians(technicians.filter(technician => technician._id !== technicianId));
      } catch (error) {
        console.error('Error deleting technician:', error);
        alert('Failed to delete technician: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleToggleStatus = async (technicianId) => {
    try {
      const technician = technicians.find(t => t._id === technicianId);
      if (technician) {
        const updatedStatus = technician.status === 'Active' ? 'Inactive' : 'Active';
        const response = await techniciansAPI.updateTechnician(technicianId, {
          ...technician,
          status: updatedStatus
        });
        
        setTechnicians(technicians.map(t => 
          t._id === technicianId ? response.data : t
        ));
      }
    } catch (error) {
      console.error('Error updating technician status:', error);
      alert('Failed to update technician status: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEditTechnician = (technician) => {
    setEditingTechnician(technician);
    setImagePreview(technician.image);
    setSkills(technician.skills || []);
    setCertifications(technician.certifications || []);
    setShowModal(true);
  };

  const handleAddTechnician = () => {
    setEditingTechnician(null);
    setImagePreview(null);
    setSkills([]);
    setCertifications([]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTechnician(null);
    setImagePreview(null);
    setSkills([]);
    setCertifications([]);
    setNewSkill('');
    setNewCertification({ name: '', issuer: '', date: '' });
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

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleAddCertification = () => {
    if (newCertification.name.trim() && newCertification.issuer.trim()) {
      setCertifications([...certifications, { ...newCertification }]);
      setNewCertification({ name: '', issuer: '', date: '' });
    }
  };

  const handleRemoveCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const name = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const phone = phoneRef.current.value.trim();
    const specialization = specializationRef.current.value.trim();
    const experience = parseInt(experienceRef.current.value) || 0;
    const bio = bioRef.current.value.trim();
    const availability = availabilityRef.current.value;
    
    if (!name || !email || !phone || !specialization || !bio) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Check if image is uploaded
    if (!imagePreview) {
      alert('Please upload an image');
      return;
    }
    
    const technicianData = {
      name,
      email,
      phone,
      specialization,
      experience,
      bio,
      skills,
      certifications,
      availability,
      image: imagePreview,
      rating: editingTechnician ? editingTechnician.rating : 0,
      status: editingTechnician ? editingTechnician.status : 'Active'
    };
    
    console.log('Submitting technician data:', technicianData); // Debug log
    
    try {
      if (editingTechnician) {
        // Update existing technician
        console.log('Updating technician with ID:', editingTechnician._id); // Debug log
        const response = await techniciansAPI.updateTechnician(editingTechnician._id, technicianData);
        setTechnicians(technicians.map(technician => 
          technician._id === editingTechnician._id ? response.data : technician
        ));
      } else {
        // Add new technician
        console.log('Creating new technician'); // Debug log
        const response = await techniciansAPI.createTechnician(technicianData);
        setTechnicians([...technicians, response.data]);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving technician:', error);
      alert('Failed to save technician: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Technicians</h1>
        <button 
          onClick={handleAddTechnician}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
        >
          Add New Technician
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search technicians..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Technicians Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTechnicians.map((technician) => (
                <tr key={technician._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={technician.image} alt={technician.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{technician.name}</div>
                        <div className="text-sm text-gray-500">{technician.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{technician.specialization}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{technician.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{technician.experience} years</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Rating: {technician.rating}/5</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${technician.availability === 'Available' ? 'bg-green-100 text-green-800' : 
                        technician.availability === 'Busy' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {technician.availability}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${technician.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {technician.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <ActionButtons
                      onEdit={() => handleEditTechnician(technician)}
                      onToggleStatus={() => handleToggleStatus(technician._id)}
                      onDelete={() => handleDeleteTechnician(technician._id)}
                      isActive={technician.status === 'Active'}
                      itemType="technician"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Adding/Editing Technician */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingTechnician ? 'Edit Technician' : 'Add New Technician'}
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        ref={nameRef}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={editingTechnician?.name || ''}
                        autoFocus
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        ref={emailRef}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={editingTechnician?.email || ''}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phone">
                        Phone *
                      </label>
                      <input
                        type="text"
                        id="phone"
                        ref={phoneRef}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={editingTechnician?.phone || ''}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="specialization">
                        Specialization *
                      </label>
                      <input
                        type="text"
                        id="specialization"
                        ref={specializationRef}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={editingTechnician?.specialization || ''}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="experience">
                        Experience (Years) *
                      </label>
                      <input
                        type="number"
                        id="experience"
                        ref={experienceRef}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={editingTechnician?.experience || ''}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="availability">
                        Availability *
                      </label>
                      <select
                        id="availability"
                        ref={availabilityRef}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={editingTechnician?.availability || 'Available'}
                        required
                      >
                        <option value="Available">Available</option>
                        <option value="Busy">Busy</option>
                        <option value="Offline">Offline</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Right Column */}
                  <div>
                    {/* Image Upload Section */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Technician Image *
                      </label>
                      
                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="mb-3">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-32 h-32 object-cover rounded-md border border-gray-300"
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
                          required={!editingTechnician || !imagePreview}
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload an image file (JPG, PNG, GIF)</p>
                      </div>
                    </div>
                    
                    {/* Skills Section */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Skills
                      </label>
                      <div className="flex mb-2">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Add a skill"
                        />
                        <button
                          type="button"
                          onClick={handleAddSkill}
                          className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-2 text-blue-600 hover:text-blue-900"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Certifications Section */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Certifications
                      </label>
                      <div className="space-y-2 mb-2">
                        <input
                          type="text"
                          placeholder="Certification Name"
                          value={newCertification.name}
                          onChange={(e) => setNewCertification({...newCertification, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Issuer"
                          value={newCertification.issuer}
                          onChange={(e) => setNewCertification({...newCertification, issuer: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="date"
                          placeholder="Date"
                          value={newCertification.date}
                          onChange={(e) => setNewCertification({...newCertification, date: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddCertification}
                          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 w-full"
                        >
                          Add Certification
                        </button>
                      </div>
                      <div className="space-y-2">
                        {certifications.map((cert, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-md flex justify-between items-start">
                            <div>
                              <div className="font-medium">{cert.name}</div>
                              <div className="text-sm text-gray-600">Issued by {cert.issuer}</div>
                              {cert.date && <div className="text-xs text-gray-500">{new Date(cert.date).toLocaleDateString()}</div>}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveCertification(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bio Section - Full Width */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="bio">
                    Bio *
                  </label>
                  <textarea
                    id="bio"
                    ref={bioRef}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={editingTechnician?.bio || ''}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingTechnician ? 'Update Technician' : 'Add Technician'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTechnician;