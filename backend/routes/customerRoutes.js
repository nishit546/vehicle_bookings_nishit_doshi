const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  createCustomer,
  bulkInsertCustomers,
  deleteCustomer,
  deleteAllCustomers,
} = require('../controllers/customerController');

const router = express.Router();

router.use(protect);

router.post('/', createCustomer);
router.post('/bulk-insert', bulkInsertCustomers);

router.delete('/delete-all', deleteAllCustomers);
router.delete('/:customerId', deleteCustomer);

module.exports = router;
