const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');
const Contact = require('../models/Contact'); 
const auth = require('../middleware/authMiddleware'); 

router.post('/submit', submitContact);

router.get('/all', auth, async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/delete/:id', auth, async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;