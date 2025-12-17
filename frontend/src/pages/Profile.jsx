import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Mock booking history data
  const [bookings] = useState([
    {
      id: 1,
      service: "Plumbing Service",
      technician: "Michael Johnson",
      date: "Dec 15, 2023",
      time: "10:00 AM",
      status: "Completed",
      amount: "$89.00"
    },
    {
      id: 2,
      service: "Electrical Repair",
      technician: "Sarah Williams",
      date: "Nov 28, 2023",
      time: "2:30 PM",
      status: "Completed",
      amount: "$125.00"
    },
    {
      id: 3,
      service: "AC Maintenance",
      technician: "Robert Brown",
      date: "Oct 10, 2023",
      time: "9:00 AM",
      status: "Cancelled",
      amount: "$0.00"
    }
  ]);

  // Form state for editing profile
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...userData });
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        avatar: user.avatar || ""
      });
      setEditedData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        avatar: user.avatar || ""
      });
      setAvatarPreview(user.avatar || "");
      setLoading(false);
    }
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedData({ ...userData });
    setAvatarPreview(userData.avatar || "");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedData({ ...userData });
    setAvatarPreview(userData.avatar || "");
  };

  const handleSaveChanges = async () => {
    try {
      const response = await userAPI.updateProfile(editedData);
      setUserData({ ...editedData });
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setEditedData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Profile Header */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-6 md:mb-0 md:mr-8 overflow-hidden">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <i className="fas fa-user text-4xl"></i>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{userData.name}</h1>
              <p className="text-xl text-blue-100 mb-4">{userData.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <button 
                  onClick={handleEditClick}
                  className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition"
                >
                  Edit Profile
                </button>
                <Link 
                  to="/my-bookings" 
                  className="bg-transparent border-2 border-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition"
                >
                  My Bookings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="py-12 bg-gray-50 flex-grow">
        <div className="container mx-auto px-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex flex-wrap -mb-px">
                <button className="text-blue-600 border-b-2 border-blue-600 px-6 py-4 font-medium text-sm">
                  Personal Information
                </button>
              </nav>
            </div>

            <div className="p-6">
              {!isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Full Name</label>
                        <p className="mt-1 text-sm text-gray-900">{userData.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Email Address</label>
                        <p className="mt-1 text-sm text-gray-900">{userData.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                        <p className="mt-1 text-sm text-gray-900">{userData.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Address</label>
                        <p className="mt-1 text-sm text-gray-900">{userData.address || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Member Since</label>
                        <p className="mt-1 text-sm text-gray-900">January 15, 2023</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Last Login</label>
                        <p className="mt-1 text-sm text-gray-900">December 15, 2023</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Profile Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                        <div className="flex items-center">
                          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-4">
                            {avatarPreview ? (
                              <img 
                                src={avatarPreview} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <i className="fas fa-user text-gray-500"></i>
                            )}
                          </div>
                          <label className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                            Change Photo
                            <input 
                              type="file" 
                              className="sr-only" 
                              accept="image/*"
                              onChange={handleAvatarChange}
                            />
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={editedData.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={editedData.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={editedData.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                          name="address"
                          rows="3"
                          value={editedData.address}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Member Since</label>
                        <p className="mt-1 text-sm text-gray-900">January 15, 2023</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Last Login</label>
                        <p className="mt-1 text-sm text-gray-900">December 15, 2023</p>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveChanges}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking History */}
          <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Booking History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.service}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.technician}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.date} at {booking.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;