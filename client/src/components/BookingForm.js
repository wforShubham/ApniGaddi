import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import Lottie from 'lottie-react';

const BookingForm = () => {
  const { vehicleType } = useParams();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    landmark: '',
    vehicleType: vehicleType || '',
    quantity: 1,
    bookingDate: '',
    bookingTime: '',
    bookingHour: '',
    bookingMinute: '',
    bookingPeriod: ''
  });
  const [vehicleTypeLocked, setVehicleTypeLocked] = useState(!!vehicleType);

  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Animation sources
  const carAnimation = require('../assets/car.json');
  const autoRickshawAnimation = require('../assets/auto-rickshaw.json');

  useEffect(() => {
    if (vehicleType) {
      setFormData(prev => ({ ...prev, vehicleType }));
      setVehicleTypeLocked(true);
    }
  }, [vehicleType]);

  // Helper function to convert 12-hour format to 24-hour format
  const convertTo24Hour = (hour, minute, period) => {
    if (!hour || !minute || !period) return '';
    
    let hour24 = parseInt(hour);
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    
    return `${hour24.toString().padStart(2, '0')}:${minute}`;
  };

  // Helper function to convert 24-hour format to 12-hour format
  const convertTo12Hour = (time24) => {
    if (!time24) return { hour: '', minute: '', period: '' };
    
    const [hour, minute] = time24.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    
    return {
      hour: hour12.toString(),
      minute: minute,
      period: period
    };
  };

  // Calculate total amount
  const basePrice = formData.vehicleType === 'car' ? 50 : formData.vehicleType === 'auto' ? 25 : 0;
  const totalAmount = basePrice * formData.quantity;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVehicleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      vehicleType: type
    }));
  };

  const handleQuantityChange = (change) => {
    const newQuantity = formData.quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setFormData(prev => ({
        ...prev,
        quantity: newQuantity
      }));
    }
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!formData.customerEmail.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!formData.customerPhone.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }
    if (!formData.address.trim()) {
      toast.error('Please enter your address');
      return false;
    }
    if (!formData.landmark.trim()) {
      toast.error('Please enter your landmark');
      return false;
    }
    if (!formData.vehicleType) {
      toast.error('Please select a vehicle type');
      return false;
    }
    if (!formData.bookingDate) {
      toast.error('Please select a booking date');
      return false;
    }
    if (!formData.bookingHour || !formData.bookingMinute || !formData.bookingPeriod) {
      toast.error('Please select a booking time');
      return false;
    }

    // Check if booking date is not in the past
    const selectedDate = new Date(formData.bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error('Booking date cannot be in the past');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/bookings', formData);
      
      setBookingDetails(response.data.booking);
      setShowSuccessModal(true);
      
      // Reset form but preserve vehicle type
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        address: '',
        landmark: '',
        vehicleType: vehicleType || formData.vehicleType, // Preserve the vehicle type
        quantity: 1,
        bookingDate: '',
        bookingTime: '',
        bookingHour: '',
        bookingMinute: '',
        bookingPeriod: ''
      });

      toast.success('Booking submitted successfully! Check your email for confirmation.');
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit booking. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setBookingDetails(null);
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <div className="booking-container">
        {/* Animated vehicle at the top */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {formData.vehicleType === 'auto' ? (
            <Lottie animationData={autoRickshawAnimation} loop autoplay style={{ height: 120, width: 120 }} />
          ) : (
            <Lottie animationData={carAnimation} loop autoplay style={{ height: 120, width: 120 }} />
          )}
        </div>
        <h1 className="booking-title">Book Your Vehicle</h1>
        <p className="booking-subtitle">
          Choose your preferred vehicle type, date, and time for a seamless booking experience
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="customerName">Full Name</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="customerEmail">Email Address</label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="customerPhone">Phone Number</label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="landmark">Landmark</label>
              <input
                type="text"
                id="landmark"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
                placeholder="Enter your landmark"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bookingDate">Booking Date</label>
              <input
                type="date"
                id="bookingDate"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleInputChange}
                min={today}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bookingTime">Booking Time</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select
                  name="bookingHour"
                  value={formData.bookingHour || ''}
                  onChange={(e) => {
                    const hour = e.target.value;
                    const minute = formData.bookingMinute || '00';
                    const period = formData.bookingPeriod || 'AM';
                    const time24 = convertTo24Hour(hour, minute, period);
                    setFormData(prev => ({
                      ...prev,
                      bookingHour: hour,
                      bookingTime: time24
                    }));
                  }}
                  required
                  style={{ flex: 1 }}
                >
                  <option value="">Hour</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                    <option key={hour} value={hour}>{hour}</option>
                  ))}
                </select>
                
                <select
                  name="bookingMinute"
                  value={formData.bookingMinute || ''}
                  onChange={(e) => {
                    const minute = e.target.value;
                    const hour = formData.bookingHour || '12';
                    const period = formData.bookingPeriod || 'AM';
                    const time24 = convertTo24Hour(hour, minute, period);
                    setFormData(prev => ({
                      ...prev,
                      bookingMinute: minute,
                      bookingTime: time24
                    }));
                  }}
                  required
                  style={{ flex: 1 }}
                >
                  <option value="">Min</option>
                  {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(minute => (
                    <option key={minute} value={minute}>{minute}</option>
                  ))}
                </select>
                
                <select
                  name="bookingPeriod"
                  value={formData.bookingPeriod || ''}
                  onChange={(e) => {
                    const period = e.target.value;
                    const hour = formData.bookingHour || '12';
                    const minute = formData.bookingMinute || '00';
                    const time24 = convertTo24Hour(hour, minute, period);
                    setFormData(prev => ({
                      ...prev,
                      bookingPeriod: period,
                      bookingTime: time24
                    }));
                  }}
                  required
                  style={{ flex: 1 }}
                >
                  <option value="">AM/PM</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          {!vehicleTypeLocked && (
            <div className="form-group">
              <label>Vehicle Type</label>
              <div className="vehicle-type-buttons">
                <button
                  type="button"
                  className={formData.vehicleType === 'auto' ? 'selected' : ''}
                  onClick={() => handleVehicleTypeChange('auto')}
                >
                  Auto
                </button>
                <button
                  type="button"
                  className={formData.vehicleType === 'car' ? 'selected' : ''}
                  onClick={() => handleVehicleTypeChange('car')}
                >
                  Car
                </button>
              </div>
            </div>
          )}
          {vehicleTypeLocked && (
            <div className="form-group">
              <label>Vehicle Type</label>
              <input type="text" value={vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)} disabled readOnly />
            </div>
          )}

          <div className="form-group">
            <label>Quantity</label>
            <div className="quantity-selector">
              <button
                type="button"
                className="quantity-btn"
                onClick={() => handleQuantityChange(-1)}
                disabled={formData.quantity <= 1}
              >
                -
              </button>
              <span className="quantity-display">{formData.quantity}</span>
              <button
                type="button"
                className="quantity-btn"
                onClick={() => handleQuantityChange(1)}
                disabled={formData.quantity >= 10}
              >
                +
              </button>
            </div>
          </div>


          <button
            type="submit"
            className="submit-btn"
            disabled={loading || totalAmount === 0}
          >
            {loading ? (
              <>
                <span className="loading"></span>
                Processing...
              </>
            ) : (
              'Confirm Booking'
            )}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && bookingDetails && (
        <div className="success-modal">
          <div className="modal-content">
            <div className="success-icon">✅</div>
            <h2 className="modal-title">Booking Confirmed!</h2>
            <p>Your booking has been successfully submitted. You will receive a confirmation email shortly.</p>
            
            <div className="booking-details">
              <p><strong>Booking ID:</strong> <span className="booking-id">{bookingDetails.bookingId}</span></p>
              <p><strong>Name:</strong> {bookingDetails.customerName}</p>
              <p><strong>Vehicle:</strong> {bookingDetails.vehicleType.charAt(0).toUpperCase() + bookingDetails.vehicleType.slice(1)}</p>
              <p><strong>Quantity:</strong> {bookingDetails.quantity}</p>
              <p><strong>Date:</strong> {format(new Date(bookingDetails.bookingDate), 'MMMM dd, yyyy')}</p>
              <p><strong>Time:</strong> {convertTo12Hour(bookingDetails.bookingTime).hour}:{convertTo12Hour(bookingDetails.bookingTime).minute} {convertTo12Hour(bookingDetails.bookingTime).period}</p>
              <p><strong>Address:</strong> {bookingDetails.address}</p>
              <p><strong>Landmark:</strong> {bookingDetails.landmark}</p>
            </div>

            <button className="close-btn" onClick={closeSuccessModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingForm; 