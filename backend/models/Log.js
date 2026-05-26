const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    statusCode: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    ip: {
      type: String,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Log', LogSchema);
