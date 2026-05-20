const express = require('express');
const {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Protect all booking routes
router.use(protect);

// Route 1: GET  /api/v1/bookings — Fetch all bookings
// Route 3: POST /api/v1/bookings — Create new booking
router.route('/')
  .get(getBookings)
  .post(createBooking);

// Route 5: PATCH /api/v1/bookings/:bookingId/status — Update booking status only
// (must be declared BEFORE /:bookingId to avoid :bookingId catching "status" as a param)
router.route('/:bookingId/status')
  .patch(updateBookingStatus);

// Route 2: GET    /api/v1/bookings/:bookingId — Fetch booking by ID
// Route 4: PUT    /api/v1/bookings/:bookingId — Replace booking details
// Route 6: DELETE /api/v1/bookings/:bookingId — Delete booking
router.route('/:bookingId')
  .get(getBookingById)
  .put(updateBooking)
  .delete(deleteBooking);

module.exports = router;
