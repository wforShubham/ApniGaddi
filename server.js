const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bookingRoutes = require('./routes/bookings');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "https://apnigaddi-1.onrender.com",  // allow only your frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.method === 'POST' && req.path === '/api/bookings') {
    console.log('📋 Booking request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/booking-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Connection Error:', err));

// API Routes
app.use('/api/bookings', bookingRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Serve React build folder
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  // Handle React routing, return index.html for all unknown routes
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
