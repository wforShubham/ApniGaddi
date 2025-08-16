const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const Booking = require('../models/Booking');
const { sendCustomerConfirmation, sendOwnerNotification } = require('../utils/emailService');

const router = express.Router();

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new booking
router.post('/', [
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('customerEmail').isEmail().withMessage('Valid email is required'),
  body('customerPhone').notEmpty().withMessage('Phone number is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('landmark').notEmpty().withMessage('Landmark is required'),
  body('vehicleType').isIn(['auto', 'car']).withMessage('Vehicle type must be auto or car'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('bookingDate').notEmpty().withMessage('Booking date is required'),
  body('bookingTime').notEmpty().withMessage('Booking time is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      address,
      landmark,
      vehicleType,
      quantity,
      bookingDate,
      bookingTime
    } = req.body;

    // Generate unique booking ID
    const bookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Calculate total amount (you can modify pricing logic here)
    const basePrice = vehicleType === 'car' ? 50 : 25;
    const totalAmount = basePrice * quantity;

    // Create new booking
    const booking = new Booking({
      bookingId,
      customerName,
      customerEmail,
      customerPhone,
      address,
      landmark,
      vehicleType,
      quantity,
      bookingDate,
      bookingTime,
      totalAmount
    });

    await booking.save();

    // Send confirmation emails
    console.log('📧 Starting email notifications...');
    console.log('📧 Customer email:', booking.customerEmail);
    console.log('📧 Owner email:', process.env.OWNER_EMAIL);
    
    let emailResults = [];
    
    try {
      console.log('📧 Sending customer confirmation...');
      const customerResult = await sendCustomerConfirmation(booking);
      emailResults.push('Customer email sent');
      console.log('✅ Customer email sent successfully');
    } catch (customerError) {
      console.error('❌ Customer email failed:', customerError.message);
      emailResults.push('Customer email failed');
    }
    
    try {
      console.log('📧 Sending owner notification...');
      const ownerResult = await sendOwnerNotification(booking);
      emailResults.push('Owner email sent');
      console.log('✅ Owner email sent successfully');
    } catch (ownerError) {
      console.error('❌ Owner email failed:', ownerError.message);
      emailResults.push('Owner email failed');
    }
    
    console.log('📧 Email results:', emailResults.join(', '));

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        id: booking._id,
        bookingId: booking.bookingId,
        customerName: booking.customerName,
        vehicleType: booking.vehicleType,
        quantity: booking.quantity,
        bookingDate: booking.bookingDate,
        bookingTime: booking.bookingTime,
        totalAmount: booking.totalAmount,
        address: booking.address,
        landmark: booking.landmark,
        status: booking.status
      }
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update booking status
router.patch('/:id/status', [
  body('status').isIn(['pending', 'confirmed', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 