import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './style.css';


const Header: React.FC = () => {
  const location = useLocation();
  return (
    <header className="header">
      <nav className="navigation">
        <ul className='nav-list'>
          <Link to="/locations" 
            className={location.pathname === '/locations' ? 'nav-link active' : 'nav-link'}
          >Локации</Link>
          <Link to="/categories" 
            className={location.pathname === '/categories' ? 'nav-link active' : 'nav-link'}
          >Категории</Link>
          <Link to="/inventory" 
            className={location.pathname === '/inventory' ? 'nav-link active' : 'nav-link'}
          >ТМЦ</Link>
        </ul>
      </nav>
    </header>
  );
};

export default Header;