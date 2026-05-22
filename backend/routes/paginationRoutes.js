const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const {
  // Part 1
  getCustomers,
  getVehicles,
  getSuccessRides,
  getCancelledRides,
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

module.exports = router;
