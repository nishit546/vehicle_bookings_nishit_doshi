const Location = require('../models/Location');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create a new location record
 * @route   POST /api/v1/locations
 * @access  Private
 */
const createLocation = asyncHandler(async (req, res) => {
  const { locationId, name, type } = req.body;

  if (!locationId || !name) {
    return ApiResponse.error(res, 'locationId and name fields are required.', null, 400);
  }

  const locationExists = await Location.findOne({ locationId });
  if (locationExists) {
    return ApiResponse.error(res, `Location with ID ${locationId} already exists.`, null, 400);
  }

  const location = await Location.create({
    locationId,
    name,
    type: type || 'both',
  });

  return ApiResponse.success(res, 'Location created successfully.', location, 201);
});

module.exports = {
  createLocation,
};
