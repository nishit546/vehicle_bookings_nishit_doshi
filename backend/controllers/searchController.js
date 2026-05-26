const Booking = require('../models/Booking');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const paginate = require('../utils/paginate');

/**
 * @desc    General keyword search across multiple fields
 * @route   GET /api/v1/search
 * @access  Private
 */
const searchGeneral = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, keyword } = req.query;

  const query = { isDeleted: false };

  if (keyword) {
    query.$or = [
      { pickupLocation: { $regex: keyword, $options: 'i' } },
      { dropLocation: { $regex: keyword, $options: 'i' } },
      { vehicleType: { $regex: keyword, $options: 'i' } },
      { bookingStatus: { $regex: keyword, $options: 'i' } },
      { paymentMethod: { $regex: keyword, $options: 'i' } },
    ];
  }

  const data = await paginate(Booking, query, { page, limit, sortBy });
  return ApiResponse.success(res, 'General search results fetched successfully.', data, 200);
});

/**
 * @desc    Search bookings by bookingId prefix/substring
 * @route   GET /api/v1/search/bookings
 * @access  Private
 */
const searchByBookingId = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, bookingId } = req.query;

  const query = { isDeleted: false };

  if (bookingId) {
    query.bookingId = { $regex: bookingId, $options: 'i' };
  }

  const data = await paginate(Booking, query, { page, limit, sortBy });
  return ApiResponse.success(res, 'Booking ID search results fetched successfully.', data, 200);
});

/**
 * @desc    Search bookings by customerId prefix/substring
 * @route   GET /api/v1/search/customers
 * @access  Private
 */
const searchByCustomerId = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, customerId } = req.query;

  const query = { isDeleted: false };

  if (customerId) {
    query.customerId = { $regex: customerId, $options: 'i' };
  }

  const data = await paginate(Booking, query, { page, limit, sortBy });
  return ApiResponse.success(res, 'Customer ID search results fetched successfully.', data, 200);
});

module.exports = {
  searchGeneral,
  searchByBookingId,
  searchByCustomerId,
};
