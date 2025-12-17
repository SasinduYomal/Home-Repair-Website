import React, { useState, useEffect } from 'react';
import { usersAPI } from '../api/userAPI';
import ActionButtons from '../components/ActionButtons';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users...');
        // Check if token exists
        const token = localStorage.getItem('token');
        console.log('Admin token exists:', !!token);
        if (!token) {
          setError('No admin authentication token found. Please log in again.');
          setLoading(false);
          return;
        }
        
        const response = await usersAPI.getAllUsers();
        console.log('Users fetched successfully:', response.data);
        console.log('User IDs:', response.data.map(user => user._id));
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        if (err.response) {
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          if (err.response.status === 401) {
            setError('Admin authentication failed. Please log in again.');
            // Remove invalid token
            localStorage.removeItem('token');
          } else {
            setError(`Failed to fetch users: ${err.response.data.message || err.response.statusText}`);
          }
        } else if (err.request) {
          console.error('Request made but no response received:', err.request);
          setError('Network error. Please check your connection and try again.');
        } else {
          console.error('Error setting up request:', err.message);
          setError(`Failed to fetch users: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        console.log('Deleting user with ID:', userId);
        await usersAPI.deleteUser(userId);
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        console.error('Error deleting user:', err);
        if (err.response) {
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          alert(`Failed to delete user: ${err.response.data.message || err.response.statusText || 'Unknown error'}`);
        } else if (err.request) {
          console.error('Request made but no response received:', err.request);
          alert('Failed to delete user: No response received from server');
        } else {
          console.error('Error setting up request:', err.message);
          alert(`Failed to delete user: ${err.message}`);
        }
      }
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const user = users.find(u => u._id === userId);
      if (user) {
        const updatedUserData = {
          ...user,
          isActive: !user.isActive
        };
        
        const response = await usersAPI.updateUser(userId, updatedUserData);
        setUsers(users.map(u => 
          u._id === userId ? { ...u, ...response.data } : u
        ));
      }
    } catch (err) {
      console.error('Error updating user status:', err);
      if (err.response) {
        alert(`Failed to update user status: ${err.response.data.message || err.response.statusText}`);
      } else {
        alert('Failed to update user status');
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow py-8 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
              Add New User
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <i className="fas fa-exclamation-circle text-red-500 mr-2"></i>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-800 font-medium">
                              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name || 'Unnamed User'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email || 'No email'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                        {user.isAdmin ? 'Admin' : 'Customer'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <ActionButtons
                        onEdit={() => console.log('Edit user', user._id)}
                        onToggleStatus={() => handleToggleStatus(user._id)}
                        onDelete={() => handleDeleteUser(user._id)}
                        isActive={user.isActive}
                        itemType="user"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;