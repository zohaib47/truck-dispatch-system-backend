const mongoose = require('mongoose');
const Load = require('../models/Load');

// 1. Create New Load (Sirf data save hoga, driver assign nahi hoga)
exports.createLoad = async (req, res) => {
    console.log("1. Request Body:", req.body); // Check karein data aa raha hai
    console.log("2. User from Token:", req.user);
    try {
        const { title, pickupLocation, dropLocation, weight, truckType, price } = req.body;

        const newLoad = new Load({
            title,
            pickupLocation,
            dropLocation,
            weight,
            truckType,
            price,
            status: 'pending', // Default status
            admin: req.user.id  // Middleware se aane wali Admin ID
        });

        await newLoad.save();
        res.status(201).json({ msg: "Load successfully created", load: newLoad });
    } catch (err) {
        res.status(500).json({ msg: "Load creation failed", error: err.message });
    }
};

// 2. Get All Loads (With Filters)
exports.getAllLoads = async (req, res) => {
    try {
        const { status, pickupLocation } = req.query;

        let query = {};
        if (status) query.status = status;
        if (pickupLocation) query.pickupLocation = new RegExp(pickupLocation, 'i');

        const loads = await Load.find(query)
            .populate('admin', 'fullName name email')
            .populate('assignedTo', 'fullName name email phone')
            .sort({ createdAt: -1 });

        res.json(loads);
    } catch (err) {
        res.status(500).json({ msg: "Data fetch nahi ho saka", error: err.message });
    }
};

// 3. Assign Driver to Existing Load (Yeh Assign Page ke liye hai)
exports.assignDriverToLoad = async (req, res) => {
    try {
        const { id } = req.params; // Load ID from URL
        const { driverId } = req.body; // Selected Driver ID from Body

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(driverId)) {
            return res.status(400).json({ msg: "Invalid Load or Driver ID" });
        }

        const load = await Load.findByIdAndUpdate(
            id,
            { 
                assignedTo: driverId, 
                status: 'assigned' 
            },
            { new: true }
        ).populate('assignedTo', 'fullName name phone');

        if (!load) {
            return res.status(404).json({ msg: "Load nahi mila!" });
        }

        res.json({ msg: "Driver successfully assigned", load });
    } catch (err) {
        res.status(500).json({ msg: "Assignment failed", error: err.message });
    }
};

// updateLoad controller
exports.updateLoad = async (req, res) => {
    try {
        const { id } = req.params;
        
        const load = await Load.findByIdAndUpdate(
            id, 
            { $set: req.body }, 
            { new: true, runValidators: true } 
        );

        if (!load) {
            return res.status(404).json({ msg: "Load record not found!" });
        }

        res.json({ 
            msg: "Updated successfully", 
            load 
        });
    } catch (err) {
        res.status(500).json({ 
            msg: "Update failed", 
            error: err.message 
        });
    }
};

// 5. Delete Load
exports.deleteLoad = async (req, res) => {
    try {
        const load = await Load.findByIdAndDelete(req.params.id);
        if (!load) return res.status(404).json({ msg: "Load already deleted or not found" });
        res.json({ msg: "Load successfully deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Delete failed", error: err.message });
    }
};

// 6. Admin Dashboard Stats
exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await Load.aggregate([
            {
                $group: {
                    _id: "$status",
                    totalLoads: { $sum: 1 },
                    totalRevenue: { $sum: { $ifNull: ["$price", 0] } }
                }
            }
        ]);
        res.json({ msg: "Stats fetched", stats });
    } catch (err) {
        res.status(500).json({ msg: "Stats calculation error", error: err.message });
    }
};

// 7. Driver: Get My Assigned Loads
exports.getDriverLoads = async (req, res) => {
    try {
        const driverId = req.user.id;
        const myLoads = await Load.find({ assignedTo: driverId })
            .populate('admin', 'fullName name email')
            .sort({ createdAt: -1 });

        const stats = {
            total: myLoads.length,
            completed: myLoads.filter(l => l.status === 'delivered').length,
            active: myLoads.filter(l => l.status !== 'delivered').length
        };

        res.json({ msg: "Driver data fetched", stats, loads: myLoads });
    } catch (err) {
        res.status(500).json({ msg: "Fetch error", error: err.message });
    }
};

// 8. Driver: Update Trip Status
exports.updateLoadStatusByDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const load = await Load.findById(id);
        if (!load) return res.status(404).json({ msg: "Load not found" });

        // Authorization check
        if (load.assignedTo.toString() !== req.user.id.toString()) {
            return res.status(403).json({ msg: "Unauthorized action" });
        }

        load.status = status;
        await load.save();
        res.json({ msg: `Status updated to ${status}`, load });
    } catch (err) {
        res.status(500).json({ msg: "Internal server error", error: err.message });
    }
};


exports.updateLoadStatus = async (req, res) => {
    try {
        // Hum body se status lenge (e.g., 'picked-up' ya 'delivered')
        const { status } = req.body; 
        
        const updatedLoad = await Load.findByIdAndUpdate(
            req.params.id, // URL se ID uthayega
            { status: status },
            { new: true }
        );

        if (!updatedLoad) {
            return res.status(404).json({ success: false, message: "Load record nahi mila" });
        }

        res.json({ success: true, load: updatedLoad });
    } catch (err) {
        console.error("Load Update Error:", err);
        res.status(500).json({ success: false, message: "Update failed", error: err.message });
    }
};