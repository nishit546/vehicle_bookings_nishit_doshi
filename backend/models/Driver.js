const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema(
  {
    driverId: {
      type: String,
      required: [true, 'Driver ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Driver Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model('Driver', DriverSchema);
