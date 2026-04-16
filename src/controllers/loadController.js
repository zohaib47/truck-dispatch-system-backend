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
exports.getAllLoads = async (req, res)=>{
    try {

        // 1. URL se queries uthana (e.g., ?status=pending)
        const { status, pickupLocation, truckType } = req.query;

        // 2. Search criteria taiyar karna
        let query = {};

        // Agar user ne status bheja hai, to sirf wahi loads dikhao
        if (status) {
            query.status = status;
        }

        // Agar pickup location bheji hai, to usey search karo (Case-insensitive)
        if (pickupLocation) {
            query.pickupLocation = new RegExp(pickupLocation, 'i');
        }

        const loads = await Load.find(query).populate('admin', 'name email');
        res.json(loads);
        
    } catch (err) {
        res.status(500).json({
        msg: "Data fetch nhi ho saka hyy", error: err.message  });
    }
};

// 3. Assign driver to load

exports.assignDriver = async (req, res)=>{
    try {
        const {loadId, driverId}= req.body;
        const load = await Load.findByIdAndUpdate(
            loadId,
            {assignedTo: driverId, status: 'assigned'},
            {new: true}
        );
        res.json({msg: "Driver assign successfully", load});
    } catch (err) {
        res.status(500).send("driver assign failed...")
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

// Admin driver ko load assign karega

exports.assignDriver = async (req, res) => {
    try {
        const { loadId, driverId } = req.body;

        // Load ko dhoondo aur usmein driver ki ID aur status update karo
        const load = await Load.findByIdAndUpdate(
            loadId,
            { assignedTo: driverId, status: 'assigned' },
            { new: true }
        ).populate('assignedTo', 'name email');

        if (!load) {
            return res.status(404).json({ msg: "Load nahi mila!" });
        }

        res.json({ msg: "Driver assigned successfully", load });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};