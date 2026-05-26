const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema(
  {
    locationId: {
      type: String,
      required: [true, 'Location ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Location Name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['pickup', 'drop', 'both'],
      default: 'both',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Location', LocationSchema);
