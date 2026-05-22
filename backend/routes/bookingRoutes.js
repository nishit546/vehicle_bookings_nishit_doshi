const express = require('express');
const {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/bookingController');

const {
  // Part 1 — Routes 1 to 10
  getByBookingId,
  getByStatus,
  getByCustomer,
  getByVehicleType,
  getByPaymentMethod,
  getByPickupLocation,
  getByDropLocation,
  getByDate,
  getByTime,
  getByDriverRating,
} = require('../controllers/filterController');

const { protect } = require('../middlewares/auth');

const router = express.Router();

// Protect all booking routes
router.use(protect);

// ── Core CRUD ─────────────────────────────────────────────────────────────────
router.route('/').get(getBookings).post(createBooking);
router.route('/:bookingId/status').patch(updateBookingStatus);
router.route('/:bookingId').get(getBookingById).put(updateBooking).delete(deleteBooking);

// ── Part 1: Filter Routes (1–10) ──────────────────────────────────────────────
router.get('/id/:bookingId',          getByBookingId);       // 1
router.get('/status/:status',         getByStatus);          // 2
router.get('/customer/:customerId',   getByCustomer);        // 3
router.get('/vehicle/:vehicleType',   getByVehicleType);     // 4
router.get('/payment/:method',        getByPaymentMethod);   // 5
router.get('/pickup/:location',       getByPickupLocation);  // 6
router.get('/drop/:location',         getByDropLocation);    // 7
router.get('/date/:date',             getByDate);            // 8
router.get('/time/:time',             getByTime);            // 9
router.get('/rating/driver/:rating',  getByDriverRating);    // 10

module.exports = router;
