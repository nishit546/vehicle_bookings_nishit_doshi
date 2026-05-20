const express = require('express');
const {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Protect all bookings routes
router.use(protect);

router.route('/')
  .post(createBooking)
  .get(getBookings);

router.route('/:id')
  .get(getBooking)
  .put(updateBooking)
  .delete(deleteBooking);

module.exports = router;
