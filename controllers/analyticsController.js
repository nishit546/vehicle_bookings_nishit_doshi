const Booking = require('../models/Booking');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Aggregate total revenue and distance by vehicle type
 * @route   GET /api/v1/analytics/revenue
 * @access  Private/Admin
 */
const getRevenueStats = asyncHandler(async (req, res) => {
  const stats = await Booking.aggregate([
    // Stage 1: Filter out soft deleted records
    { $match: { isDeleted: false } },
    
    // Stage 2: Group by vehicle type and sum fields
    {
      $group: {
        _id: '$vehicleType',
        totalRevenue: { $sum: '$bookingValue' },
        totalDistance: { $sum: '$rideDistance' },
        totalBookings: { $sum: 1 },
      },
    },
    
    // Stage 3: Project, clean names, and compute averages
    {
      $project: {
        _id: 0,
        vehicleType: '$_id',
        totalRevenue: { $round: ['$totalRevenue', 2] },
        totalDistance: { $round: ['$totalDistance', 2] },
        totalBookings: 1,
        averageRevenuePerBooking: {
          $round: [{ $divide: ['$totalRevenue', '$totalBookings'] }, 2],
        },
      },
    },
    
    // Stage 4: Sort by total revenue descending
    { $sort: { totalRevenue: -1 } },
  ]);

  return ApiResponse.success(res, 'Revenue and distance statistics by vehicle type retrieved.', stats, 200);
});

/**
 * @desc    Aggregate booking statuses distribution counts
 * @route   GET /api/v1/analytics/status-distribution
 * @access  Private/Admin
 */
const getStatusDistribution = asyncHandler(async (req, res) => {
  const stats = await Booking.aggregate([
    // Stage 1: Filter out soft deleted records
    { $match: { isDeleted: false } },
    
    // Stage 2: Group by status and count
    {
      $group: {
        _id: '$bookingStatus',
        count: { $sum: 1 },
      },
    },
    
    // Stage 3: Project structure
    {
      $project: {
        _id: 0,
        status: '$_id',
        count: 1,
      },
    },
    
    // Stage 4: Sort by count descending
    { $sort: { count: -1 } },
  ]);

  return ApiResponse.success(res, 'Booking status distribution statistics retrieved.', stats, 200);
});

/**
 * @desc    Aggregate top 10 pickup and drop-off locations
 * @route   GET /api/v1/analytics/location-demand
 * @access  Private/Admin
 */
const getLocationDemand = asyncHandler(async (req, res) => {
  // Aggregate top pickups
  const topPickups = await Booking.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: '$pickupLocation', count: { $sum: 1 } } },
    { $project: { _id: 0, location: '$_id', count: 1 } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  // Aggregate top drops
  const topDrops = await Booking.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: '$dropLocation', count: { $sum: 1 } } },
    { $project: { _id: 0, location: '$_id', count: 1 } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  return ApiResponse.success(
    res,
    'Top 10 pickup and drop locations retrieved successfully.',
    { topPickups, topDrops },
    200
  );
});

/**
 * @desc    Aggregate average customer and driver ratings by vehicle type
 * @route   GET /api/v1/analytics/ratings-summary
 * @access  Private/Admin
 */
const getRatingsSummary = asyncHandler(async (req, res) => {
  const stats = await Booking.aggregate([
    // Stage 1: Match only non-deleted documents where ratings exist
    {
      $match: {
        isDeleted: false,
        driverRating: { $ne: null },
        customerRating: { $ne: null },
      },
    },
    
    // Stage 2: Group by vehicle type and calculate averages
    {
      $group: {
        _id: '$vehicleType',
        avgDriverRating: { $avg: '$driverRating' },
        avgCustomerRating: { $avg: '$customerRating' },
        ratedBookingsCount: { $sum: 1 },
      },
    },
    
    // Stage 3: Project and round to 2 decimal places
    {
      $project: {
        _id: 0,
        vehicleType: '$_id',
        avgDriverRating: { $round: ['$avgDriverRating', 2] },
        avgCustomerRating: { $round: ['$avgCustomerRating', 2] },
        ratedBookingsCount: 1,
      },
    },
    
    // Stage 4: Sort alphabetically by vehicle type
    { $sort: { vehicleType: 1 } },
  ]);

  return ApiResponse.success(res, 'Average ratings summary by vehicle type retrieved.', stats, 200);
});

module.exports = {
  getRevenueStats,
  getStatusDistribution,
  getLocationDemand,
  getRatingsSummary,
};
