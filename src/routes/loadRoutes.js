const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {createLoad, getAllLoads, updateLoad, 
    deleteLoad, getDashboardStats,
     getDriverLoads, updateLoadStatusByDriver, assignLoad } = require('../controllers/loadController');

// auth middleware security check kry ga

router.post('/create-load', auth, createLoad);
router.get('/all', auth, getAllLoads);
router.post('/assign', auth, assignLoad);
router.get('/stats', auth, getDashboardStats);
router.get('/my-load', auth, getDriverLoads);

// --- 2. Dynamic Routes (Hamesha niche, jin mein :id ho) ---

// Driver status update karne ke liye
router.put('/update-status/:id', auth, updateLoadStatusByDriver);

// Admin ke liye load update aur delete
router.put('/update/:id', auth, updateLoad);
router.delete('/delete/:id', auth, deleteLoad);

module.exports = router;