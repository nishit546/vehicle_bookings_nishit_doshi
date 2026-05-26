const express = require('express');
const { protect } = require('../middlewares/auth');
const { createVehicle } = require('../controllers/vehicleController');

const router = express.Router();

router.use(protect);

router.post('/', createVehicle);

module.exports = router;
