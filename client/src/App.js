import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookingForm from './components/BookingForm';
import Header from './components/Header';
import HomePage from './components/HomePage';
import './App.css';

function App() {
  useEffect(() => {
    // Wake up backend when site loads
    fetch("https://apnigaddi-backend.onrender.com/api/ping")
      .then(res => console.log("✅ Backend wake-up:", res.status))
      .catch(err => console.error("❌ Wake-up failed:", err));
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/book/:vehicleType" element={<BookingForm />} />
            {/* Optional fallback route for invalid paths */}
            <Route path="*" element={<h2>Page Not Found</h2>} />
          </Routes>
        </main>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
