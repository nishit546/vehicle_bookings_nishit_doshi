const Booking = require('../models/Booking');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const paginate = require('../utils/paginate');

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

  // Check if bookingId is already taken
  const bookingExists = await Booking.findOne({ bookingId });
  if (bookingExists) {
    return ApiResponse.error(res, `Booking with ID ${bookingId} already exists.`, null, 400);
  }

  // Create booking
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
 * @desc    Get all bookings (with filtering, regex search, sorting, pagination)
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
  if (status) {
    query.bookingStatus = status;
  }
  if (vehicleType) {
    query.vehicleType = vehicleType;
  }
  if (customerId) {
    query.customerId = customerId;
  }
  if (paymentMethod) {
    query.paymentMethod = paymentMethod;
  }

  // 2. Advanced Operator Querying (Distance: $gte, $lte)
  if (minDistance || maxDistance) {
    query.rideDistance = {};
    if (minDistance) query.rideDistance.$gte = Number(minDistance);
    if (maxDistance) query.rideDistance.$lte = Number(maxDistance);
  }

  // 3. Advanced Operator Querying (Booking Value: $gte, $lte)
  if (minVal || maxVal) {
    query.bookingValue = {};
    if (minVal) query.bookingValue.$gte = Number(minVal);
    if (maxVal) query.bookingValue.$lte = Number(maxVal);
  }

  // 4. Case-Insensitive Search on Locations using Regex
  if (search) {
    query.$or = [
      { pickupLocation: { $regex: search, $options: 'i' } },
      { dropLocation: { $regex: search, $options: 'i' } },
      { bookingId: { $regex: search, $options: 'i' } },
    ];
  }

  // Execute pagination helper
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, 'Bookings retrieved successfully.', data, 200);
});

/**
 * @desc    Get a single booking by bookingId or database _id
 * @route   GET /api/v1/bookings/:id
 * @access  Private
 */
const getBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Attempt to find by unique bookingId first, fall back to MongoDB ObjectId
  let booking = await Booking.findOne({ bookingId: id, isDeleted: false });

  if (!booking && id.match(/^[0-9a-fA-F]{24}$/)) {
    booking = await Booking.findOne({ _id: id, isDeleted: false });
  }

  if (!booking) {
    return ApiResponse.error(res, `Booking with ID ${id} not found.`, null, 404);
  }

  return ApiResponse.success(res, 'Booking retrieved successfully.', booking, 200);
});

/**
 * @desc    Update a booking by bookingId or database _id
 * @route   PUT /api/v1/bookings/:id
 * @access  Private
 */
const updateBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Verify booking exists and is not soft deleted
  let booking = await Booking.findOne({ bookingId: id, isDeleted: false });
  if (!booking && id.match(/^[0-9a-fA-F]{24}$/)) {
    booking = await Booking.findOne({ _id: id, isDeleted: false });
  }

  if (!booking) {
    return ApiResponse.error(res, `Booking with ID ${id} not found.`, null, 404);
  }

  // Fields allowed to be updated
  const fieldsToUpdate = [
    'bookingStatus',
    'vehicleType',
    'pickupLocation',
    'dropLocation',
    'vTat',
    'cTat',
    'canceledRidesByCustomer',
    'canceledRidesByDriver',
    'incompleteRides',
    'incompleteRidesReason',
    'bookingValue',
    'paymentMethod',
    'rideDistance',
    'driverRating',
    'customerRating',
    'vehicleImage',
  ];

  // Update allowed fields
  fieldsToUpdate.forEach((field) => {
    if (req.body[field] !== undefined) {
      booking[field] = req.body[field];
    }
  });

  const updatedBooking = await booking.save();

  return ApiResponse.success(res, 'Booking updated successfully.', updatedBooking, 200);
});

/**
 * @desc    Soft delete a booking
 * @route   DELETE /api/v1/bookings/:id
 * @access  Private
 */
const deleteBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let booking = await Booking.findOne({ bookingId: id, isDeleted: false });
  if (!booking && id.match(/^[0-9a-fA-F]{24}$/)) {
    booking = await Booking.findOne({ _id: id, isDeleted: false });
  }

  if (!booking) {
    return ApiResponse.error(res, `Booking with ID ${id} not found.`, null, 404);
  }

  // Soft delete
  booking.isDeleted = true;
  await booking.save();

  return ApiResponse.success(res, `Booking with ID ${id} deleted successfully (soft deleted).`, null, 200);
});

module.exports = {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking,
};
