import React, { useState, useEffect } from 'react';
import { usersAPI } from '../api/userAPI';
import { servicesAPI } from '../api/serviceAPI';
import { bookingsAPI } from '../api/bookingAPI';
import { reviewsAPI } from '../api/reviewAPI';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

const Reports = () => {
  const [reportData, setReportData] = useState({
    users: [],
    services: [],
    bookings: [],
    reviews: []
  });
  
  const [chartData, setChartData] = useState({
    userGrowth: [],
    bookingTrends: [],
    servicePerformance: [],
    revenueData: [],
    categoryDistribution: [],
    reviewRatings: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly'); // monthly, quarterly, yearly

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [usersRes, servicesRes, bookingsRes, reviewsRes] = await Promise.all([
          usersAPI.getAllUsers(),
          servicesAPI.getAllServices(),
          bookingsAPI.getAllBookings(),
          reviewsAPI.getAllReviews()
        ]);
        
        const users = usersRes.data;
        const services = servicesRes.data;
        const bookings = bookingsRes.data;
        const reviews = reviewsRes.data;
        
        setReportData({
          users,
          services,
          bookings,
          reviews
        });
        
        // Process chart data
        processData(users, services, bookings, reviews);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching report data:', err);
        setError('Failed to load report data');
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const processData = (users, services, bookings, reviews) => {
    // User Growth Over Time
    const userGrowth = processUserGrowth(users);
    
    // Booking Trends
    const bookingTrends = processBookingTrends(bookings);
    
    // Service Performance (based on bookings)
    const servicePerformance = processServicePerformance(bookings, services);
    
    // Revenue Data (simplified - assuming average service price)
    const revenueData = processRevenueData(bookings);
    
    // Category Distribution
    const categoryDistribution = processCategoryDistribution(services);
    
    // Review Ratings
    const reviewRatings = processReviewRatings(reviews);
    
    setChartData({
      userGrowth,
      bookingTrends,
      servicePerformance,
      revenueData,
      categoryDistribution,
      reviewRatings
    });
  };

  const processUserGrowth = (users) => {
    // Group users by registration month
    const userCounts = {};
    
    users.forEach(user => {
      if (user.createdAt) {
        const date = new Date(user.createdAt);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        userCounts[monthKey] = (userCounts[monthKey] || 0) + 1;
      }
    });
    
    return Object.keys(userCounts).map(key => ({
      name: key,
      users: userCounts[key]
    })).sort((a, b) => a.name.localeCompare(b.name));
  };

  const processBookingTrends = (bookings) => {
    // Group bookings by month
    const bookingCounts = {};
    
    bookings.forEach(booking => {
      if (booking.createdAt) {
        const date = new Date(booking.createdAt);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        bookingCounts[monthKey] = (bookingCounts[monthKey] || 0) + 1;
      }
    });
    
    return Object.keys(bookingCounts).map(key => ({
      name: key,
      bookings: bookingCounts[key]
    })).sort((a, b) => a.name.localeCompare(b.name));
  };

  const processServicePerformance = (bookings, services) => {
    // Count bookings per service
    const serviceBookings = {};
    
    bookings.forEach(booking => {
      if (booking.service?._id) {
        const serviceId = booking.service._id;
        serviceBookings[serviceId] = (serviceBookings[serviceId] || 0) + 1;
      }
    });
    
    // Map to service names
    return Object.keys(serviceBookings).map(serviceId => {
      const service = services.find(s => s._id === serviceId);
      return {
        name: service?.title || 'Unknown Service',
        bookings: serviceBookings[serviceId]
      };
    }).sort((a, b) => b.bookings - a.bookings).slice(0, 10); // Top 10 services
  };

  const processRevenueData = (bookings) => {
    // Simplified revenue calculation (assuming average service price of $100)
    const monthlyRevenue = {};
    
    bookings.forEach(booking => {
      if (booking.createdAt) {
        const date = new Date(booking.createdAt);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        const revenue = 100; // Simplified assumption
        monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + revenue;
      }
    });
    
    return Object.keys(monthlyRevenue).map(key => ({
      name: key,
      revenue: monthlyRevenue[key]
    })).sort((a, b) => a.name.localeCompare(b.name));
  };

  const processCategoryDistribution = (services) => {
    // Count services per category
    const categoryCounts = {};
    
    services.forEach(service => {
      const category = service.category?.name || 'Uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    return Object.keys(categoryCounts).map(category => ({
      name: category,
      value: categoryCounts[category]
    }));
  };

  const processReviewRatings = (reviews) => {
    // Count reviews by rating
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingCounts[review.rating]++;
      }
    });
    
    return Object.keys(ratingCounts).map(rating => ({
      name: `${rating} Star${rating > 1 ? 's' : ''}`,
      value: ratingCounts[rating]
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <i className="fas fa-exclamation-circle text-red-500 mr-2"></i>
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
        <div className="flex space-x-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{reportData.users.length}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-blue-600 text-xl">👥</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Services</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{reportData.services.length}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <span className="text-green-600 text-xl">🛠️</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Bookings</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{reportData.bookings.length}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <span className="text-purple-600 text-xl">📅</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Average Rating</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {reportData.reviews.length > 0 
                  ? (reportData.reviews.reduce((sum, review) => sum + review.rating, 0) / reportData.reviews.length).toFixed(1)
                  : 'N/A'}
              </h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <span className="text-yellow-600 text-xl">⭐</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">User Growth</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Booking Trends Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Booking Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.bookingTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bookings" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Service Performance Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Services</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.servicePerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Category Distribution Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Service Categories</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Review Ratings Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Review Ratings Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.reviewRatings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;