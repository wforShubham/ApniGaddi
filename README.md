# AutoCar Booking Application

A modern web application for booking auto rickshaws and cars built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- **User-friendly Booking Interface**: Modern, responsive design with intuitive form controls
- **Vehicle Selection**: Choose between Auto Rickshaw ($25) and Car ($50)
- **Quantity Selection**: Book multiple vehicles with quantity controls
- **Date and Time Selection**: Flexible booking scheduling
- **Real-time Price Calculation**: Automatic total amount calculation
- **Email Notifications**: 
  - Customer receives confirmation email with booking details and business contact info
  - Business owner receives notification with customer details
- **Unique Booking IDs**: Each booking gets a unique identifier
- **Form Validation**: Comprehensive client-side and server-side validation
- **Success Modal**: Beautiful confirmation modal with booking details

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Nodemailer** - Email service
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **React Toastify** - Toast notifications
- **Date-fns** - Date formatting

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Gmail account for email notifications

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bookingapp
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/booking-app
   
   # Email Configuration (Gmail)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Business Owner Details
   OWNER_EMAIL=owner@yourbusiness.com
   OWNER_PHONE=+1234567890
   OWNER_NAME=Your Business Name
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

   **Note**: For Gmail, you'll need to:
   - Enable 2-factor authentication
   - Generate an App Password
   - Use the App Password in EMAIL_PASS

5. **Start the application**

   **Development mode (both frontend and backend)**:
   ```bash
   npm run dev
   ```

   **Production mode**:
   ```bash
   npm start
   ```

   The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create new booking
- `PATCH /api/bookings/:id/status` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking

### Booking Request Format
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "vehicleType": "car",
  "quantity": 2,
  "bookingDate": "2024-01-15",
  "bookingTime": "14:00"
}
```

## Project Structure

```
bookingapp/
├── client/                 # React frontend
│   ├── public/
│   │   ├── components/
│   │   │   ├── BookingForm.js
│   │   │   └── Header.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── models/
│   └── Booking.js         # MongoDB schema
├── routes/
│   └── bookings.js        # API routes
├── utils/
│   └── emailService.js    # Email functionality
├── server.js              # Express server
├── package.json
└── README.md
```

## Email Templates

The application sends two types of emails:

### Customer Confirmation Email
- Booking details (ID, vehicle type, quantity, date, time, amount)
- Business owner contact information
- Professional styling with HTML

### Owner Notification Email
- Customer details (name, email, phone)
- Booking information
- Contact details for follow-up

## Customization

### Pricing
Modify the pricing logic in `routes/bookings.js`:
```javascript
const basePrice = vehicleType === 'car' ? 50 : 25;
```

### Business Information
Update the owner details in `utils/emailService.js` or use environment variables:
```javascript
const OWNER_EMAIL = process.env.OWNER_EMAIL;
const OWNER_PHONE = process.env.OWNER_PHONE;
const OWNER_NAME = process.env.OWNER_NAME;
```

### Available Time Slots
Modify the time options in `client/src/components/BookingForm.js`:
```javascript
<option value="09:00">9:00 AM</option>
<option value="10:00">10:00 AM</option>
// Add more time slots as needed
```

## Deployment

### Backend Deployment (Heroku)
1. Create a Heroku account
2. Install Heroku CLI
3. Create a new Heroku app
4. Set environment variables in Heroku dashboard
5. Deploy using Git

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the `build` folder to your preferred hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository. 