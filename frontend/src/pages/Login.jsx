import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context
  
  // Form states
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Handle automatic navigation after successful login
  useEffect(() => {
    if (success && isLogin) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [success, isLogin, navigate]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);
    
    // Basic validation
    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError('Please enter both email and password');
        setIsLoading(false);
        return;
      }
    } else {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        setIsLoading(false);
        return;
      }
    }
    
    try {
      if (isLogin) {
        // Login user
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password
        });
        
        // Save token to localStorage
        localStorage.setItem('token', response.data.token);
        
        // Update auth context with user data
        login(response.data);
        
        setSuccess(true);
      } else {
        // Register user
        const response = await authAPI.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address
        });
        
        setSuccess(true);
        // Switch to login tab after successful registration
        setTimeout(() => {
          setIsLogin(true); // Switch to login tab
          setSuccess(false); // Reset success state
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Login/Register Header */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            {isLogin 
              ? 'Sign in to access your account and manage your bookings.' 
              : 'Join our community and get started with our services.'}
          </p>
        </div>
      </div>

      {/* Login/Register Content */}
      <div className="py-12 bg-gray-50 flex-grow">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              {/* Toggle between Login and Register */}
              <div className="flex border-b border-gray-200 mb-8">
                <button
                  className={`py-4 px-6 font-semibold text-lg ${
                    isLogin 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
                <button
                  className={`py-4 px-6 font-semibold text-lg ${
                    !isLogin 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setIsLogin(false)}
                >
                  Register
                </button>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                  {isLogin 
                    ? 'Login successful! Redirecting to home page...' 
                    : 'Registration successful! Welcome to HomeRepair. Switching to login...'}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                      required={!isLogin}
                    />
                  </div>
                )}
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                {!isLogin && (
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Confirm your password"
                      required={!isLogin}
                    />
                  </div>
                )}
                
                {!isLogin && (
                  <>
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2" htmlFor="address">
                        Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your address"
                      ></textarea>
                    </div>
                  </>
                )}
                
                <div className="mb-6">
                  <button
                    type="submit"
                    disabled={isLoading || success}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-colors ${
                      isLoading || success
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isLogin ? 'Signing In...' : 'Creating Account...'}
                      </div>
                    ) : success ? (
                      'Success!'
                    ) : (
                      isLogin ? 'Login' : 'Register'
                    )}
                  </button>
                </div>
                
                {isLogin && (
                  <div className="text-center mb-6">
                    <Link to="/forgot-password" className="text-blue-600 hover:underline">
                      Forgot your password?
                    </Link>
                  </div>
                )}
                
                <div className="text-center">
                  <p className="text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    {isLogin ? (
                      <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                        Register here
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="text-blue-600 font-semibold hover:underline"
                        onClick={() => setIsLogin(!isLogin)}
                      >
                        Login here
                      </button>
                    )}
                  </p>
                </div>
              </form>
            </div>
            
            {/* Social Login Options */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Or continue with</p>
              <div className="flex justify-center space-x-4">
                <button className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors">
                  <i className="fab fa-google"></i>
                </button>
                <button className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-900 transition-colors">
                  <i className="fab fa-apple"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;