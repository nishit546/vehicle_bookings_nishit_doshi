const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const { deleteAllCancelledBookings } = require('../controllers/bookingController');
const {
  // Part 1
  getCustomers,
  getVehicles,
  getSuccessRides,
  getCancelledRides,
  // Part 2
  getIncompleteRides,
  getRatings,
  getPayments,
} = require('../controllers/paginationController');

const router = express.Router();

// All routes require authentication
router.use(protect);

// ── Part 1: Paginated Routes (1–5) ────────────────────────────────────────────
// Note: GET /bookings?page=&limit= already works via existing bookingRoutes

// Route 3: GET /api/v1/customers?page=1&limit=10
router.get('/customers',       getCustomers);

// Route 4: GET /api/v1/vehicles?page=1&limit=5
router.get('/vehicles',        getVehicles);

// Route 5: GET /api/v1/success-rides?page=1&limit=15
router.get('/success-rides',   getSuccessRides);

// Route 6: GET /api/v1/cancelled-rides?page=2&limit=10
router.get('/cancelled-rides', getCancelledRides);
router.delete('/cancelled-rides/delete-all', deleteAllCancelledBookings);

// ── Part 2: Paginated Routes (6–10) ───────────────────────────────────────────

// Route 7: GET /api/v1/incomplete-rides?page=1&limit=5
router.get('/incomplete-rides', getIncompleteRides);

// Route 8: GET /api/v1/ratings?page=1&limit=25
router.get('/ratings',          getRatings);

// Route 9: GET /api/v1/payments?page=1&limit=20
router.get('/payments',         getPayments);

module.exports = router;
