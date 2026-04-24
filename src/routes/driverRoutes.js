const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/authMiddleware');
const {
  getAllDrivers,
  addDriver,
  getDriverCount,
  updateDriver,
  updateLocation,
  deleteDriver,
  updateDriverStatus,
} = require('../controllers/driverController');

router.get('/',               getAllDrivers);           // saare drivers
router.post('/',       auth,  addDriver);               // naya driver add
router.get('/count',          getDriverCount);    
router.put('/update-status', auth, updateDriverStatus); 
router.put('/update-location', auth, updateLocation);  // live location

router.put('/:id',     auth, updateDriver);
router.delete('/:id',  auth,  deleteDriver);           // driver delete

module.exports = router;