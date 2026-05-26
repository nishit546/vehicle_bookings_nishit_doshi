const Booking = require('../models/Booking');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const paginate = require('../utils/paginate');

/**
 * @desc    Fetch all bookings with full query-param filtering, sorting, pagination
 * @route   GET /api/v1/bookings
 * @access  Private
 *
 * Supported Query Params:
 * ── Part 1 (Queries 1–8) ─────────────────────────────────────────────────────
 *   ?status=Success            Filter by booking status (case-insensitive)
 *   ?vehicle=Bike              Filter by vehicle type  (alias: vehicleType)
 *   ?payment=UPI               Filter by payment method (alias: paymentMethod)
 *   ?pickup=Indiranagar        Filter by pickup location
 *   ?drop=Jayanagar            Filter by drop location
 *   ?date=2024-07-26           Filter by exact date (YYYY-MM-DD)
 *   ?time=14:00                Filter by time prefix (HH:MM)
 *   ?driverRating=4            Filter by exact driver rating
 * ── Part 2 (Queries 9–16) ────────────────────────────────────────────────────
 *   ?customerRating=5          Filter by exact customer rating
 *   ?minFare=200               Bookings with fare >= minFare
 *   ?maxFare=1000              Bookings with fare <= maxFare
 *   ?minDistance=10            Bookings with distance >= minDistance
 *   ?maxDistance=40            Bookings with distance <= maxDistance
 *   ?customer=CID123456        Filter by customer ID (alias: customerId)
 *   ?incomplete=Yes            Filter by incompleteRides field
 *   ?cancelledByDriver=true    Fetch driver-cancelled rides
 * ── Part 3 (Queries 17–23) ───────────────────────────────────────────────────
 *   ?cancelledByCustomer=true  Fetch customer-cancelled rides
 *   ?sort=Booking_Value        Sort by booking value ascending
 *   ?sort=-Booking_Value       Sort by booking value descending
 *   ?minRating=4&maxRating=5   Filter by driver rating range
 *   ?distanceAbove=20          Bookings with distance > 20 (long rides)
 *   ?distanceBelow=10          Bookings with distance < 10 (short rides)
 * ── Part 4 (Queries 24–30) ───────────────────────────────────────────────────
 *   ?month=07                  Filter by month number (1–12)
 *   ?year=2024                 Filter by year
 *   ?hour=18                   Filter by hour of day (0–23) from time field
 */
const getBookings = asyncHandler(async (req, res) => {
  const {
    page, limit, sortBy,
    // Legacy / original params
    vehicleType, customerId, paymentMethod,
    search, minVal, maxVal,
    // Part 1 — Queries 1–8
    status, vehicle, payment, pickup, drop,
    date, time, driverRating, customer,
    // Part 2 — Queries 9–16
    customerRating, minFare, maxFare,
    minDistance, maxDistance,
    incomplete, cancelledByDriver,
    // Part 3 — Queries 17–23
    cancelledByCustomer, sort,
    minRating, maxRating,
    distanceAbove, distanceBelow,
    // Part 4 — Queries 24–30
    month, year, hour,
  } = req.query;

  // Base query
  const query = { isDeleted: false };
  const exprConditions = []; // for $expr / date extraction conditions

  // ── Part 1: Basic Field Filters ───────────────────────────────────────────

  // ?status= — supports multi-word statuses (e.g. "Driver Not Found")
  if (status) query.bookingStatus = { $regex: status, $options: 'i' };

  // ?vehicle= or ?vehicleType=
  if (vehicle) query.vehicleType = { $regex: vehicle, $options: 'i' };
  else if (vehicleType) query.vehicleType = { $regex: vehicleType, $options: 'i' };

  // ?payment= or ?paymentMethod=
  if (payment) query.paymentMethod = { $regex: payment, $options: 'i' };
  else if (paymentMethod) query.paymentMethod = { $regex: paymentMethod, $options: 'i' };

  // ?pickup= — pickup location (case-insensitive)
  if (pickup) query.pickupLocation = { $regex: pickup, $options: 'i' };

  // ?drop= — drop location (case-insensitive)
  if (drop) query.dropLocation = { $regex: drop, $options: 'i' };

  // ?date=YYYY-MM-DD — match full calendar day
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    if (!isNaN(start)) query.date = { $gte: start, $lt: end };
  }

  // ?time=HH:MM — prefix match on stored time string
  if (time) query.time = { $regex: `^${time}`, $options: 'i' };

  // ?driverRating=4 — exact driver rating
  if (driverRating !== undefined) query.driverRating = parseFloat(driverRating);

  // ── Part 2: Rating, Fare, Distance, Boolean Filters ───────────────────────

  // ?customer= or ?customerId=
  if (customer) query.customerId = customer;
  else if (customerId) query.customerId = customerId;

  // ?customerRating=5
  if (customerRating !== undefined) query.customerRating = parseFloat(customerRating);

  // ?minFare= / ?maxFare= (alias for minVal/maxVal)
  const fareMin = minFare || minVal;
  const fareMax = maxFare || maxVal;
  if (fareMin || fareMax) {
    query.bookingValue = {};
    if (fareMin) query.bookingValue.$gte = Number(fareMin);
    if (fareMax) query.bookingValue.$lte = Number(fareMax);
  }

  // ?minDistance= / ?maxDistance=
  if (minDistance || maxDistance) {
    query.rideDistance = query.rideDistance || {};
    if (minDistance) query.rideDistance.$gte = Number(minDistance);
    if (maxDistance) query.rideDistance.$lte = Number(maxDistance);
  }

  // ?incomplete=Yes — filter by incompleteRides field value
  if (incomplete) query.incompleteRides = { $regex: incomplete, $options: 'i' };

  // ?cancelledByDriver=true — fetch rides where driver cancelled
  if (cancelledByDriver === 'true') {
    query.canceledRidesByDriver = { $exists: true, $ne: null };
  }

  // ── Part 3: Cancellation, Sort, Rating Range, Distance Range ─────────────

  // ?cancelledByCustomer=true
  if (cancelledByCustomer === 'true') {
    query.canceledRidesByCustomer = { $exists: true, $ne: null };
  }

  // ?minRating= / ?maxRating= — driver rating range
  if (minRating || maxRating) {
    query.driverRating = query.driverRating || {};
    if (minRating) query.driverRating.$gte = parseFloat(minRating);
    if (maxRating) query.driverRating.$lte = parseFloat(maxRating);
  }

  // ?distanceAbove=20 (long rides — exclusive lower bound)
  if (distanceAbove) {
    query.rideDistance = query.rideDistance || {};
    query.rideDistance.$gt = Number(distanceAbove);
  }

  // ?distanceBelow=10 (short rides — exclusive upper bound)
  if (distanceBelow) {
    query.rideDistance = query.rideDistance || {};
    query.rideDistance.$lt = Number(distanceBelow);
  }

  // ── Part 4: Date Component Filters ───────────────────────────────────────

  // ?month=07 — filter by month number (1–12)
  if (month) {
    exprConditions.push({ $eq: [{ $month: '$date' }, parseInt(month, 10)] });
  }

  // ?year=2024 — filter by calendar year
  if (year) {
    exprConditions.push({ $eq: [{ $year: '$date' }, parseInt(year, 10)] });
  }

  // ?hour=18 — filter by hour prefix in time string (e.g. "18:00:00")
  if (hour !== undefined) {
    const paddedHour = String(parseInt(hour, 10)).padStart(2, '0');
    query.time = { $regex: `^${paddedHour}:`, $options: 'i' };
  }

  // Merge $expr conditions if any date extraction filters are present
  if (exprConditions.length > 0) {
    query.$expr = exprConditions.length === 1
      ? exprConditions[0]
      : { $and: exprConditions };
  }

  // ── Existing: Text Search ─────────────────────────────────────────────────
  if (search) {
    query.$or = [
      { pickupLocation: { $regex: search, $options: 'i' } },
      { dropLocation:   { $regex: search, $options: 'i' } },
      { bookingId:      { $regex: search, $options: 'i' } },
    ];
  }

  // ── Sort param: ?sort=Field or ?sort=-Field ──────────────────────────────
  // Prefix dash (-) means descending. Maps human-readable keys to Mongoose field names.
  // Part 1 — Booking_Value, Ride_Distance, Driver_Ratings, Customer_Rating, Date
  // Part 2 — Vehicle_Type, Payment_Method, Pickup_Location, Drop_Location
  // Part 3 — Booking_Status
  const sortFieldMap = {
    'Booking_Value':   'bookingValue',   // ?sort=Booking_Value
    'Ride_Distance':   'rideDistance',   // ?sort=Ride_Distance
    'Driver_Ratings':  'driverRating',   // ?sort=Driver_Ratings
    'Customer_Rating': 'customerRating', // ?sort=Customer_Rating
    'Date':            'date',           // ?sort=Date
    'Vehicle_Type':    'vehicleType',    // ?sort=Vehicle_Type
    'Payment_Method':  'paymentMethod',  // ?sort=Payment_Method
    'Pickup_Location': 'pickupLocation', // ?sort=Pickup_Location
    'Drop_Location':   'dropLocation',   // ?sort=Drop_Location
    'Booking_Status':  'bookingStatus',  // ?sort=Booking_Status
  };

  let resolvedSortBy = sortBy;
  if (sort) {
    const isDesc  = sort.startsWith('-');
    const key     = isDesc ? sort.slice(1) : sort;
    const field   = sortFieldMap[key] || key;
    resolvedSortBy = `${field}:${isDesc ? 'desc' : 'asc'}`;
  }


  const data = await paginate(Booking, query, { page, limit, sortBy: resolvedSortBy });
  return ApiResponse.success(res, 'Bookings fetched successfully.', data, 200);
});

/**
 * @desc    Fetch a single booking by bookingId
 * @route   GET /api/v1/bookings/:bookingId
 * @access  Private
 */
const getBookingById = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

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
    bookingId, date, time, bookingStatus, customerId, vehicleType,
    pickupLocation, dropLocation, vTat, cTat, canceledRidesByCustomer,
    canceledRidesByDriver, incompleteRides, incompleteRidesReason,
    bookingValue, paymentMethod, rideDistance, driverRating,
    customerRating, vehicleImage,
  } = req.body;

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

/**
 * @desc    Bulk insert bookings
 * @route   POST /api/v1/bookings/bulk-insert
 * @access  Private
 */
const bulkInsertBookings = asyncHandler(async (req, res) => {
  const { bookings } = req.body;

  if (!bookings || !Array.isArray(bookings) || bookings.length === 0) {
    return ApiResponse.error(res, 'Please provide a non-empty array of booking objects in the bookings field.', null, 400);
  }

  // Set default values where necessary
  const preparedBookings = bookings.map((b) => ({
    ...b,
    date: b.date ? new Date(b.date) : new Date(),
    time: b.time || '00:00:00',
    bookingStatus: b.bookingStatus || 'Success',
    customerId: b.customerId || 'UNKNOWN',
    bookingValue: Number(b.bookingValue) || 0,
    rideDistance: Number(b.rideDistance) || 0,
    isDeleted: false,
  }));

  const result = await Booking.insertMany(preparedBookings, { ordered: false });
  return ApiResponse.success(res, `${result.length} bookings inserted successfully.`, result, 201);
});

/**
 * @desc    Delete all booking records (hard delete)
 * @route   DELETE /api/v1/bookings/delete-all
 * @access  Private
 */
const deleteAllBookings = asyncHandler(async (req, res) => {
  const result = await Booking.deleteMany({});
  return ApiResponse.success(res, `All bookings deleted successfully. Count: ${result.deletedCount}`, null, 200);
});

/**
 * @desc    Delete all cancelled bookings (hard delete)
 * @route   DELETE /api/v1/cancelled-rides/delete-all
 * @access  Private
 */
const deleteAllCancelledBookings = asyncHandler(async (req, res) => {
  const result = await Booking.deleteMany({
    bookingStatus: { $regex: /^Canceled/i }
  });
  return ApiResponse.success(res, `All cancelled bookings deleted successfully. Count: ${result.deletedCount}`, null, 200);
});

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  bulkInsertBookings,
  deleteAllBookings,
  deleteAllCancelledBookings,
};
