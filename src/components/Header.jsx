import { Link } from 'react-router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Alert } from './Alert';
import './header.css';

export function Header() {
  const { getTotalItems } = useCart();
  const { currentUser, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => setShowLogoutConfirm(true);

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
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
        <button className="search-button">🔍</button>
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
              onClick={handleLogoutClick}
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link className="auth-link header-link" to="/login">
              Iniciar Sesión
            </Link>
            <Link className="auth-link header-link register-link" to="/register">
              Registrarse
            </Link>
          </>
        )}

        {currentUser && (
          <Link className="orders-link header-link" to="/orders">
            <span className="orders-text">Mis Pedidos</span>
          </Link>
        )}

        <Link className="cart-link header-link" to="/checkout">
          <div className="cart-text">Carrito</div>
          <div className="cart-quantity">{getTotalItems()}</div>
          <span className="cart-icon">🛒</span>
        </Link>
      </div>

      {/* Alerta interactiva logout */}
      {showLogoutConfirm && (
        <Alert
          type="warning"
          message="¿Estás seguro de que quieres cerrar sesión?"
          onClose={() => setShowLogoutConfirm(false)}
        >
          <div className="alert-buttons">
            <button className="button-primary" onClick={confirmLogout}>Sí</button>
            <button
              className="button-secondary"
              onClick={() => setShowLogoutConfirm(false)}
            >
              No
            </button>
          </div>
        </Alert>
      )}
    </div>
  );
}
