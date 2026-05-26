const Vehicle = require('../models/Vehicle');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create a new vehicle record
 * @route   POST /api/v1/vehicles
 * @access  Private
 */
const createVehicle = asyncHandler(async (req, res) => {
  const { vehicleId, vehicleType, vehicleNumber } = req.body;

  if (!vehicleId || !vehicleType) {
    return ApiResponse.error(res, 'vehicleId and vehicleType fields are required.', null, 400);
  }

  const vehicleExists = await Vehicle.findOne({ vehicleId });
  if (vehicleExists) {
    return ApiResponse.error(res, `Vehicle with ID ${vehicleId} already exists.`, null, 400);
  }

  const vehicle = await Vehicle.create({
    vehicleId,
    vehicleType,
    vehicleNumber,
  });

  return ApiResponse.success(res, 'Vehicle created successfully.', vehicle, 201);
});

module.exports = {
  createVehicle,
};
