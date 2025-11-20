import { useState, useEffect } from "react";
import { useCart } from '../context/CartContext';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../components/Alert";
import './checkout-header.css';
import './CheckoutPage.css';

export function CheckoutPage() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity,
    getSubtotal,
    getShippingCost,
    getTax,
    getFinalTotal,
    getTotalItems,
    clearCart
  } = useCart();

  const { currentUser: user } = useAuth();

  const navigate = useNavigate();

  const [orderList, setOrderList] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orderList));
  }, [orderList]);

  const [alertVisible, setAlertVisible] = useState(false);

  const formatDateES = (date) => {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`;
  };

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const todayFormatted = formatDateES(today);
  const tomorrowFormatted = formatDateES(tomorrow);

  const [selectedDelivery, setSelectedDelivery] = useState(
    cartItems.reduce((acc, item) => {
      acc[item.id] = "standard";
      return acc;
    }, {})
  );

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;

    const newOrder = {
      id: Date.now(),
      userId: user?.id,
      date: new Date().toISOString().split("T")[0],

      pedidoCreado: true,
      pendientePago: false,
      procesado: true,
      enviado: false,
      entregado: false,

      items: cartItems.map(item => ({
        ...item,
        deliveryDate:
          selectedDelivery[item.id] === "express"
            ? today.toISOString().split("T")[0]
            : tomorrow.toISOString().split("T")[0],
      })),

      total: getFinalTotal()
    };

    setOrderList(prev => [...prev, newOrder]);
    setAlertVisible(true);

    setTimeout(() => {
      clearCart();
      navigate("/orders");
    }, 1800);
  };

  return (
    <>
      <title>FLORIMAX - Checkout</title>

      {/* ALERTA */}
      {alertVisible && (
        <Alert
          type="success"
          message="¡Tu pedido ha sido creado exitosamente!"
          autoClose={true}
          duration={1500}
          onClose={() => setAlertVisible(false)}
        />
      )}

      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <a href="/">
              <div className="checkout-logo-text">FLORIMAX</div>
            </a>
          </div>

          <div className="checkout-header-middle-section">
            Checkout (<a className="return-to-home-link" href="/">
              {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
            </a>)
          </div>

          <div className="checkout-header-right-section">
            <span className="checkout-lock">🔒</span>
          </div>
        </div>
      </div>

      <div className="checkout-page">
        <div className="page-title">Revisa tu pedido</div>

        {/* Carrito vacío */}
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Tu carrito está vacío</h2>
            <p>Agrega algunos productos hermosos a tu carrito</p>
            <a href="/">
              <button className="button-primary" style={{ padding: '12px 30px', marginTop: '20px' }}>
                Ver Catálogo
              </button>
            </a>
          </div>
        ) : (
          <div className="checkout-grid">

            {/* Lista de productos */}
            <div className="order-summary">
              {cartItems.map((item) => {
                const deliveryDate =
                  selectedDelivery[item.id] === "express"
                    ? todayFormatted
                    : tomorrowFormatted;

                return (
                  <div key={item.id} className="cart-item-container">
                    <div className="delivery-date">
                      Fecha de entrega: {deliveryDate}
                    </div>

                    <div className="cart-item-details-grid">
                      <div className="product-image-container">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="product-image"
                        />
                      </div>

                      <div className="cart-item-details">
                        <div className="product-name">{item.name}</div>
                        <div className="product-price">₡{item.price.toFixed(2)}</div>

                        {/* ComboBox */}
                        <div className="product-quantity">
                          <span>Cantidad:</span>

                          <select
                            className="quantity-select"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                          >
                            {[1, 2, 3, 4, 5].map((num) => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>

                          <span 
                            className="delete-quantity-link link-primary"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Eliminar
                          </span>
                        </div>
                      </div>

                      {/* Opciones de envío */}
                      <div className="delivery-options">
                        <div className="delivery-options-title">
                          Elige una opción de entrega:
                        </div>

                        <div className="delivery-option">
                          <input
                            type="radio"
                            className="delivery-option-input"
                            name={`delivery-option-${item.id}`}
                            checked={selectedDelivery[item.id] === "standard"}
                            onChange={() =>
                              setSelectedDelivery((prev) => ({ ...prev, [item.id]: "standard" }))
                            }
                          />
                          <div>
                            <div className="delivery-option-date">{tomorrowFormatted}</div>
                            <div className="delivery-option-price">Envío GRATIS</div>
                          </div>
                        </div>

                        <div className="delivery-option">
                          <input
                            type="radio"
                            className="delivery-option-input"
                            name={`delivery-option-${item.id}`}
                            checked={selectedDelivery[item.id] === "express"}
                            onChange={() =>
                              setSelectedDelivery((prev) => ({ ...prev, [item.id]: "express" }))
                            }
                          />
                          <div>
                            <div className="delivery-option-date">{todayFormatted}</div>
                            <div className="delivery-option-price">₡2500 - Envío Express</div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resumen de pago */}
            <div className="payment-summary">
              <div className="payment-summary-title">Resumen de Pago</div>

              <div className="payment-summary-row">
                <div>Items ({getTotalItems()}):</div>
                <div className="payment-summary-money">₡{getSubtotal().toFixed(2)}</div>
              </div>

              <div className="payment-summary-row">
                <div>Envío:</div>
                <div className="payment-summary-money">
                  {getShippingCost() === 0 ? 'GRATIS' : `₡${getShippingCost().toFixed(2)}`}
                </div>
              </div>

              <div className="payment-summary-row subtotal-row">
                <div>Total antes de impuestos:</div>
                <div className="payment-summary-money">
                  ₡{(getSubtotal() + getShippingCost()).toFixed(2)}
                </div>
              </div>

              <div className="payment-summary-row">
                <div>IVA estimado (13%):</div>
                <div className="payment-summary-money">₡{getTax().toFixed(2)}</div>
              </div>

              <div className="payment-summary-row total-row">
                <div>Total del pedido:</div>
                <div className="payment-summary-money">₡{getFinalTotal().toFixed(2)}</div>
              </div>

              <button 
                className="place-order-button button-primary"
                onClick={handlePlaceOrder}
              >
                Realizar Pedido
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
