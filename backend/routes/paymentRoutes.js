const express = require('express');
const { protect } = require('../middlewares/auth');
const { createPayment, deletePayment } = require('../controllers/paymentController');

const router = express.Router();

router.use(protect);

router.post('/', createPayment);
router.delete('/:paymentId', deletePayment);

module.exports = router;
