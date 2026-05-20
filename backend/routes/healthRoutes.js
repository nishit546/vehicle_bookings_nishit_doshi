const express = require('express');
const router = express.Router();
const ApiResponse = require('../utils/apiResponse');

/**
 * @desc    System health check endpoint
 * @route   GET /api/v1/health
 * @access  Public
 */
router.get('/', (req, res) => {
  return ApiResponse.success(
    res,
    'Server is healthy and running.',
    {
      uptime: Math.round(process.uptime()),
      timestamp: new Date(),
      env: process.env.NODE_ENV || 'development',
    },
    200
  );
});

module.exports = router;
