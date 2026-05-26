const Rating = require('../models/Rating');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create a new rating record
 * @route   POST /api/v1/ratings
 * @access  Private
 */
const createRating = asyncHandler(async (req, res) => {
  const { ratingId, bookingId, driverRating, customerRating } = req.body;

  if (!ratingId || !bookingId || driverRating === undefined || customerRating === undefined) {
    return ApiResponse.error(res, 'ratingId, bookingId, driverRating and customerRating fields are required.', null, 400);
  }

  const ratingExists = await Rating.findOne({ ratingId });
  if (ratingExists) {
    return ApiResponse.error(res, `Rating with ID ${ratingId} already exists.`, null, 400);
  }

  const rating = await Rating.create({
    ratingId,
    bookingId,
    driverRating: Number(driverRating),
    customerRating: Number(customerRating),
  });

  return ApiResponse.success(res, 'Rating created successfully.', rating, 201);
});

module.exports = {
  createRating,
};
