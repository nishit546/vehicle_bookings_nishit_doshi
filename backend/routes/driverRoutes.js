const express = require('express');
const { protect } = require('../middlewares/auth');
const { createDriver, bulkInsertDrivers } = require('../controllers/driverController');

const router = express.Router();

router.use(protect);

router.post('/', createDriver);
router.post('/bulk-insert', bulkInsertDrivers);

module.exports = router;
