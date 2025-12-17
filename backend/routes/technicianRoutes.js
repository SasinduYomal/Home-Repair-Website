const express = require('express');
const { getTechnicians, getTechnicianById, createTechnician, updateTechnician, deleteTechnician } = require('../controllers/technicianController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const router = express.Router();

router.route('/')
  .get(getTechnicians)
  .post(protect, admin, createTechnician);

router.route('/:id')
  .get(getTechnicianById)
  .put(protect, admin, updateTechnician)
  .delete(protect, admin, deleteTechnician);

module.exports = router;