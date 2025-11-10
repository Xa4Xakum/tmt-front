import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './style.css';

const Footer: React.FC = () => {
  const location = useLocation();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>О проекте</h3>
          <p>Система Контроля и Учета ТМЦ предназначена для удобства отслеживания истории всех перемений ТМЦ</p>
        </div>
        
        <div className="footer-section">
          <h3>Быстрые ссылки</h3>
          <ul className="footer-links">
            <Link to="/locations" 
              className={location.pathname === '/locations' ? 'nav-link active' : 'nav-link'}
            >Локации</Link>
            <br/>
            <Link to="/categories" 
              className={location.pathname === '/categories' ? 'nav-link active' : 'nav-link'}
            >Категории</Link>
            <br/>
            <Link to="/inventory" className={location.pathname === '/inventory' ? 'nav-link active' : 'nav-link'}>
              Список ТМЦ
            </Link>
            <br/>
            <Link to="/inventory/add" className={location.pathname === '/inventory/add' ? 'nav-link active' : 'nav-link'}>
              Добавить ТМЦ
            </Link>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Контакты</h3>
          <p>email: d.kastrikin@agroeco.ru</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 СКиУ ТМЦ</p>
      </div>
    </footer>
  );
};

export default Footer;