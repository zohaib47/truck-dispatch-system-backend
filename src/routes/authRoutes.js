const express = require('express');
const router = express.Router();
const {register, login} = require('../controllers/authController');

// new user register krny ky lia
router.post('/register', register);

// user login or token hasil krny ky lia
router.post('/login', login);

module.exports = router;