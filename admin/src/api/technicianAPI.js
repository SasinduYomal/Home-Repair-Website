import axios from 'axios';

// Create axios instance
const API = axios.create({
  baseURL: '/api', // Use relative path since we're using Vite proxy
});

// Request interceptor to add auth token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token); // Debug log
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Authorization header set:', config.headers.Authorization); // Debug log
  } else {
    console.log('No token found in localStorage'); // Debug log
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error); // Debug log
  return Promise.reject(error);
});

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      // Server responded with error status
      console.error('Response Error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Request Error:', error.request);
    } else {
      // Something else happened
      console.error('General Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Technicians API
export const techniciansAPI = {
  getAllTechnicians: () => API.get('/technicians'),
  getTechnicianById: (id) => API.get(`/technicians/${id}`),
  createTechnician: (technicianData) => API.post('/technicians', technicianData),
  updateTechnician: (id, technicianData) => API.put(`/technicians/${id}`, technicianData),
  deleteTechnician: (id) => API.delete(`/technicians/${id}`),
};

export default API;