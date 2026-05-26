const Booking = require('../models/Booking');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const paginate = require('../utils/paginate');

/**
 * @desc    Admin: Access all bookings (paginated, includes soft-deleted based on showDeleted query)
 * @route   GET /api/v1/admin/bookings
 * @access  Private (Admin only)
 */
const getAdminBookings = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, showDeleted } = req.query;

  const query = showDeleted === 'true' ? {} : { isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });
  return ApiResponse.success(res, 'Admin: All bookings accessed successfully.', data, 200);
});

/**
 * @desc    Admin: Create booking
 * @route   POST /api/v1/admin/bookings
 * @access  Private (Admin only)
 */
const adminCreateBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  if (!bookingId) {
    return ApiResponse.error(res, 'bookingId field is required.', null, 400);
  }

  const bookingExists = await Booking.findOne({ bookingId });
  if (bookingExists) {
    return ApiResponse.error(res, `Booking with ID ${bookingId} already exists.`, null, 400);
  }

  const booking = await Booking.create({
    ...req.body,
    date: req.body.date ? new Date(req.body.date) : new Date(),
  });

  return ApiResponse.success(res, 'Admin: Booking created successfully.', booking, 201);
});

/**
 * @desc    Admin: Delete booking (soft delete)
 * @route   DELETE /api/v1/admin/bookings/:bookingId
 * @access  Private (Admin only)
 */
const adminDeleteBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  let booking = await Booking.findOne({ bookingId, isDeleted: false });
  if (!booking && bookingId.match(/^[0-9a-fA-F]{24}$/)) {
    booking = await Booking.findOne({ _id: bookingId, isDeleted: false });
  }

  if (!booking) {
    return ApiResponse.error(res, `Booking with ID ${bookingId} not found.`, null, 404);
  }

  booking.isDeleted = true;
  await booking.save();

  return ApiResponse.success(res, `Admin: Booking ${bookingId} deleted successfully.`, null, 200);
});

/**
 * @desc    Admin: Update booking details
 * @route   PATCH /api/v1/admin/bookings/:bookingId
 * @access  Private (Admin only)
 */
const adminUpdateBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  let booking = await Booking.findOne({ bookingId, isDeleted: false });
  if (!booking && bookingId.match(/^[0-9a-fA-F]{24}$/)) {
    booking = await Booking.findOne({ _id: bookingId, isDeleted: false });
  }

  if (!booking) {
    return ApiResponse.error(res, `Booking with ID ${bookingId} not found.`, null, 404);
  }

  // Update properties if provided in request body
  Object.keys(req.body).forEach((key) => {
    booking[key] = req.body[key];
  });

  const updatedBooking = await booking.save();
  return ApiResponse.success(res, `Admin: Booking ${bookingId} updated successfully.`, updatedBooking, 200);
});

/**
 * @desc    Admin: Access dashboard stats
 * @route   GET /api/v1/admin/dashboard
 * @access  Private (Admin only)
 */
const getAdminDashboard = asyncHandler(async (req, res) => {
  const totalBookings = await Booking.countDocuments({ isDeleted: false });
  const successfulBookings = await Booking.countDocuments({ bookingStatus: 'Success', isDeleted: false });
  const cancelledBookings = await Booking.countDocuments({ bookingStatus: { $regex: /^Canceled/i }, isDeleted: false });
  const incompleteBookings = await Booking.countDocuments({ bookingStatus: 'Incomplete', isDeleted: false });

  return ApiResponse.success(res, 'Admin: Dashboard stats accessed successfully.', {
    totalBookings,
    successfulBookings,
    cancelledBookings,
    incompleteBookings,
  }, 200);
});

/**
 * @desc    Protected: Access bookings (Users see only their own, Admin sees all active)
 * @route   GET /api/v1/protected/bookings
 * @access  Private (Any authenticated user)
 */
const getProtectedBookings = asyncHandler(async (req, res) => {
  let query = { isDeleted: false };
  
  if (req.user.role !== 'admin') {
    query.customerId = req.user.customerId || 'UNKNOWN';
  }

  const bookings = await Booking.find(query);
  return ApiResponse.success(res, 'Protected: Bookings accessed successfully.', bookings, 200);
});

/**
 * @desc    Protected: Create booking (Enforces user customerId if not admin)
 * @route   POST /api/v1/protected/bookings
 * @access  Private (Any authenticated user)
 */
const createProtectedBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  if (!bookingId) {
    return ApiResponse.error(res, 'bookingId field is required.', null, 400);
  }

  const bookingExists = await Booking.findOne({ bookingId });
  if (bookingExists) {
    return ApiResponse.error(res, `Booking with ID ${bookingId} already exists.`, null, 400);
  }

  const bookingData = { ...req.body };
  if (req.user.role !== 'admin') {
    bookingData.customerId = req.user.customerId || 'UNKNOWN';
  }

  const booking = await Booking.create({
    ...bookingData,
    date: bookingData.date ? new Date(bookingData.date) : new Date(),
  });

  return ApiResponse.success(res, 'Protected: Booking created successfully.', booking, 201);
});

/**
 * @desc    Protected: Delete booking (Users can delete only their own, Admin can delete any)
 * @route   DELETE /api/v1/protected/bookings/:bookingId
 * @access  Private (Any authenticated user)
 */
const deleteProtectedBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  let query = { bookingId, isDeleted: false };
  if (req.user.role !== 'admin') {
    query.customerId = req.user.customerId || 'UNKNOWN';
  }

  let booking = await Booking.findOne(query);
  if (!booking && bookingId.match(/^[0-9a-fA-F]{24}$/)) {
    delete query.bookingId;
    query._id = bookingId;
    booking = await Booking.findOne(query);
  }

  if (!booking) {
    return ApiResponse.error(res, 'Booking not found or not authorized to delete.', null, 404);
  }

  booking.isDeleted = true;
  await booking.save();

  return ApiResponse.success(res, `Protected: Booking ${bookingId} deleted successfully.`, null, 200);
});

module.exports = {
  getAdminBookings,
  adminCreateBooking,
  adminDeleteBooking,
  adminUpdateBooking,
  getAdminDashboard,
  getProtectedBookings,
  createProtectedBooking,
  deleteProtectedBooking,
};
