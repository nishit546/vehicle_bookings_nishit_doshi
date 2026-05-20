const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: [true, 'Booking ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Booking Date is required'],
      index: true,
    },
    time: {
      type: String,
      required: [true, 'Booking Time is required'],
    },
    bookingStatus: {
      type: String,
      required: [true, 'Booking Status is required'],
      index: true,
    },
    customerId: {
      type: String,
      required: [true, 'Customer ID is required'],
      index: true,
    },
    vehicleType: {
      type: String,
      required: [true, 'Vehicle Type is required'],
      index: true,
    },
    pickupLocation: {
      type: String,
      required: [true, 'Pickup Location is required'],
    },
    dropLocation: {
      type: String,
      required: [true, 'Drop Location is required'],
    },
    vTat: {
      type: Number,
      default: null,
    },
    cTat: {
      type: Number,
      default: null,
    },
    canceledRidesByCustomer: {
      type: String,
      default: null,
    },
    canceledRidesByDriver: {
      type: String,
      default: null,
    },
    incompleteRides: {
      type: String,
      default: null,
    },
    incompleteRidesReason: {
      type: String,
      default: null,
    },
    bookingValue: {
      type: Number,
      required: [true, 'Booking Value is required'],
    },
    paymentMethod: {
      type: String,
      default: null,
    },
    rideDistance: {
      type: Number,
      required: [true, 'Ride Distance is required'],
    },
    driverRating: {
      type: Number,
      default: null,
    },
    customerRating: {
      type: Number,
      default: null,
    },
    vehicleImage: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for optimizing search / filter / pagination
BookingSchema.index({ date: -1, bookingStatus: 1 });

module.exports = mongoose.model('Booking', BookingSchema);
