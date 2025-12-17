const express = require('express');
const router = express.Router();
const { 
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getAllBookings
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// All routes are protected
router.route('/')
  .post(protect, createBooking)
  .get(protect, getMyBookings);

// Admin route to get all bookings
router.route('/all')
  .get(protect, admin, getAllBookings);

// Individual booking routes
router.route('/:id')
  .get(protect, getBookingById)
  .put(protect, admin, updateBookingStatus);

// Cancel booking route
router.route('/:id/cancel')
  .put(protect, cancelBooking);

module.exports = router;