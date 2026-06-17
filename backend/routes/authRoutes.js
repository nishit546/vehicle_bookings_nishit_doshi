const express = require('express');
const {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  forgotPassword,
  resetPassword,
  refreshToken,
  deleteAccount,
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { loginLimiter, registerLimiter } = require('../middlewares/rateLimiter');

const optionsHandler = require('../utils/optionsHandler');

const router = express.Router();

router.options('/login', optionsHandler(['POST', 'OPTIONS']));
router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/logout', protect, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', protect, refreshToken);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/me', protect, getProfile);
router.delete('/account', protect, deleteAccount);

module.exports = router;
