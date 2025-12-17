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

// Users API
export const usersAPI = {
  getAllUsers: () => API.get('/users'),
  getUserById: (id) => API.get(`/users/${id}`),
  updateUser: (id, userData) => API.put(`/users/${id}`, userData),
  deleteUser: (id) => API.delete(`/users/${id}`),
};

export default API;