const Customer = require('../models/Customer');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create a new customer record
 * @route   POST /api/v1/customers
 * @access  Private
 */
const createCustomer = asyncHandler(async (req, res) => {
  const { customerId, name, email, phone } = req.body;

  if (!customerId || !name) {
    return ApiResponse.error(res, 'customerId and name fields are required.', null, 400);
  }

  const customerExists = await Customer.findOne({ customerId });
  if (customerExists) {
    return ApiResponse.error(res, `Customer with ID ${customerId} already exists.`, null, 400);
  }

  const customer = await Customer.create({
    customerId,
    name,
    email,
    phone,
  });

  return ApiResponse.success(res, 'Customer created successfully.', customer, 201);
});

/**
 * @desc    Bulk insert customer records
 * @route   POST /api/v1/customers/bulk-insert
 * @access  Private
 */
const bulkInsertCustomers = asyncHandler(async (req, res) => {
  const { customers } = req.body;

  if (!customers || !Array.isArray(customers) || customers.length === 0) {
    return ApiResponse.error(res, 'Please provide a non-empty array of customer objects in the customers field.', null, 400);
  }

  const result = await Customer.insertMany(customers, { ordered: false });
  return ApiResponse.success(res, `${result.length} customers inserted successfully.`, result, 201);
});

module.exports = {
  createCustomer,
  bulkInsertCustomers,
};
