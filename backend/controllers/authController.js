const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const { generateToken } = require('../utils/auth');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, customerId } = req.body;

  // Check if email already registered
  const userExists = await User.findOne({ email });
  if (userExists) {
    return ApiResponse.error(res, 'A user with this email address already exists.', null, 400);
  }

  // Create new user (password is automatically hashed in Mongoose pre-save)
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    customerId: customerId || null,
  });

  // Generate JWT token
  const token = generateToken(user._id);

  // Return success response with token
  return ApiResponse.success(
    res,
    'User account created successfully.',
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        customerId: user.customerId,
      },
      token,
    },
    201
  );
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate fields
  if (!email || !password) {
    return ApiResponse.error(res, 'Please provide both email and password.', null, 400);
  }

  // Find user and explicitly select password field
  const user = await User.findOne({ email, isDeleted: false }).select('+password');
  if (!user) {
    return ApiResponse.error(res, 'Invalid credentials. User not found.', null, 401);
  }

  // Verify password using the instance method
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return ApiResponse.error(res, 'Invalid credentials. Incorrect password.', null, 401);
  }

  // Generate JWT token
  const token = generateToken(user._id);

  return ApiResponse.success(
    res,
    'Authentication successful.',
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        customerId: user.customerId,
      },
      token,
    },
    200
  );
});

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/profile
 * @access  Private (Protected)
 */
const getProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    return ApiResponse.error(res, 'User context not found.', null, 404);
  }

  const profile = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    customerId: req.user.customerId,
    createdAt: req.user.createdAt,
    updatedAt: req.user.updatedAt,
  };

  return ApiResponse.success(res, 'User profile retrieved successfully.', profile, 200);
});

module.exports = {
  register,
  login,
  getProfile,
};
