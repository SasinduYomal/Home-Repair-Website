const Review = require('../models/Review');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private/Admin
const getAllReviews = async (req, res) => {
  try {
    console.log('Fetching all reviews...');
    console.log('User from token:', req.user);
    
    const reviews = await Review.find({})
      .populate('user', 'name')
      .populate('service', 'title')
      .sort({ createdAt: -1 });
    
    console.log('Reviews fetched successfully:', reviews.length);
    console.log('Sample review:', reviews[0]);
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    // Log the full error stack trace
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a service
// @route   GET /api/reviews/service/:serviceId
// @access  Public
const getReviewsByService = async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { rating, review, serviceId } = req.body;

    // Check if review already exists
    const existingReview = await Review.findOne({
      user: req.user.id,
      service: serviceId,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this service' });
    }

    // Create review
    const newReview = await Review.create({
      rating,
      review,
      user: req.user.id,
      service: serviceId,
    });

    const populatedReview = await Review.findById(newReview._id)
      .populate('user', 'name');

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update review status
// @route   PUT /api/reviews/:id
// @access  Private/Admin
const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    review.status = status;
    const updatedReview = await review.save();
    
    // Populate references
    await updatedReview.populate('user', 'name');
    await updatedReview.populate('service', 'title');
    
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    await review.remove();
    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllReviews,
  getReviewsByService,
  createReview,
  updateReviewStatus,
  deleteReview,
};