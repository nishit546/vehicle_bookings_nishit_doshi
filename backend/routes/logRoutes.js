const express = require('express');
const { protect } = require('../middlewares/auth');
const { deleteLog } = require('../controllers/logController');

const router = express.Router();

router.use(protect);

router.delete('/:id', deleteLog);

module.exports = router;
