import { Link } from 'react-router';
import './header.css';

export function Header() {
  return (
    <div className="header">
      <div className="left-section">
        <Link to="/" className="header-link">
          <div className="logo-text">FLORIMAX</div>
          <div className="mobile-logo-text">FM</div>
        </Link>
      </div>
      
      <div className="middle-section">
        <input 
          className="search-bar" 
          type="text" 
          placeholder="Buscar flores, ramos, accesorios..." 
        />
        <button className="search-button">
          <span className="search-icon">🔍</span>
        </button>
      </div>
      
      <div className="right-section">
        <Link className="orders-link header-link" to="/orders">
          <span className="orders-text">Mis Pedidos</span>
        </Link>
        
        <Link className="cart-link header-link" to="/checkout">
          <span className="cart-icon">🛒</span>
          <div className="cart-quantity">0</div>
          <div className="cart-text">Carrito</div>
        </Link>
      </div>
    </div>
  );
}