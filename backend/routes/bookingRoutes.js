const express = require('express');
const {
  getBookings,
  getBookingById,
  createBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Protect all booking routes
router.use(protect);

// Route 1: GET /api/v1/bookings  — Fetch all bookings
// Route 2: POST /api/v1/bookings — Create new booking
router.route('/')
  .get(getBookings)
  .post(createBooking);

// Route 3: GET /api/v1/bookings/:bookingId — Fetch booking by ID
router.route('/:bookingId')
  .get(getBookingById);

module.exports = router;
