import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          ApniGaddi
        </Link>
        <nav>
          <span style={{ color: '#666', fontSize: '0.9rem' }}>
            Auto & Car Rental Services
          </span>
        </nav>
      </div>
    </header>
  );
};

export default Header; 