const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

/**
 * Middleware to protect routes and verify JWT tokens
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return ApiResponse.error(res, 'Not authorized to access this route. Please provide a token.', null, 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the database (excluding password field)
    const user = await User.findById(decoded.id);

    if (!user || user.isDeleted) {
      return ApiResponse.error(res, 'User account is invalid or has been deactivated.', null, 401);
    }

    // Attach user payload to the request
    req.user = user;
    next();
  } catch (error) {
    return ApiResponse.error(res, 'Authentication token validation failed.', error, 401);
  }
};

/**
 * Middleware to restrict access to specific user roles
 * @param {...string} roles - Permitted roles (e.g. 'admin', 'user')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.error(res, 'User context not found.', null, 500);
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        `Role '${req.user.role}' is not authorized to access this resource.`,
        null,
        403
      );
    }

    next();
  };
};

module.exports = { protect, authorize };
