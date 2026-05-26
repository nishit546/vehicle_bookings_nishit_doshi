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

module.exports = {
  createPayment,
};
