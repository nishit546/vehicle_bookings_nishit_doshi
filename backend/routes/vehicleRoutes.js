const express = require('express');
const { protect } = require('../middlewares/auth');
const { createVehicle, deleteVehicle } = require('../controllers/vehicleController');

const router = express.Router();

router.use(protect);

router.post('/', createVehicle);
router.delete('/:vehicleId', deleteVehicle);

module.exports = router;
