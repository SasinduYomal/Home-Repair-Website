import React, { useState, useEffect } from 'react';
import { reviewsAPI } from '../api/reviewAPI';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        console.log('Fetching reviews...');
        // Check if token exists
        const token = localStorage.getItem('token');
        console.log('Admin token exists:', !!token);
        if (!token) {
          setError('No admin authentication token found. Please log in again.');
          setLoading(false);
          return;
        }
        
        const response = await reviewsAPI.getAllReviews();
        console.log('Reviews fetched successfully:', response.data);
        setReviews(response.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        if (err.response) {
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          if (err.response.status === 401) {
            setError('Admin authentication failed. Please log in again.');
            // Remove invalid token
            localStorage.removeItem('token');
          } else {
            setError(`Failed to fetch reviews: ${err.response.data.message || err.response.statusText || 'Internal Server Error'}`);
          }
        } else if (err.request) {
          console.error('Request made but no response received:', err.request);
          setError('Network error. Please check your connection and try again.');
        } else {
          console.error('Error setting up request:', err.message);
          setError(`Failed to fetch reviews: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleApproveReview = async (reviewId) => {
    try {
      await reviewsAPI.updateReviewStatus(reviewId, 'Approved');
      setReviews(reviews.map(review => 
        review._id === reviewId ? { ...review, status: 'Approved' } : review
      ));
    } catch (err) {
      console.error('Error approving review:', err);
      if (err.response) {
        alert(`Failed to approve review: ${err.response.data.message || err.response.statusText}`);
      } else {
        alert('Failed to approve review');
      }
    }
  };

  const handleRejectReview = async (reviewId) => {
    try {
      await reviewsAPI.updateReviewStatus(reviewId, 'Rejected');
      setReviews(reviews.map(review => 
        review._id === reviewId ? { ...review, status: 'Rejected' } : review
      ));
    } catch (err) {
      console.error('Error rejecting review:', err);
      if (err.response) {
        alert(`Failed to reject review: ${err.response.data.message || err.response.statusText}`);
      } else {
        alert('Failed to reject review');
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewsAPI.deleteReview(reviewId);
        setReviews(reviews.filter(review => review._id !== reviewId));
      } catch (err) {
        console.error('Error deleting review:', err);
        if (err.response) {
          alert(`Failed to delete review: ${err.response.data.message || err.response.statusText}`);
        } else {
          alert('Failed to delete review');
        }
      }
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      (review.user?.name && review.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (review.service?.title && review.service.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (review.review && review.review.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Handle reviews without status field (default to 'Pending')
    const reviewStatus = review.status || 'Pending';
    const matchesStatus = filterStatus === 'All' || reviewStatus === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow py-8 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Manage Reviews</h1>
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

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search reviews..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {review.user?.name || 'Anonymous'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {review.service?.title || 'Unknown Service'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStars(review.rating)}
                      <span className="ml-1 text-sm text-gray-500">({review.rating})</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {review.review}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(review.status || 'Pending')}`}>
                        {review.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {(review.status || 'Pending') === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleApproveReview(review._id)}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleRejectReview(review._id)}
                            className="text-red-600 hover:text-red-900 mr-3"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredReviews.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">No reviews found</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageReviews;