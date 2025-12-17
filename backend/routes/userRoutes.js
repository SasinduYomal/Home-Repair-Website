const express = require('express');
const { getUsers, getUserProfile, updateUserProfile, deleteUser, updateUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const router = express.Router();

// Admin routes
router.route('/')
  .get(protect, admin, getUsers)
  .post(protect, admin, updateUser);

router.route('/:id')
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUser);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;