import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register'; // Import the Register component
import Services from '../pages/Services';
import ServiceDetails from '../pages/ServiceDetails';
import Booking from '../pages/Booking';
import MyBookings from '../pages/MyBookings';
import Profile from '../pages/Profile';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Payment from '../pages/Payment';
import Confirmation from '../pages/Confirmation';
import ForgotPassword from '../pages/ForgotPassword';
import Technicians from '../pages/Technicians';
import TechnicianDetails from '../pages/TechnicianDetails';
import BookingDetails from '../pages/BookingDetails';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Add the Register route */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/services" element={<Services />} />
        <Route path="/service/:id" element={<ServiceDetails />} />
        <Route path="/technicians" element={<Technicians />} />
        <Route path="/technician/:id" element={<TechnicianDetails />} />
        <Route path="/booking/:serviceId" element={<Booking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/booking/:id" element={<BookingDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;