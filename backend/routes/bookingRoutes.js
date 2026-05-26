const express = require('express');
const {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  bulkInsertBookings,
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
  // Part 3 — Routes 21 to 30
  getByMonth,
  getByYear,
  getByHour,
  getByMinute,
  getBySource,
  getByDestination,
  getByVehicleImage,
  getByFare,
  getCustomerHistory,
  getCustomerLatest,
} = require('../controllers/filterController');

const { protect } = require('../middlewares/auth');

const router = express.Router();

// Protect all booking routes
router.use(protect);

// ── Core CRUD ─────────────────────────────────────────────────────────────────
router.route('/').get(getBookings).post(createBooking);
router.post('/bulk-insert', bulkInsertBookings);
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

// ── Part 3: Filter Routes (21–30) ─────────────────────────────────────────────
router.get('/month/:month',                      getByMonth);          // 21
router.get('/year/:year',                        getByYear);           // 22
router.get('/hour/:hour',                        getByHour);           // 23
router.get('/minute/:minute',                    getByMinute);         // 24
router.get('/source/:pickup',                    getBySource);         // 25
router.get('/destination/:drop',                 getByDestination);    // 26
router.get('/vehicle-image/:imageName',          getByVehicleImage);   // 27
router.get('/fare/:value',                       getByFare);           // 28
router.get('/customer/:customerId/history',      getCustomerHistory);  // 29
router.get('/customer/:customerId/latest',       getCustomerLatest);   // 30

module.exports = router;
