const mongoose = require('mongoose')
const Load = require('../models/Load')


// 1. create new load
exports.createLoad = async (req, res)=>{
    // console.log("Incoming Data:", req.body);
    try {
        const {title, pickupLocation, dropLocation, weight, truckType, price}= req.body;

        const newLoad = new Load({
            title,
            pickupLocation,
            dropLocation,
            weight,
            truckType,
            price,
            admin: req.user.id      // ya id humein token (middleware) se milegi
        });
        await newLoad.save();
        res.status(201).json({msg: "Load successfully created", load: newLoad});
    } catch (err) {
        res.status(500).json({msg:"load created failed", error: err.message});
    }
};

// 2. Gett all loads (list show ho sake)
exports.getAllLoads = async (req, res) => {
  try {
    const { status, pickupLocation } = req.query;

    let query = {};
    if (status) query.status = status;
    if (pickupLocation) query.pickupLocation = new RegExp(pickupLocation, 'i');

    const loads = await Load.find(query)
      .populate('admin', 'name fullName email') // 'fullName' add kiya
      .populate({
        path: 'assignedTo',
        select: 'name fullName email phone' // 'fullName' lazmi mangwayein
      })
      .sort({ createdAt: -1 });

    // --- DEBUGGING FOR TERMINAL ---
    // Is console ko terminal mein check karein, agar yahan assignedTo null hai to ID galat hai
    // console.log("Loads with populated drivers:", JSON.stringify(loads, null, 2));

    res.json(loads);

  } catch (err) {
    res.status(500).json({ msg: "Data fetch nahi ho saka", error: err.message });
  }
};


// 3. Assign driver to load
exports.assignLoad = async (req, res) => {
    console.log("Body receive hui:", req.body);
    try {
        // Frontend (AssignLoad.jsx) se aane wala data
        const { 
            driverId, 
            title, 
            pickupLocation, 
            dropLocation, 
            weight, 
            material, 
            fare, 
            deadline, 
            instructions 
        } = req.body;

        // 1. Naya Load create karein (findByIdAndUpdate ki jagah new Load use karein)
        const newLoad = new Load({
            title,
            pickupLocation,
            dropLocation,
            weight,
            material,
            fare,
            deadline,
            instructions,
            assignedTo: new mongoose.Types.ObjectId(driverId), // Driver ki ID
            admin: req.user.id,   // Admin ki ID (from middleware)
            status: 'pending'     // Shuru mein status pending rakhein
        });

        // 2. Database mein save karein
        console.log("SAVE KARNE SE PEHLE ID:", driverId);
        await newLoad.save();

        // 3. Wapsi pe data populate karein taake frontend ko driver ka poora naam mile
        const populatedLoad = await Load.findById(newLoad._id)
            .populate('assignedTo', 'fullName name phone')
            .populate('admin', 'fullName name');
            console.log("POPULATED DATA:", populatedLoad);

        res.status(201).json({ 
            msg: "Load created and assigned successfully", 
            load: populatedLoad 
        });

    } catch (err) {
        console.error("Error in assignLoad:", err.message);
        res.status(500).json({ 
            msg: "Server error: Load assign nahi ho saka", 
            error: err.message 
        });
    }
};

// 4. update load 

exports.updateLoad = async (req, res)=>{
    try {
        const { id } = req.params;    //url sy id lana
        const updateData = req.body;

        const load = await Load.findByIdAndUpdate(id, updateData, {new: true});

        if(!load){
            return res.status(404).json({msg: "Load nhi mila.."})
        }

        res.json({msg: " Load update ho gya", load})
    } catch (err) {
        res.status(500).json({ msg: "Update fail ho gaya", error: err.message });
    }
};

// 5. DELETE LOAD
exports.deleteLoad = async (req, res) => {
    try {
        const { id } = req.params;
        const load = await Load.findByIdAndDelete(id);

        if (!load) {
            return res.status(404).json({ msg: "Load pehly hi delete ho chuka ha ya nahi mila" });
        }

        res.json({ msg: "Load successfully delete kar dia gaya" });
    } catch (err) {
        res.status(500).json({ msg: "Load Delete karne mein masla aya", error: err.message  });
    }
};

// 6. dashboard view admin
exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await Load.aggregate([
            {
                $group: {
                    _id: "$status", // Status (pending, assigned, delivered) ke groups banao
                    totalLoads: { $sum: 1 }, // Har status mein kitne loads hain
                    totalRevenue: { $sum: "$price" } // Unka total paisa kitna hai
                }
            }
        ]);

        res.json({
            msg: "Dashboard statistics fetched",
            stats
        });
    } catch (err) {
        res.status(500).json({ msg: "Stats calculate karne mein masla aya", error: err.message });
    }
};

// Driver ko sirf uske apne assigned loads dikhane ke liye
exports.getDriverLoads = async (req, res) => {
    try {
        // req.user.id humein auth middleware se milti hai (Token ke zariye)
        const driverId = req.user.id;

        // Database mein wo loads dhoondo jahan assignedTo field driver ki ID ke barabar ho
        // .populate admin ki details bhi le ayega
        const myLoads = await Load.find({ assignedTo: driverId }).populate('admin', 'name email');

        res.json({
            msg: "Driver's assigned loads fetched successfully",
            total: myLoads.length,
            loads: myLoads
        });
    } catch (err) {
        res.status(500).json({ 
            msg: "Loads fetch karne mein masla aya", 
            error: err.message 
        });
    }
};

// Driver status update karne ke liye (Pickup/Delivered)
exports.updateLoadStatusByDriver = async (req, res) => {
    try {
        const { id } = req.params; // Load ID
        const { status } = req.body; // Naya status (e.g., 'picked-up' ya 'delivered')

        // Sirf wahi load dhoondo jo is driver ko assign hua hai
        const load = await Load.findOne({ _id: id, assignedTo: req.user.id });

        if (!load) {
            return res.status(404).json({ msg: "Load nahi mila ya aapko assign nahi hua!" });
        }

        // Status update karo
        load.status = status;
        await load.save();

        res.json({ msg: `Load status updated to ${status}`, load });
    } catch (err) {
        res.status(500).json({ msg: "Status update fail ho gaya", error: err.message });
    }
};

