const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema(
  {
    ratingId: {
      type: String,
      required: [true, 'Rating ID is required'],
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
    driverRating: {
      type: Number,
      required: [true, 'Driver Rating is required'],
    },
    customerRating: {
      type: Number,
      required: [true, 'Customer Rating is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Rating', RatingSchema);
