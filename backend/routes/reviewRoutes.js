const express = require('express');
const { getAllReviews, getReviewsByService, createReview, updateReviewStatus, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const router = express.Router();

// Public route for getting reviews by service (must be defined first to avoid conflicts)
router.get('/service/:serviceId', getReviewsByService);

// Admin routes for all reviews
router.get('/', protect, admin, getAllReviews);

// Create review (user route)
router.post('/', protect, createReview);

// Admin routes for individual reviews
router.put('/:id', protect, admin, updateReviewStatus);
router.delete('/:id', protect, admin, deleteReview);

module.exports = router;