const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {updateLocation} = require('../controllers/driverController');

// auth ko route aur controller ke dermiyan rakhein

router.put('/update-location', auth, updateLocation);

module.exports = router;