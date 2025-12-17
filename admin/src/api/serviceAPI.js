import axios from 'axios';

// Create axios instance
const API = axios.create({
  baseURL: '/api', // Use relative path since we're using Vite proxy
});

// Request interceptor to add auth token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Services API
export const servicesAPI = {
  getAllServices: () => API.get('/services'),
  getServiceById: (id) => API.get(`/services/${id}`),
  createService: (serviceData) => API.post('/services', serviceData),
  updateService: (id, serviceData) => API.put(`/services/${id}`, serviceData),
  deleteService: (id) => API.delete(`/services/${id}`),
};

export default API;