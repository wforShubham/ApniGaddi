require('dotenv').config(); // 👈 Add this at the very top

const nodemailer = require('nodemailer');

// Helper function to convert 24-hour time to 12-hour format
const formatTime12Hour = (time24) => {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Create transporter with secure Gmail configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Business owner details
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'owner@bookingapp.com';
const OWNER_PHONE = process.env.OWNER_PHONE || '6306876007';
const OWNER_NAME = process.env.OWNER_NAME || 'Aman';

const sendCustomerConfirmation = async (booking) => {
  console.log('📧 Attempting to send customer confirmation email to:', booking.customerEmail);
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: booking.customerEmail,
    subject: `Booking Confirmation - ${booking.bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50; text-align: center;">Booking Confirmation</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #27ae60; margin-top: 0;">Booking Details</h3>
          <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
          <p><strong>Name:</strong> ${booking.customerName}</p>
          <p><strong>Vehicle Type:</strong> ${booking.vehicleType.charAt(0).toUpperCase() + booking.vehicleType.slice(1)}</p>
          <p><strong>Quantity:</strong> ${booking.quantity}</p>
          <p><strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${booking.bookingTime}</p>

          <p><strong>Address:</strong> ${booking.address}</p>
          <p><strong>Landmark:</strong> ${booking.landmark}</p>
        </div>
        
        <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #27ae60; margin-top: 0;">Contact Information</h3>
          <p><strong>Business Owner:</strong> ${OWNER_NAME}</p>
          <p><strong>Phone:</strong> ${OWNER_PHONE}</p>
          <p><strong>Email:</strong> ${OWNER_EMAIL}</p>
        </div>
        
        <p style="color: #7f8c8d; font-size: 14px; text-align: center;">
          Thank you for choosing our service! Please keep this confirmation for your records.
        </p>
      </div>
    `
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Customer confirmation email sent successfully!');
    console.log('   Message ID:', result.messageId);
    console.log('   To:', booking.customerEmail);
  } catch (error) {
    console.error('❌ Error sending customer email:', error.message);
    console.error('   Full error:', error);
  }
};

const sendOwnerNotification = async (booking) => {
  console.log('📧 Attempting to send owner notification email to:', OWNER_EMAIL);
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: OWNER_EMAIL,
    subject: `New Booking Received - ${booking.bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50; text-align: center;">New Booking Notification</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #e74c3c; margin-top: 0;">Customer Details</h3>
          <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
          <p><strong>Name:</strong> ${booking.customerName}</p>
          <p><strong>Email:</strong> ${booking.customerEmail}</p>
          <p><strong>Phone:</strong> ${booking.customerPhone}</p>
          <p><strong>Address:</strong> ${booking.address}</p>
          <p><strong>Landmark:</strong> ${booking.landmark}</p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #856404; margin-top: 0;">Booking Details</h3>
          <p><strong>Vehicle Type:</strong> ${booking.vehicleType.charAt(0).toUpperCase() + booking.vehicleType.slice(1)}</p>
          <p><strong>Quantity:</strong> ${booking.quantity}</p>
          <p><strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${formatTime12Hour(booking.bookingTime)}</p>
          <p><strong>Address:</strong> ${booking.address}</p>
          <p><strong>Landmark:</strong> ${booking.landmark}</p>
        </div>
        
        <p style="color: #7f8c8d; font-size: 14px; text-align: center;">
          Please contact the customer to confirm the booking details.
        </p>
      </div>
    `
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Owner notification email sent successfully!');
    console.log('   Message ID:', result.messageId);
    console.log('   To:', OWNER_EMAIL);
  } catch (error) {
    console.error('❌ Error sending owner email:', error.message);
    console.error('   Full error:', error);
  }
};

module.exports = {
  sendCustomerConfirmation,
  sendOwnerNotification
}; 