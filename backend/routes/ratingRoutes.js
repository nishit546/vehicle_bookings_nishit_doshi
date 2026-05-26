const express = require('express');
const { protect } = require('../middlewares/auth');
const { createRating } = require('../controllers/ratingController');

const router = express.Router();

router.use(protect);

router.post('/', createRating);

module.exports = router;
