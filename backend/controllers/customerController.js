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

/**
 * @desc    Delete a customer record (soft delete)
 * @route   DELETE /api/v1/customers/:customerId
 * @access  Private
 */
const deleteCustomer = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  const customer = await Customer.findOne({ customerId, isDeleted: false });
  if (!customer) {
    return ApiResponse.error(res, `Customer with ID ${customerId} not found.`, null, 404);
  }

  customer.isDeleted = true;
  await customer.save();

  return ApiResponse.success(res, `Customer ${customerId} deleted successfully.`, null, 200);
});

/**
 * @desc    Delete all customer records (hard delete)
 * @route   DELETE /api/v1/customers/delete-all
 * @access  Private
 */
const deleteAllCustomers = asyncHandler(async (req, res) => {
  const result = await Customer.deleteMany({});
  return ApiResponse.success(res, `All customers deleted successfully. Count: ${result.deletedCount}`, null, 200);
});

module.exports = {
  createCustomer,
  bulkInsertCustomers,
  deleteCustomer,
  deleteAllCustomers,
};
