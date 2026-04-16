const Driver = require('../models/Driver');

// driver ki location update krna (map ky lia)
exports.updateLocation = async (req, res) =>{
    try {
        const {lat, lng} = req.body;
        const driver = await Driver.findOneAndUpdate(
            {user: req.user.id},   // token sy user id milygi
            {
                "currentLocation.lat": lat,
                "currentLocation.lng": lng,
                "currentLocation.lastUpdated": Date.now()
            },
            {new: true}
        );
        res.json({msg: "Location update on map", location: driver.currentLocation });
    } catch (error) {
        console.error(error);
        res.status(500).send("Location update failed..")
    }
}