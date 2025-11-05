import React from 'react';
import './style.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <nav className="navigation">
        <ul className="nav-list">
          <li><a href="#story">История</a></li>
          <li><a href="#names">Наименования</a></li>
          <li><a href="#locations">Локации</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;