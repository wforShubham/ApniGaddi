import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';

const bgAnimation = {
  animate: {
    backgroundPosition: [
      '0% 50%',
      '100% 50%',
      '0% 50%'
    ],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const buttonVariants = {
  hover: {
    scale: 1.08,
    boxShadow: '0 6px 24px rgba(67, 206, 162, 0.18)',
    transition: { duration: 0.18, type: 'spring', stiffness: 400 }
  },
  tap: { scale: 0.97 }
};

const HomePage = () => {
  const navigate = useNavigate();

  // Animation sources
  const carAnimation = require('../assets/car.json');
  const autoRickshawAnimation = require('../assets/auto-rickshaw.json');

  return (
    <motion.div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
        backgroundSize: '200% 200%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Segoe UI, Arial, sans-serif'
      }}
      variants={bgAnimation}
      animate="animate"
    >
              <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          style={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(15px)',
            borderRadius: '25px',
            boxShadow: '0 25px 50px rgba(31, 38, 135, 0.15)',
            padding: '4rem 3rem',
            minWidth: '380px',
            maxWidth: '95vw',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
        <motion.h1
          style={{ marginBottom: '1rem', fontWeight: 700, color: '#2c3e50', fontSize: '2.5rem' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Welcome to Auto & Car Booking
        </motion.h1>
        <motion.p
          style={{ color: '#5a5a5a', marginBottom: '3rem', fontSize: '1.2rem', lineHeight: '1.6' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Book an auto or a car for your journey in just a few clicks. Fast, reliable, and easy!
        </motion.p>
        <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.button
            style={{
              padding: '1.5rem 3rem',
              fontSize: '1.2rem',
              fontWeight: 600,
              borderRadius: '15px',
              border: 'none',
              background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(67, 206, 162, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              outline: 'none',
              minWidth: '200px',
              justifyContent: 'center'
            }}
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            onClick={() => navigate('/book/auto')}
          >
            <Lottie 
              animationData={autoRickshawAnimation} 
              loop 
              autoplay 
              style={{ height: 40, width: 40 }} 
            />
            Book Auto
          </motion.button>
          <motion.button
            style={{
              padding: '1.5rem 3rem',
              fontSize: '1.2rem',
              fontWeight: 600,
              borderRadius: '15px',
              border: 'none',
              background: 'linear-gradient(90deg, #ff9966 0%, #ff5e62 100%)',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255, 153, 102, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              outline: 'none',
              minWidth: '200px',
              justifyContent: 'center'
            }}
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            onClick={() => navigate('/book/car')}
          >
            <Lottie 
              animationData={carAnimation} 
              loop 
              autoplay 
              style={{ height: 70, width: 70 }} 
            />
            Book Car
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage; 