import axios from 'axios';

// Create axios instance
const API = axios.create({
  baseURL: '/api', // Use relative path since we're using Vite proxy
});

// Request interceptor to add auth token to headers
API.interceptors.request.use((config) => {
  // Always get the latest token from localStorage
  const token = localStorage.getItem('token');
  console.log('API Interceptor - Token:', token ? 'Present' : 'Missing');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Remove Authorization header if no token
    delete config.headers.Authorization;
  }
  return config;
});

// Response interceptor to handle token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Remove token from localStorage on 401
      localStorage.removeItem('token');
      // Optionally redirect to login page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (userData) => API.post('/auth/login', userData),
};

// User API
export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (userData) => API.put('/users/profile', userData),
};

// Services API
export const servicesAPI = {
  getAllServices: () => API.get('/services'),
  getServiceById: (id) => API.get(`/services/${id}`),
  // Method to get only service names and IDs
  getServiceNames: () => API.get('/services?fields=_id,title,price'),
};

// Reviews API
export const reviewsAPI = {
  getReviewsByService: (serviceId) => API.get(`/reviews/service/${serviceId}`),
  createReview: (reviewData) => API.post('/reviews', reviewData),
};

// Categories API
export const categoriesAPI = {
  getAllCategories: () => API.get('/categories'),
  getCategoryById: (id) => API.get(`/categories/${id}`),
  createCategory: (categoryData) => API.post('/categories', categoryData),
  updateCategory: (id, categoryData) => API.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => API.delete(`/categories/${id}`),
};

// Technicians API
export const techniciansAPI = {
  getAllTechnicians: () => API.get('/technicians'),
  getTechnicianById: (id) => API.get(`/technicians/${id}`),
  // Method to get only technician names and IDs
  getTechnicianNames: () => API.get('/technicians?fields=_id,name,specialization,rating'),
};

// Bookings API
export const bookingsAPI = {
  createBooking: (bookingData) => API.post('/bookings', bookingData),
  getMyBookings: () => API.get('/bookings'),
  getBookingById: (id) => API.get(`/bookings/${id}`),
  cancelBooking: (id) => API.put(`/bookings/${id}/cancel`),
  // Admin routes
  getAllBookings: () => API.get('/bookings/all'),
  updateBookingStatus: (id, status) => API.put(`/bookings/${id}`, { status }),
};

export default API;