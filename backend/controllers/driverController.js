const Driver = require('../models/Driver');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create a new driver record
 * @route   POST /api/v1/drivers
 * @access  Private
 */
const createDriver = asyncHandler(async (req, res) => {
  const { driverId, name, phone, rating } = req.body;

  if (!driverId || !name) {
    return ApiResponse.error(res, 'driverId and name fields are required.', null, 400);
  }

  const driverExists = await Driver.findOne({ driverId });
  if (driverExists) {
    return ApiResponse.error(res, `Driver with ID ${driverId} already exists.`, null, 400);
  }

  const driver = await Driver.create({
    driverId,
    name,
    phone,
    rating: rating !== undefined ? Number(rating) : 0,
  });

  return ApiResponse.success(res, 'Driver created successfully.', driver, 201);
});

/**
 * @desc    Bulk insert driver records
 * @route   POST /api/v1/drivers/bulk-insert
 * @access  Private
 */
const bulkInsertDrivers = asyncHandler(async (req, res) => {
  const { drivers } = req.body;

  if (!drivers || !Array.isArray(drivers) || drivers.length === 0) {
    return ApiResponse.error(res, 'Please provide a non-empty array of driver objects in the drivers field.', null, 400);
  }

  const result = await Driver.insertMany(drivers, { ordered: false });
  return ApiResponse.success(res, `${result.length} drivers inserted successfully.`, result, 201);
});

module.exports = {
  createDriver,
  bulkInsertDrivers,
};
