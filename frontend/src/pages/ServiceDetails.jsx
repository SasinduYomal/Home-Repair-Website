import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { servicesAPI, reviewsAPI } from '../services/api';

const ServiceDetails = () => {
  const { id } = useParams();
  
  // State for service data
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for reviews
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  
  // State for review form
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    review: ''
  });
  
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch service data
  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await servicesAPI.getServiceById(id);
        setService(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch service details');
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  // Fetch reviews for this service
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await reviewsAPI.getReviewsByService(id);
        setReviews(response.data);
        setReviewsLoading(false);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
        setReviewsLoading(false);
      }
    };

    if (id) {
      fetchReviews();
    }
  }, [id]);

  // Handle review form input changes
  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle star rating selection
  const handleRatingChange = (rating) => {
    setReviewForm(prev => ({
      ...prev,
      rating
    }));
  };

  // Handle review form submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (reviewForm.rating === 0) {
      setSubmitError('Please select a rating');
      return;
    }
    
    if (!reviewForm.review.trim()) {
      setSubmitError('Please enter your review');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const reviewData = {
        rating: reviewForm.rating,
        review: reviewForm.review,
        serviceId: id
      };
      
      const response = await reviewsAPI.createReview(reviewData);
      
      // Add new review to the top of the list
      setReviews(prev => [response.data, ...prev]);
      
      // Reset form
      setReviewForm({ rating: 0, review: '' });
      setSubmitSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading service details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="text-center">
            <div className="text-red-500 text-2xl mb-4">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <p className="text-gray-800 text-xl mb-4">{error}</p>
            <Link 
              to="/services" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Back to Services
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;
    
  const totalReviews = reviews.length;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <Link to="/" className="text-blue-600 hover:underline">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/services" className="text-blue-600 hover:underline">Services</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">{service.title}</span>
          </nav>
        </div>
      </div>

      {/* Service Header */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <img 
                src={service.image} 
                alt={service.title} 
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
            </div>
            <div className="md:w-1/2">
              <div className="flex items-center mb-4">
                <i className={`${service.icon} text-blue-600 text-2xl mr-3 bg-blue-100 p-3 rounded-full`}></i>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {service.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{service.title}</h1>
              
              <p className="text-gray-600 text-lg mb-6">{service.description}</p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center">
                  <i className="fa fa-tag text-blue-600 mr-2"></i>
                  <span className="font-semibold">Price: {service.price}</span>
                </div>
                <div className="flex items-center">
                  <i className="fa fa-clock text-blue-600 mr-2"></i>
                  <span className="font-semibold">Duration: {service.duration}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to={`/booking/${service._id}`} 
                  className="flex-1 text-center bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Book This Service
                </Link>
                <Link 
                  to="/contact" 
                  className="flex-1 text-center bg-white text-blue-600 border border-blue-600 px-6 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">About This Service</h2>
                <p className="text-gray-600 mb-6 text-lg">{service.detailedDescription}</p>
                
                <h3 className="text-xl font-bold text-gray-800 mb-4">What's Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <i className="fa fa-check-circle text-green-500 mt-1 mr-3"></i>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Customer Reviews Section */}
              <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
                  <div className="flex items-center">
                    <div className="text-yellow-500 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`fas fa-star ${i < Math.floor(averageRating) ? '' : 'text-gray-300'}`}
                        ></i>
                      ))}
                    </div>
                    <span className="font-semibold text-gray-800">{averageRating}</span>
                    <span className="text-gray-600 ml-1">({totalReviews} reviews)</span>
                  </div>
                </div>
                
                {reviewsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-6 mb-8">
                    {reviews.length > 0 ? (
                      reviews.map(review => (
                        <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                          <div className="flex justify-between mb-2">
                            <h4 className="font-semibold text-gray-800">Customer Review</h4>
                            <div className="flex text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <i 
                                  key={i} 
                                  className={`fas fa-star ${i < review.rating ? '' : 'text-gray-300'}`}
                                ></i>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">{review.review}</p>
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <span className="font-semibold text-blue-800">
                                {review.user?.name?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{review.user?.name || 'User'}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(review.createdAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <i className="fas fa-comment-dots text-4xl text-gray-300 mb-4"></i>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reviews Yet</h3>
                        <p className="text-gray-600">Be the first to review this service!</p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="text-center">
                  <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                    Load More Reviews
                  </button>
                </div>
                
                {submitSuccess && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                    Thank you for your review! It has been submitted successfully.
                  </div>
                )}
              </div>
              
              {/* Customer Review Form */}
              <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Leave a Review</h2>
                <form className="space-y-6" onSubmit={handleReviewSubmit}>
                  {submitError && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                      {submitError}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Rating
                    </label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`text-2xl ${star <= reviewForm.rating ? 'text-yellow-500' : 'text-gray-300'} focus:outline-none`}
                          onClick={() => handleRatingChange(star)}
                        >
                          <i className="fas fa-star hover:text-yellow-500"></i>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="review">
                      Your Review
                    </label>
                    <textarea
                      id="review"
                      name="review"
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Share your experience with this service..."
                      value={reviewForm.review}
                      onChange={handleReviewInputChange}
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Benefits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <i className="fa fa-star text-yellow-500 mt-1 mr-3"></i>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-xl shadow-md p-8 sticky top-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h3>
                <div className="space-y-6">
                  {service.faqs && service.faqs.map((faq, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-gray-800 mb-2">{faq.question}</h4>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4">Need Help?</h4>
                  <p className="text-gray-600 mb-4">Contact our service experts for personalized assistance.</p>
                  <Link 
                    to="/contact" 
                    className="block text-center bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServiceDetails;