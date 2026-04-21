const express = require('express');
const router = express.Router();
const truckController = require('../controllers/truckController');
const auth = require('../middleware/authMiddleware'); // Ensure karein ke auth middleware hai

router.post('/add', auth, truckController.addTruck);
router.get('/all', auth, truckController.getTruck);         
router.get('/count', auth, truckController.getTruckCount);         
router.put('/update/:id', auth, truckController.updateTruck); 
router.delete('/delete/:id', auth, truckController.deleteTruck); 

module.exports = router;