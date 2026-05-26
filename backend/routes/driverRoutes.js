const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  createDriver,
  bulkInsertDrivers,
  deleteDriver,
  deleteAllDrivers,
} = require('../controllers/driverController');

const router = express.Router();

router.use(protect);

router.post('/', createDriver);
router.post('/bulk-insert', bulkInsertDrivers);

router.delete('/delete-all', deleteAllDrivers);
router.delete('/:driverId', deleteDriver);

module.exports = router;
