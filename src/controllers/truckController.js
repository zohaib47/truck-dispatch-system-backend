const Truck = require('../models/Truck');

// 1. CREATE: Naya truck add karna
exports.addTruck = async (req, res) => {
    try {
        const { truckName, plateNumber, truckType, capacityValue, ownerName } = req.body;

        const existingTruck = await Truck.findOne({ plateNumber });
        if (existingTruck) {
            return res.status(400).json({ msg: "Gari ka plate number pehle se register hai!" });
        }

        const newTruck = new Truck({
            truckName,
            plateNumber,
            truckType,
            capacity: { value: capacityValue },
            ownerName,
            admin: req.user.id
        });

        await newTruck.save();
        res.status(201).json({ msg: "Truck successfully register ho gaya", truck: newTruck });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// 1. GET ALL TRUCKS (Inventory Table ke liye)
exports.getTruck = async (req, res) => {
    try {
        // .find() saare trucks ki array laayega
        const trucks = await Truck.find()
            .populate('admin', 'name email') // Kis admin ne add kiya
            .sort({ createdAt: -1 }); // Newest trucks top par honge

        res.status(200).json(trucks); // Ye frontend ko Array [] bhejega
    } catch (err) {
        res.status(500).json({ msg: "Trucks fetch nahi ho sakay", error: err.message });
    }
};

// 2. GET TRUCK COUNT (Dashboard Stats ke liye)
exports.getTruckCount = async (req, res) => {
    try {
        const count = await Truck.countDocuments();
        res.status(200).json({ count }); // Ye sirf ek number bhejega
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. UPDATE: Truck ki details tabdeel karna
exports.updateTruck = async (req, res) => {
    try {
        const { truckName, truckType, capacityValue, ownerName, status } = req.body;
        
        let truck = await Truck.findById(req.params.id);
        if (!truck) return res.status(404).json({ msg: "Truck nahi mila" });

        // Naya data update karna
        truck.truckName = truckName || truck.truckName;
        truck.truckType = truckType || truck.truckType;
        if (capacityValue) truck.capacity.value = capacityValue;
        truck.ownerName = ownerName || truck.ownerName;
        truck.status = status || truck.status;

        await truck.save();
        res.json({ msg: "Truck update ho gaya", truck });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. DELETE: Truck khatam karna
exports.deleteTruck = async (req, res) => {
    try {
        const truck = await Truck.findById(req.params.id);
        if (!truck) return res.status(404).json({ msg: "Truck nahi mila" });

        await Truck.findByIdAndDelete(req.params.id);
        res.json({ msg: "Truck delete kar diya gaya" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};