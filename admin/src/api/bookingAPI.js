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

// Bookings API
export const bookingsAPI = {
  getAllBookings: () => API.get('/bookings/all'),
  getBookingById: (id) => API.get(`/bookings/${id}`),
  updateBookingStatus: (id, status) => API.put(`/bookings/${id}`, { status }),
  cancelBooking: (id) => API.put(`/bookings/${id}/cancel`),
};

export default API;