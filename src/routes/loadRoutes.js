const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {createLoad, getAllLoads, updateLoad, 
    deleteLoad, getDashboardStats,
     getDriverLoads, updateLoadStatusByDriver, assignLoad, 
     assignDriverToLoad, updateLoadStatus,
     completeLoad} = require('../controllers/loadController');

// auth middleware security check kry ga

router.post('/create-load', auth, createLoad);
router.get('/all', auth, getAllLoads);
router.patch('/assign-driver/:id', auth, assignDriverToLoad);
// router.post('/assign', auth, assignLoad);
router.get('/stats', auth, getDashboardStats);
router.get('/driver/my-load', auth, getDriverLoads);
// router.put('/completed/:id', auth, completeLoad);

// --- 2. Dynamic Routes (Hamesha niche, jin mein :id ho) ---
router.put('/update-status/:id', auth, updateLoadStatus);

// Driver status update karne ke liye
router.put('/driver/update-status/:id', auth, updateLoadStatusByDriver);

// Admin ke liye load update aur delete
router.put('/update/:id', auth, updateLoad);
router.delete('/delete/:id', auth, deleteLoad);

module.exports = router;