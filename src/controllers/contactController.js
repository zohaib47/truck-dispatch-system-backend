// const Contact = require('../models/Contact');
// const submitContact = async (req, res) => {
//     try {
//         const { firstName, lastName, email, phone, companyName, vehicleCount, message } = req.body;
        
//         const newContact = new Contact({
//             firstName, lastName, email, phone, companyName, vehicleCount, message
//         });

//         await newContact.save();
//         res.status(201).json({ success: true, message: "Inquiry sent successfully!" });

//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// module.exports = { submitContact };


const Contact = require('../models/Contact');

const submitContact = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, companyName, vehicleCount, message } = req.body;
        
        const newContact = new Contact({
            firstName, 
            lastName, 
            email, 
            phone, 
            companyName, 
            vehicleCount, 
            message
        });

        await newContact.save();

        // --- AUTO-REPLY LOGIC ---
        // If you want to send a real SMS, you'd use Twilio here.
        // For now, let's log that the auto-reply is triggered.
        console.log(`Auto-reply sent to ${phone}: Hello ${firstName}, we have received your inquiry!`);

        res.status(201).json({ 
            success: true, 
            message: "Inquiry sent successfully! Our team will contact you soon." 
        });

    } catch (error) {
        console.error("Submission Error:", error);
        res.status(500).json({ success: false, message: "System error, please try again later." });
    }
};

module.exports = { submitContact };