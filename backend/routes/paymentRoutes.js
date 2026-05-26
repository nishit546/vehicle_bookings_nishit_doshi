const express = require('express');
const { protect } = require('../middlewares/auth');
const { createPayment } = require('../controllers/paymentController');

const router = express.Router();

router.use(protect);

router.post('/', createPayment);

module.exports = router;
