import React, { useState, useEffect } from 'react';
import { usersAPI } from '../api/userAPI';
import { servicesAPI } from '../api/serviceAPI';
import { bookingsAPI } from '../api/bookingAPI';
import { reviewsAPI } from '../api/reviewAPI';
import { techniciansAPI } from '../api/technicianAPI';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState([
    { title: 'Total Users', value: '0', change: '+0%', icon: '👥' },
    { title: 'Total Services', value: '0', change: '+0%', icon: '🛠️' },
    { title: 'Total Bookings', value: '0', change: '+0%', icon: '📅' },
    { title: 'Total Technicians', value: '0', change: '+0%', icon: '👨‍🔧' },
    { title: 'Pending Reviews', value: '0', change: '+0%', icon: '⭐' },
  ]);
  
  const [recentBookings, setRecentBookings] = useState([]);
  const [topTechnicians, setTopTechnicians] = useState([]);
  const [bookingStatusData, setBookingStatusData] = useState([]);
  const [serviceCategoryData, setServiceCategoryData] = useState([]);
  const [technicianSpecializationData, setTechnicianSpecializationData] = useState([]);
  const [monthlyBookingsData, setMonthlyBookingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [usersRes, servicesRes, bookingsRes, reviewsRes, techniciansRes] = await Promise.all([
          usersAPI.getAllUsers(),
          servicesAPI.getAllServices(),
          bookingsAPI.getAllBookings(),
          reviewsAPI.getAllReviews(),
          techniciansAPI.getAllTechnicians()
        ]);
        
        const users = usersRes.data;
        const services = servicesRes.data;
        const bookings = bookingsRes.data;
        const reviews = reviewsRes.data;
        const technicians = techniciansRes.data;
        
        // Calculate stats
        const totalUsers = users.length;
        const totalServices = services.length;
        const totalBookings = bookings.length;
        const totalTechnicians = technicians.length;
        const pendingReviews = reviews.filter(review => review.status === 'Pending').length;
        
        // Simple calculation for percentage changes (in a real app, you'd compare with previous period)
        const userChange = totalUsers > 0 ? '+12%' : '+0%';
        const serviceChange = totalServices > 0 ? '+3%' : '+0%';
        const bookingChange = totalBookings > 0 ? '+18%' : '+0%';
        const technicianChange = totalTechnicians > 0 ? '+5%' : '+0%';
        const reviewChange = pendingReviews > 0 ? '-2%' : '+0%';
        
        // Update stats
        setStats([
          { title: 'Total Users', value: totalUsers.toString(), change: userChange, icon: '👥' },
          { title: 'Total Services', value: totalServices.toString(), change: serviceChange, icon: '🛠️' },
          { title: 'Total Bookings', value: totalBookings.toString(), change: bookingChange, icon: '📅' },
          { title: 'Total Technicians', value: totalTechnicians.toString(), change: technicianChange, icon: '👨‍🔧' },
          { title: 'Pending Reviews', value: pendingReviews.toString(), change: reviewChange, icon: '⭐' },
        ]);
        
        // Process recent bookings (show latest 4)
        const sortedBookings = [...bookings]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
          
        const processedBookings = sortedBookings.map(booking => ({
          id: booking._id || booking.id || 'N/A',
          customer: booking.customerInfo?.name || booking.customerName || 'Unknown Customer',
          service: booking.service?.title || booking.serviceTitle || 'Unknown Service',
          date: booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 
                booking.date ? new Date(booking.date).toLocaleDateString() : 
                booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A',
          status: booking.status || booking.bookingStatus || 'Pending'
        }));
        
        setRecentBookings(processedBookings);
        
        // Process top technicians (simplified - in a real app, you'd calculate based on bookings)
        const processedTechnicians = technicians
          .slice(0, 5) // Show top 5 technicians
          .map(tech => ({
            id: tech._id,
            name: tech.name || 'Unknown Technician',
            specialization: tech.specialization || 'Not specified',
            experience: tech.experience || 'N/A',
            rating: tech.rating || 'N/A'
          }));
        
        setTopTechnicians(processedTechnicians);
        
        // Prepare chart data
        // Booking status distribution
        const statusCounts = {};
        bookings.forEach(booking => {
          const status = booking.status || 'Unknown';
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        
        const bookingStatusData = Object.keys(statusCounts).map(status => ({
          name: status,
          value: statusCounts[status]
        }));
        
        // Service category distribution
        const categoryCounts = {};
        services.forEach(service => {
          const category = service.category?.name || 'Uncategorized';
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
        
        const serviceCategoryData = Object.keys(categoryCounts).map(category => ({
          name: category,
          value: categoryCounts[category]
        }));
        
        // Technician specialization distribution
        const specializationCounts = {};
        technicians.forEach(tech => {
          const specialization = tech.specialization || 'Not specified';
          specializationCounts[specialization] = (specializationCounts[specialization] || 0) + 1;
        });
        
        const technicianSpecializationData = Object.keys(specializationCounts).map(spec => ({
          name: spec,
          value: specializationCounts[spec]
        }));
        
        // Monthly bookings (last 6 months)
        const monthlyBookings = {};
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          monthlyBookings[monthKey] = 0;
        }
        
        bookings.forEach(booking => {
          if (booking.createdAt) {
            const date = new Date(booking.createdAt);
            const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            if (monthlyBookings[monthKey] !== undefined) {
              monthlyBookings[monthKey]++;
            }
          }
        });
        
        const monthlyBookingsData = Object.keys(monthlyBookings).map(key => ({
          name: key,
          bookings: monthlyBookings[key]
        }));
        
        setBookingStatusData(bookingStatusData);
        setServiceCategoryData(serviceCategoryData);
        setTechnicianSpecializationData(technicianSpecializationData);
        setMonthlyBookingsData(monthlyBookingsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                <p className="text-green-500 text-sm mt-1">{stat.change} from last month</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-blue-600 text-xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.map((booking, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id.substring(0, 8)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.service}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        booking.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <a href="/admin/bookings" className="text-blue-600 hover:text-blue-900 text-sm font-medium">
            View all bookings →
          </a>
        </div>
      </div>
      
      {/* Top Technicians */}
      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Top Technicians</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topTechnicians.map((tech, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tech.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tech.specialization}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tech.experience}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tech.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <a href="/admin/technicians" className="text-blue-600 hover:text-blue-900 text-sm font-medium">
            View all technicians →
          </a>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Booking Status Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Booking Status Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#6C5CE7', '#00B894', '#FD79A8', '#FDCB6E'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Service Categories Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Service Categories</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {serviceCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#A8E6CF', '#DCEDC1', '#FFD3B6', '#FFAAA5', '#FF8B94'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Technician Specializations Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Technician Specializations</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={technicianSpecializationData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {technicianSpecializationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Monthly Bookings Chart */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Bookings</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyBookingsData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#6C5CE7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;