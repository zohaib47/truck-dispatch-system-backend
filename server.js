const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db') ;
const authRoutes = require('./src/routes/authRoutes');
const driverRoutes = require('./src/routes/driverRoutes');
const loadRoutes = require('./src/routes/loadRoutes')

// Load environment variables
dotenv.config();
const app = express();

// Connect to Database
connectDB(); 

// Middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/driver' , driverRoutes);
app.use('/api/load', loadRoutes);

// Basic Route
app.get('/' , (req, res)=>{
    res.send('Truck Dispatching system API is running mode..')
});

const PORT = process.env.PORT || 5000;

app.listen(PORT , ()=>{
    console.log(`server is runing on port ${PORT}`);
})
