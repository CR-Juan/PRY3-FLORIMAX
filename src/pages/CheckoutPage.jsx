import { useState } from "react";
import { useCart } from '../context/CartContext';
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
    getTotalItems
  } = useCart();

  //Para las fechas
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
      acc[item.id] = "standard"; // por defecto envío estándar
      return acc;
    }, {})
  );

  return (
    <>
      <title>FLORIMAX - Checkout</title>

      {/* Header especial para checkout */}
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
            <div className="order-summary">
              {cartItems.map((item) => {
                // Fecha dinámica según la opción seleccionada
                const deliveryDate = selectedDelivery[item.id] === "express" ? todayFormatted : tomorrowFormatted;

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
                        <div className="product-quantity">
                          <span>
                            Cantidad: <span className="quantity-label">{item.quantity}</span>
                          </span>
                          <span 
                            className="update-quantity-link link-primary"
                            onClick={() => {
                              const newQty = prompt('Nueva cantidad:', item.quantity);
                              if (newQty && !isNaN(newQty)) {
                                updateQuantity(item.id, parseInt(newQty));
                              }
                            }}
                          >
                            Actualizar
                          </span>
                          <span 
                            className="delete-quantity-link link-primary"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Eliminar
                          </span>
                        </div>
                      </div>

                      <div className="delivery-options">
                        <div className="delivery-options-title">
                          Elige una opción de entrega:
                        </div>

                        {/* Envío estándar */}
                        <div className="delivery-option">
                          <input
                            type="radio"
                            className="delivery-option-input"
                            name={`delivery-option-${item.id}`}
                            checked={selectedDelivery[item.id] === "standard"}
                            onChange={() => setSelectedDelivery(prev => ({
                              ...prev,
                              [item.id]: "standard"
                            }))}
                          />
                          <div>
                            <div className="delivery-option-date">{tomorrowFormatted}</div>
                            <div className="delivery-option-price">Envío GRATIS</div>
                          </div>
                        </div>

                        {/* Envío Express */}
                        <div className="delivery-option">
                          <input
                            type="radio"
                            className="delivery-option-input"
                            name={`delivery-option-${item.id}`}
                            checked={selectedDelivery[item.id] === "express"}
                            onChange={() => setSelectedDelivery(prev => ({
                              ...prev,
                              [item.id]: "express"
                            }))}
                          />
                          <div>
                            <div className="delivery-option-date">{todayFormatted}</div>
                            <div className="delivery-option-price">₡2500 - Envío Express</div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                )
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

              <button className="place-order-button button-primary">Realizar Pedido</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
