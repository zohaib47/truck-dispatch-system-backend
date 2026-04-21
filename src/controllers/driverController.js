const Driver = require('../models/Driver');

// ─────────────────────────────────────────
// GET — Saare drivers lao
// ─────────────────────────────────────────
exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────
// POST — Naya driver add karo
// ─────────────────────────────────────────
exports.addDriver = async (req, res) => {
  try {
    const { fullName, phone, cnicNumber, experience, vehicleType } = req.body;  

    const driver = new Driver({
      fullName,       
      phone,
      cnicNumber,     
      experience,
      vehicleType,    
      role:   'Driver',
      status: 'Available',
    });

    const saved = await driver.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: ' CNIC already registered ' });
    }
    res.status(400).json({ message: 'Driver add not successful' });
  }
};

// ─────────────────────────────────────────
// GET — Driver count (landing page stats)
// ─────────────────────────────────────────
exports.getDriverCount = async (req, res) => {
  try {
    const count = await Driver.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
// PUT — Driver update karo
exports.updateDriver = async (req, res) => {
  try {
    const { fullName, phone, cnicNumber, experience, vehicleType } = req.body;
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { fullName, phone, cnicNumber, experience, vehicleType },
      { new: true }
    );
    if (!driver) return res.status(404).json({ message: 'Driver nahi mila' });
    res.json(driver);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Yeh CNIC already registered hai' });
    }
    res.status(400).json({ message: 'Update karne mein masla hua' });
  }
};

// DELETE — Driver remove karo
// ─────────────────────────────────────────
exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: 'Driver nahi mila' });
    }

    res.json({ message: 'Driver successfully remove ho gaya' });
  } catch (err) {
    res.status(500).json({ message: 'Driver delete karne mein masla hua' });
  }
};

// ─────────────────────────────────────────
// PUT — Driver ki live location update karo
// ─────────────────────────────────────────
exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const driver = await Driver.findOneAndUpdate(
      { user: req.user.id },
      {
        "currentLocation.lat":         lat,
        "currentLocation.lng":         lng,
        "currentLocation.lastUpdated": Date.now(),
      },
      { new: true }
    );
    res.json({ msg: "Location updated on map", location: driver.currentLocation });
  } catch (error) {
    console.error(error);
    res.status(500).send("Location update failed..");
  }
};
