const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');
const Technician = require('../models/Technician');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    console.log('Received booking request:', req.body);
    console.log('User from token:', req.user);
    
    const { service, technician, date, time, totalPrice, paymentMethod, transactionId, customerInfo } = req.body;

    // Validate required fields
    if (!service || !technician || !date || !time || !totalPrice || !paymentMethod || !customerInfo) {
      console.log('Missing required fields:', {
        service: !!service,
        technician: !!technician,
        date: !!date,
        time: !!time,
        totalPrice: !!totalPrice,
        paymentMethod: !!paymentMethod,
        customerInfo: !!customerInfo
      });
      return res.status(400).json({ 
        message: 'Please provide all required fields. Required: service, technician, date, time, total price, payment method, and customer information.' 
      });
    }

    // Validate customerInfo required fields with user-friendly messages
    if (!customerInfo.name || customerInfo.name.trim() === '') {
      console.log('Missing customer name');
      return res.status(400).json({ 
        message: 'Customer name is required. Please provide your full name in the billing information section.' 
      });
    }
    
    if (!customerInfo.email || customerInfo.email.trim() === '') {
      console.log('Missing customer email');
      return res.status(400).json({ 
        message: 'Customer email is required. Please provide your email address in the billing information section.' 
      });
    }

    // Validate service exists
    const serviceExists = await Service.findById(service);
    console.log('Service exists:', serviceExists);
    if (!serviceExists) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Validate technician exists
    const technicianExists = await Technician.findById(technician);
    console.log('Technician exists:', technicianExists);
    if (!technicianExists) {
      return res.status(404).json({ message: 'Technician not found' });
    }

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      service,
      technician,
      date,
      time,
      totalPrice,
      paymentMethod,
      transactionId,
      customerInfo,
    });

    console.log('Creating booking:', booking);
    const createdBooking = await booking.save();
    console.log('Booking saved:', createdBooking);

    // Populate references
    await createdBooking.populate('user', 'name email');
    await createdBooking.populate('service', 'title');
    await createdBooking.populate('technician', 'name');

    console.log('Booking populated:', createdBooking);
    res.status(201).json(createdBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings for logged in user
// @route   GET /api/bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    console.log('getMyBookings called for user:', req.user);
    const bookings = await Booking.find({ user: req.user._id })
      .populate('service', 'title')
      .populate('technician', 'name')
      .sort({ createdAt: -1 });

    console.log('Found bookings:', bookings.length);
    res.json(bookings);
  } catch (error) {
    console.error('Error in getMyBookings:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('service', 'title')
      .populate('technician', 'name');

    if (booking) {
      // Check if booking belongs to user or user is admin
      if (booking.user.toString() === req.user._id.toString() || req.user.isAdmin) {
        res.json(booking);
      } else {
        res.status(403).json({ message: 'Not authorized to view this booking' });
      }
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.status = status;
      const updatedBooking = await booking.save();
      
      // Populate references
      await updatedBooking.populate('user', 'name email');
      await updatedBooking.populate('service', 'title');
      await updatedBooking.populate('technician', 'name');
      
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      // Check if booking belongs to user
      if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to cancel this booking' });
      }

      // Check if booking can be cancelled (only pending bookings)
      if (booking.status !== 'pending') {
        return res.status(400).json({ message: 'Only pending bookings can be cancelled' });
      }

      booking.status = 'cancelled';
      const updatedBooking = await booking.save();
      
      // Populate references
      await updatedBooking.populate('user', 'name email');
      await updatedBooking.populate('service', 'title');
      await updatedBooking.populate('technician', 'name');
      
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings/all
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('service', 'title')
      .populate('technician', 'name')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getAllBookings,
};