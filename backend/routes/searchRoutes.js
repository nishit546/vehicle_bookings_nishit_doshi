const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  searchGeneral,
  searchByBookingId,
  searchByCustomerId,
} = require('../controllers/searchController');

const router = express.Router();

// Protect all search routes
router.use(protect);

// Part 1 routes
router.get('/', searchGeneral);
router.get('/bookings', searchByBookingId);
router.get('/customers', searchByCustomerId);

module.exports = router;
