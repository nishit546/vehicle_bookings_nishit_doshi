const express = require('express');
const { protect } = require('../middlewares/auth');
const { createLocation } = require('../controllers/locationController');

const router = express.Router();

router.use(protect);

router.post('/', createLocation);

module.exports = router;
