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
  // Part 2 — Routes 11 to 20
  getByCustomerRating,
  getByDistance,
  getByValue,
  getByIncompleteStatus,
  getByIncompleteReason,
  getByCancelCustomer,
  getByCancelDriver,
  getByVtat,
  getByCtat,
  getByDay,
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

// ── Part 2: Filter Routes (11–20) ─────────────────────────────────────────────
router.get('/rating/customer/:rating',    getByCustomerRating);    // 11
router.get('/distance/:distance',         getByDistance);          // 12
router.get('/value/:amount',              getByValue);             // 13
router.get('/incomplete/:status',         getByIncompleteStatus);  // 14
router.get('/incomplete-reason/:reason',  getByIncompleteReason);  // 15
router.get('/cancel/customer/:reason',    getByCancelCustomer);    // 16
router.get('/cancel/driver/:reason',      getByCancelDriver);      // 17
router.get('/vtat/:minutes',              getByVtat);              // 18
router.get('/ctat/:minutes',              getByCtat);              // 19
router.get('/day/:day',                   getByDay);               // 20

module.exports = router;
