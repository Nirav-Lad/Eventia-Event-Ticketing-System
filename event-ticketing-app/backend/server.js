const dotenv = require('dotenv');
dotenv.config();  // Make sure this is at the very top

const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');


const app = express();
connectDB();  // Database connection

const cors = require('cors');
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, This is the first Express.js server set up by NIRAV LAD!');
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api', eventRoutes);

const path = require('path');

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
