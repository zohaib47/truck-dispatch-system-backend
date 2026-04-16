const User = require('../models/User') 
const bcrypt = require('bcryptjs')
const Jwt = require('jsonwebtoken')

// 1.register user
exports.register = async (req, res) =>{
    try{
        const {name, email, password, role} = req.body;
        // check if user already exists
        let user = await User.findOne({email});
        if (user) return res.status(400).json({msg:"User already exist"});

        // password hash krna
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({name, email, password: hashedPassword, role});
        await user.save();

        res.status(201).json({msg: "Registration kamyab hui"});
    } catch(err){
        res.status(500).send("Server Error")
    }
};

// 2. Login User
exports.login =async(req, res)=>{

    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({msg:"ghalt email or password"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({msg:" wrong password ha"});

        // JWT token dena (token valid rahy 1 din tak)
        const token =Jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: "1d"});

        res.json({token, user: {id: user._id, name: user.name, role:user.role}});
         
        
    } catch (error) {
        res.status(500).send(`server error ${error}`)
        
    }
}