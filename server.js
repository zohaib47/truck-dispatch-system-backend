const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db') ;
const authRoutes = require('./src/routes/authRoutes');
const driverRoutes = require('./src/routes/driverRoutes');
const loadRoutes = require('./src/routes/loadRoutes');
const contactRoutes = require('./src/routes/contactRoutes');
const truckRoutes = require('./src/routes/truckRoutes')


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = express();


connectDB(); 


app.use(cors({
  origin: "https://truck-dispatch-system-frontend.vercel.app", 
  methods: ["GET", "POST", "PUT", "PATCH" ,"DELETE"],
  credentials: true
}));
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/driver' , driverRoutes);
app.use('/api/load', loadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/truck', truckRoutes)

// Basic Route
app.get('/' , (req, res)=>{
    res.send('Truck Dispatching system API is running mode..')
});

// const PORT = process.env.PORT || 5000;

// app.listen(PORT , ()=>{
//     console.log(`server is runing on port ${PORT}`);
// })


// Local testing ke liye (Optional)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}


module.exports = app;