import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { orders } from '../data/orders';
import { users } from '../data/users';
import { products } from '../data/products';
import './OrdersPage.css';

export function OrdersPage() {
  const { currentUser: user, isLoading } = useAuth();
  const [userOrders, setUserOrders] = useState([]);
  const navigate = useNavigate();

  // Validar que el usuario exista y sea tipo "user"
  useEffect(() => {
    if (!isLoading) {
      const validUser = users.find(
        u => u.email === user?.email && u.accountType === "user"
      );
      if (!user || !validUser) {
        navigate('/login');
      }
    }
  }, [user, isLoading, navigate]);

  // Filtrar órdenes del usuario
  useEffect(() => {
    if (user) {
      const validUser = users.find(
        u => u.email === user.email && u.accountType === "user"
      );
      if (validUser) {
        const filteredOrders = orders.filter(
          order => order.userId === validUser.id
        );
        setUserOrders(filteredOrders);
      }
    }
  }, [user]);

  // Obtener la imagen del producto según item.id
  const getProductImage = (id) => {
    const product = products.find(p => p.id === id);
    return product ? product.image : '';
  };

  if (isLoading || !user) {
    return (
      <div className="orders-page">
        <Header />
        <div className="page-title">Cargando pedidos...</div>
      </div>
    );
  }

  return (
    <>
      <title>FLORIMAX - Mis Pedidos</title>
      <Header />

      <div className="orders-page">
        <div className="page-title">Tus Pedidos</div>

        <div className="orders-grid">
          {userOrders.length === 0 && <div>No tienes pedidos aún.</div>}

          {userOrders.map(order => (
            <div key={order.id} className="order-container">
              <div className="order-header">
                <div className="order-header-left-section">
                  <div className="order-date">
                    <div className="order-header-label">Pedido realizado:</div>
                    <div>{order.date}</div>
                  </div>
                  <div className="order-total">
                    <div className="order-header-label">Total:</div>
                    <div>₡{order.total}</div>
                  </div>
                </div>

                <div className="order-header-right-section">
                  <div className="order-header-label">ID del Pedido:</div>
                  <div>{order.id}</div>
                </div>
              </div>

              <div className="order-details-grid">
                {order.items.map(item => (
                  <>
                    {/* Imagen */}
                    <div className="product-image-container" key={item.id + '-img'}>
                      <img
                        src={getProductImage(item.id)}
                        alt={item.name}
                        className="product-image"
                      />
                    </div>

                    {/* Detalles del producto */}
                    <div className="product-details" key={item.id + '-details'}>
                      <div className="product-name">{item.name}</div>
                      <div className="product-delivery-date">
                        Llegando el: {item.deliveryDate}
                      </div>
                      <div className="product-quantity">Cantidad: {item.quantity}</div>
                    </div>

                    {/* Acciones: rastrear + comprar de nuevo debajo */}
                    <div className="product-actions" key={item.id + '-actions'}>
                      <a href="/tracking">
                        <button className="track-package-button button-secondary">
                          Estado del pedido
                        </button>
                      </a>
                      <button className="buy-again-button button-primary">
                        <span className="buy-again-icon">🛒</span>
                        <span className="buy-again-message">Comprar de nuevo</span>
                      </button>
                    </div>
                  </>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}