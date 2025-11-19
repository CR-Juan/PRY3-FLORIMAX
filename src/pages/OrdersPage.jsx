import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { orders } from '../data/orders';
import { users } from '../data/users';
import { products } from '../data/products';
import { Alert } from "../components/Alert";
import './OrdersPage.css';

export function OrdersPage() {
  const { currentUser: user, isLoading } = useAuth();

  const [orderList, setOrderList] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : orders;
  });

  const [userOrders, setUserOrders] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orderList));
  }, [orderList]);

  useEffect(() => {
    if (!isLoading) {
      const validUser = users.find(
        u => u.email === user?.email && u.accountType === "user"
      );
      if (!user || !validUser) navigate('/login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      const validUser = users.find(
        u => u.email === user.email && u.accountType === "user"
      );
      if (validUser) {
        const filteredOrders = orderList.filter(
          order => order.userId === validUser.id
        );
        setUserOrders(filteredOrders);
      }
    }
  }, [user, orderList]);

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

  const handleBuyAgain = (item) => {
    const newOrder = {
      id: Date.now(),
      userId: user.id,
      date: new Date().toISOString().split("T")[0],

      pedidoCreado: true,
      pendientePago: false,
      procesado: true,
      enviado: false,
      entregado: false,

      items: [
        {
          ...item,
          deliveryDate: new Date(Date.now() + 2 * 86400000)
            .toISOString()
            .split("T")[0],
        },
      ],

      total: item.price * item.quantity,
    };

    setOrderList(prev => [...prev, newOrder]);
    setAlertVisible(true);
  };

  return (
    <>
      <title>FLORIMAX - Mis Pedidos</title>
      <Header />

      {/* ALERTA */}
      {alertVisible && (
        <Alert
          type="success"
          message="Pedido agregado nuevamente a tus órdenes."
          autoClose={true}
          duration={3500}
          onClose={() => setAlertVisible(false)}
          className="orders-alert"
        />
      )}

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
                    <div className="product-image-container" key={item.id + '-img'}>
                      <img
                        src={getProductImage(item.id)}
                        alt={item.name}
                        className="product-image"
                      />
                    </div>

                    <div className="product-details" key={item.id + '-details'}>
                      <div className="product-name">{item.name}</div>
                      <div className="product-delivery-date">
                        Llegando el: {item.deliveryDate}
                      </div>
                      <div className="product-quantity">Cantidad: {item.quantity}</div>
                    </div>

                    <div className="product-actions" key={item.id + '-actions'}>
                      <button
                        className="track-package-button button-secondary"
                        onClick={() => navigate("/tracking", { state: { order } })}
                      >
                        Estado del pedido
                      </button>

                      <button
                        className="buy-again-button button-primary"
                        onClick={() => handleBuyAgain(item)}
                      >
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
