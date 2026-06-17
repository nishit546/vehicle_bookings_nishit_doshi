const crypto = require('crypto');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const { generateToken } = require('../utils/auth');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, customerId } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return ApiResponse.error(res, 'A user with this email address already exists.', null, 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    customerId: customerId || null,
  });

  const token = generateToken(user._id);

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

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return ApiResponse.error(res, 'Please provide both email and password.', null, 400);
  }

  const user = await User.findOne({ email, isDeleted: false }).select('+password');
  if (!user) {
    return ApiResponse.error(res, 'Invalid credentials. User not found.', null, 401);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return ApiResponse.error(res, 'Invalid credentials. Incorrect password.', null, 401);
  }

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

const updateProfile = asyncHandler(async (req, res) => {
  if (!req.user) return ApiResponse.error(res, 'User context not found.', null, 404);
  const { name, email, customerId } = req.body;
  if (name !== undefined) req.user.name = name;
  if (email !== undefined) req.user.email = email;
  if (customerId !== undefined) req.user.customerId = customerId;
  await req.user.save();
  return ApiResponse.success(res, 'Profile updated successfully.', {
    id: req.user._id, name: req.user.name, email: req.user.email,
    role: req.user.role, customerId: req.user.customerId,
    createdAt: req.user.createdAt, updatedAt: req.user.updatedAt,
  }, 200);
});

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

const logout = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, 'Logged out successfully. Please destroy the authentication token on the client side.', null, 200);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return ApiResponse.error(res, 'Please provide an email address.', null, 400);
  }

  const user = await User.findOne({ email, isDeleted: false });
  if (!user) {
    return ApiResponse.error(res, 'No account found with this email address.', null, 404);
  }

  const resetToken = crypto.randomBytes(20).toString('hex');

  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  return ApiResponse.success(
    res,
    'Password reset token generated successfully.',
    { resetToken },
    200
  );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return ApiResponse.error(res, 'Please provide both the reset token and a new password.', null, 400);
  }

  if (password.length < 6) {
    return ApiResponse.error(res, 'Password must be at least 6 characters long.', null, 400);
  }

  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
    isDeleted: false,
  });

  if (!user) {
    return ApiResponse.error(res, 'Invalid or expired password reset token.', null, 400);
  }

  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  await user.save();

  return ApiResponse.success(res, 'Password updated successfully.', null, 200);
});

const refreshToken = asyncHandler(async (req, res) => {
  if (!req.user) {
    return ApiResponse.error(res, 'User context not found.', null, 401);
  }

  const token = generateToken(req.user._id);

  return ApiResponse.success(
    res,
    'Authentication token refreshed successfully.',
    { token },
    200
  );
});

const deleteAccount = asyncHandler(async (req, res) => {
  if (!req.user) {
    return ApiResponse.error(res, 'User context not found.', null, 401);
  }

  const user = await User.findById(req.user._id);
  if (!user || user.isDeleted) {
    return ApiResponse.error(res, 'User account not found or already deleted.', null, 404);
  }

  user.isDeleted = true;
  await user.save();

  return ApiResponse.success(res, 'User account deleted successfully.', null, 200);
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  forgotPassword,
  resetPassword,
  refreshToken,
  deleteAccount,
};
