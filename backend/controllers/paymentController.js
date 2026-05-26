const Payment = require('../models/Payment');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create a new payment record
 * @route   POST /api/v1/payments
 * @access  Private
 */
const createPayment = asyncHandler(async (req, res) => {
  const { paymentId, bookingId, amount, paymentMethod, status } = req.body;

  if (!paymentId || !bookingId || !amount || !paymentMethod) {
    return ApiResponse.error(res, 'paymentId, bookingId, amount and paymentMethod fields are required.', null, 400);
  }

  const paymentExists = await Payment.findOne({ paymentId });
  if (paymentExists) {
    return ApiResponse.error(res, `Payment with ID ${paymentId} already exists.`, null, 400);
  }

  const payment = await Payment.create({
    paymentId,
    bookingId,
    amount: Number(amount),
    paymentMethod,
    status: status || 'Pending',
  });

  return ApiResponse.success(res, 'Payment created successfully.', payment, 201);
});

/**
 * @desc    Delete a payment record (hard delete)
 * @route   DELETE /api/v1/payments/:paymentId
 * @access  Private
 */
const deletePayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  const payment = await Payment.findOneAndDelete({ paymentId });
  if (!payment) {
    return ApiResponse.error(res, `Payment with ID ${paymentId} not found.`, null, 404);
  }

  return ApiResponse.success(res, `Payment ${paymentId} deleted successfully.`, null, 200);
});

module.exports = {
  createPayment,
  deletePayment,
};
