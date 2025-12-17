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

// Reviews API
export const reviewsAPI = {
  getAllReviews: () => API.get('/reviews'),
  updateReviewStatus: (id, status) => API.put(`/reviews/${id}`, { status }),
  deleteReview: (id) => API.delete(`/reviews/${id}`),
};

export default API;