import React from 'react';
import './style.css';

const Footer: React.FC = () => {
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
            <li><a href="#story">История</a></li>
            <li><a href="#names">Наименования</a></li>
            <li><a href="#locations">Локации</a></li>
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