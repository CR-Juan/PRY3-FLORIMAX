import { Link } from 'react-router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './header.css';

export function Header() {
  const { getTotalItems } = useCart();
  const { currentUser, logout } = useAuth();
  
  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
    }
  };

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
        {currentUser ? (
          <>
            <div className="user-info">
              <span className="user-icon">👤</span>
              <span className="user-name">{currentUser.name}</span>
            </div>
            
            <button 
              className="logout-button header-link"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link className="auth-link header-link" to="/login">
              <span className="auth-text">Iniciar Sesión</span>
            </Link>
            
            <Link className="auth-link header-link register-link" to="/register">
              <span className="auth-text">Registrarse</span>
            </Link>
          </>
        )}
        
        <Link className="orders-link header-link" to="/orders">
          <span className="orders-text">Mis Pedidos</span>
        </Link>
        
        <Link className="cart-link header-link" to="/checkout">
          <span className="cart-icon">🛒</span>
          <div className="cart-quantity">{getTotalItems()}</div>
          <div className="cart-text">Carrito</div>
        </Link>
      </div>
    </div>
  );
}