const express = require('express');
const { protect } = require('../middlewares/auth');
const { createCustomer, bulkInsertCustomers } = require('../controllers/customerController');

const router = express.Router();

router.use(protect);

router.post('/', createCustomer);
router.post('/bulk-insert', bulkInsertCustomers);

module.exports = router;
