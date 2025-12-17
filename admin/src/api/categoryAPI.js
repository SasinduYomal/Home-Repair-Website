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

// Categories API
export const categoriesAPI = {
  getAllCategories: () => API.get('/categories'),
  getCategoryById: (id) => API.get(`/categories/${id}`),
  createCategory: (categoryData) => API.post('/categories', categoryData),
  updateCategory: (id, categoryData) => API.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => API.delete(`/categories/${id}`),
};

export default API;