const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: [true, 'Payment ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    bookingId: {
      type: String,
      required: [true, 'Booking ID is required'],
      trim: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payment Amount is required'],
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment Method is required'],
      trim: true,
    },
    status: {
      type: String,
      default: 'Pending',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Payment', PaymentSchema);
