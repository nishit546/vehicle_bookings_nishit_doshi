const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: [true, 'Vehicle ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    vehicleType: {
      type: String,
      required: [true, 'Vehicle Type is required'],
      trim: true,
    },
    vehicleNumber: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Vehicle', VehicleSchema);
