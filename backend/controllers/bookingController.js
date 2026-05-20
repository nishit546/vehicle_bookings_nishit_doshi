const Booking = require('../models/Booking');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const paginate = require('../utils/paginate');

/**
 * @desc    Fetch all bookings (with filtering, search, sorting, pagination)
 * @route   GET /api/v1/bookings
 * @access  Private
 */
const getBookings = asyncHandler(async (req, res) => {
  const {
    page,
    limit,
    sortBy,
    status,
    vehicleType,
    customerId,
    paymentMethod,
    search,
    minDistance,
    maxDistance,
    minVal,
    maxVal,
  } = req.query;

  // Base query: only fetch non-deleted bookings
  const query = { isDeleted: false };

  // 1. Direct Field Filtering
  if (status) query.bookingStatus = status;
  if (vehicleType) query.vehicleType = vehicleType;
  if (customerId) query.customerId = customerId;
  if (paymentMethod) query.paymentMethod = paymentMethod;

  // 2. Range Filtering — Ride Distance
  if (minDistance || maxDistance) {
    query.rideDistance = {};
    if (minDistance) query.rideDistance.$gte = Number(minDistance);
    if (maxDistance) query.rideDistance.$lte = Number(maxDistance);
  }

  // 3. Range Filtering — Booking Value
  if (minVal || maxVal) {
    query.bookingValue = {};
    if (minVal) query.bookingValue.$gte = Number(minVal);
    if (maxVal) query.bookingValue.$lte = Number(maxVal);
  }

  // 4. Case-Insensitive Regex Search on Locations / bookingId
  if (search) {
    query.$or = [
      { pickupLocation: { $regex: search, $options: 'i' } },
      { dropLocation: { $regex: search, $options: 'i' } },
      { bookingId: { $regex: search, $options: 'i' } },
    ];
  }

  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, 'Bookings fetched successfully.', data, 200);
});

/**
 * @desc    Fetch a single booking by bookingId
 * @route   GET /api/v1/bookings/:bookingId
 * @access  Private
 */
const getBookingById = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  // Try matching by custom bookingId field first, then fall back to Mongo _id
  let booking = await Booking.findOne({ bookingId, isDeleted: false });

  if (!booking && bookingId.match(/^[0-9a-fA-F]{24}$/)) {
    booking = await Booking.findOne({ _id: bookingId, isDeleted: false });
  }

  if (!booking) {
    return ApiResponse.error(res, `Booking with ID ${bookingId} not found.`, null, 404);
  }

  return ApiResponse.success(res, 'Booking fetched successfully.', booking, 200);
});

/**
 * @desc    Create a new booking
 * @route   POST /api/v1/bookings
 * @access  Private
 */
const createBooking = asyncHandler(async (req, res) => {
  const {
    bookingId,
    date,
    time,
    bookingStatus,
    customerId,
    vehicleType,
    pickupLocation,
    dropLocation,
    vTat,
    cTat,
    canceledRidesByCustomer,
    canceledRidesByDriver,
    incompleteRides,
    incompleteRidesReason,
    bookingValue,
    paymentMethod,
    rideDistance,
    driverRating,
    customerRating,
    vehicleImage,
  } = req.body;

  // Check for duplicate bookingId
  const bookingExists = await Booking.findOne({ bookingId });
  if (bookingExists) {
    return ApiResponse.error(res, `Booking with ID ${bookingId} already exists.`, null, 400);
  }

  const booking = await Booking.create({
    bookingId,
    date: date ? new Date(date) : new Date(),
    time: time || '00:00:00',
    bookingStatus: bookingStatus || 'Success',
    customerId: customerId || req.user.customerId || 'UNKNOWN',
    vehicleType,
    pickupLocation,
    dropLocation,
    vTat: vTat !== undefined ? vTat : null,
    cTat: cTat !== undefined ? cTat : null,
    canceledRidesByCustomer: canceledRidesByCustomer || null,
    canceledRidesByDriver: canceledRidesByDriver || null,
    incompleteRides: incompleteRides || null,
    incompleteRidesReason: incompleteRidesReason || null,
    bookingValue: Number(bookingValue) || 0,
    paymentMethod: paymentMethod || null,
    rideDistance: Number(rideDistance) || 0,
    driverRating: driverRating !== undefined ? driverRating : null,
    customerRating: customerRating !== undefined ? customerRating : null,
    vehicleImage: vehicleImage || null,
  });

  return ApiResponse.success(res, 'Booking created successfully.', booking, 201);
});

/**
 * @desc    Replace all booking details (full update)
 * @route   PUT /api/v1/bookings/:bookingId
 * @access  Private
 */
const updateBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  let booking = await Booking.findOne({ bookingId, isDeleted: false });
  if (!booking && bookingId.match(/^[0-9a-fA-F]{24}$/)) {
    booking = await Booking.findOne({ _id: bookingId, isDeleted: false });
  }

  if (!booking) {
    return ApiResponse.error(res, `Booking with ID ${bookingId} not found.`, null, 404);
  }

  const fieldsToUpdate = [
    'bookingStatus', 'vehicleType', 'pickupLocation', 'dropLocation',
    'vTat', 'cTat', 'canceledRidesByCustomer', 'canceledRidesByDriver',
    'incompleteRides', 'incompleteRidesReason', 'bookingValue',
    'paymentMethod', 'rideDistance', 'driverRating', 'customerRating', 'vehicleImage',
  ];

  fieldsToUpdate.forEach((field) => {
    if (req.body[field] !== undefined) booking[field] = req.body[field];
  });

  const updatedBooking = await booking.save();

  return ApiResponse.success(res, 'Booking updated successfully.', updatedBooking, 200);
});

/**
 * @desc    Update booking status only (partial update)
 * @route   PATCH /api/v1/bookings/:bookingId/status
 * @access  Private
 */
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { bookingStatus } = req.body;

  if (!bookingStatus) {
    return ApiResponse.error(res, 'bookingStatus field is required.', null, 400);
  }

  let booking = await Booking.findOne({ bookingId, isDeleted: false });
  if (!booking && bookingId.match(/^[0-9a-fA-F]{24}$/)) {
    booking = await Booking.findOne({ _id: bookingId, isDeleted: false });
  }

  if (!booking) {
    return ApiResponse.error(res, `Booking with ID ${bookingId} not found.`, null, 404);
  }

  booking.bookingStatus = bookingStatus;
  const updatedBooking = await booking.save();

  return ApiResponse.success(res, 'Booking status updated successfully.', updatedBooking, 200);
});

/**
 * @desc    Delete a booking (soft delete)
 * @route   DELETE /api/v1/bookings/:bookingId
 * @access  Private
 */
const deleteBooking = asyncHandler(async (req, res) => {
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

  return ApiResponse.success(res, `Booking ${bookingId} deleted successfully.`, null, 200);
});

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
};
