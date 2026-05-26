const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const {
  getAdminBookings,
  adminCreateBooking,
  adminDeleteBooking,
  adminUpdateBooking,
  getAdminDashboard,
  getProtectedBookings,
  createProtectedBooking,
  deleteProtectedBooking,
} = require('../controllers/middlewareController');

const router = express.Router();

// All middleware routes require authentication
router.use(protect);

// ── Admin Routes (Admin role only) ────────────────────────────────────────────
router.route('/admin/bookings')
  .get(authorize('admin'), getAdminBookings)
  .post(authorize('admin'), adminCreateBooking);

router.route('/admin/bookings/:bookingId')
  .delete(authorize('admin'), adminDeleteBooking)
  .patch(authorize('admin'), adminUpdateBooking);

router.get('/admin/dashboard', authorize('admin'), getAdminDashboard);

// ── Protected Routes (Any authenticated user) ────────────────────────────────
router.route('/protected/bookings')
  .get(getProtectedBookings)
  .post(createProtectedBooking);

router.delete('/protected/bookings/:bookingId', deleteProtectedBooking);

module.exports = router;
