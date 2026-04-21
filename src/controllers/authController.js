const Admin = require('../models/Admin');
const User = require('../models/User') ;
const Driver = require('../models/Driver')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// 1.register user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;  // ← role hata diya

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Yeh email already registered hai" });

    // Password hash
    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // User save
    user = new User({ name, email, password: hashedPassword });  // ← role hata diya
    await user.save();

    // Token banao — login jaisa
    const token = jwt.sign(
      { id: user._id },                // ← role nahi
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Registration kamyab hui",
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        // role nahi
      }
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Login User

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        let foundUser = null;
        let userRole = '';

        // 1. Admin Check (Sab se pehle)
        foundUser = await Admin.findOne({ email });
        if (foundUser) {
            userRole = 'admin';
        } 

        // 2. Agar Admin nahi mila to Driver Check
        if (!foundUser) {
            foundUser = await Driver.findOne({ email });
            if (foundUser) {
                userRole = 'driver';
            }
        }

        // 3. Agar Admin/Driver nahi mila to Normal User Check
        // Yahan hum role check nahi karenge kyunke field nahi hai
        if (!foundUser) {
            foundUser = await User.findOne({ email });
            if (foundUser) {
                userRole = 'user'; // Hum manually 'user' role de rahay hain
            }
        }

        // 4. Error: Agar teeno collections mein email nahi mili
        if (!foundUser) {
            return res.status(404).json({ 
                success: false, 
                message: "You are not registered! Please create an account." 
            });
        }

        // 5. Password Match
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid password! Please try again." 
            });
        }

        // 6. Token Generation
        const token = jwt.sign(
            { id: foundUser._id, role: userRole },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 7. Final Response
        res.status(200).json({
            success: true,
            token,
            user: {
                id: foundUser._id,
                name: foundUser.name || foundUser.username,
                email: foundUser.email,
                role: userRole // Frontend ko yahan se 'user' mil jaye ga
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Server error occurred." });
    }
};