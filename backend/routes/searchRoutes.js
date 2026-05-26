const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  searchGeneral,
  searchByBookingId,
  searchByCustomerId,
  searchByPaymentMethod,
  searchByVehicleType,
  searchByLocation,
  searchByCancelReason,
  searchByIncompleteReason,
  searchByRating,
} = require('../controllers/searchController');

const router = express.Router();

// Protect all search routes
router.use(protect);

// Part 1 routes
router.get('/', searchGeneral);
router.get('/bookings', searchByBookingId);
router.get('/customers', searchByCustomerId);

// Part 2 routes
router.get('/payment', searchByPaymentMethod);
router.get('/vehicle', searchByVehicleType);
router.get('/location', searchByLocation);
router.get('/cancel-reason', searchByCancelReason);
router.get('/incomplete', searchByIncompleteReason);
router.get('/rating', searchByRating);

module.exports = router;
