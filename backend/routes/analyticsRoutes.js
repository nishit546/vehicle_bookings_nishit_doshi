const express = require('express');
const {
  getRevenueStats,
  getStatusDistribution,
  getLocationDemand,
  getRatingsSummary,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Protect and authorize only admin users to access analytics
router.use(protect);
router.use(authorize('admin'));

router.get('/revenue', getRevenueStats);
router.get('/status-distribution', getStatusDistribution);
router.get('/location-demand', getLocationDemand);
router.get('/ratings-summary', getRatingsSummary);

module.exports = router;
