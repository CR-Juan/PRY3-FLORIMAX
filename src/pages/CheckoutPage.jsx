import './checkout-header.css';
import './CheckoutPage.css';

export function CheckoutPage() {
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
            Checkout (<a className="return-to-home-link" href="/">2 items</a>)
          </div>

          <div className="checkout-header-right-section">
            <span className="checkout-lock">🔒</span>
          </div>
        </div>
      </div>

      <div className="checkout-page">
        <div className="page-title">Revisa tu pedido</div>

        <div className="checkout-grid">
          <div className="order-summary">
            {/* Item 1 */}
            <div className="cart-item-container">
              <div className="delivery-date">
                Fecha de entrega: Martes, 15 de Junio
              </div>

              <div className="cart-item-details-grid">
                <div className="product-image-container">
                  <div className="product-image">🌹</div>
                </div>

                <div className="cart-item-details">
                  <div className="product-name">
                    Ramo de 12 Rosas Rojas Premium
                  </div>
                  <div className="product-price">
                    $45.99
                  </div>
                  <div className="product-quantity">
                    <span>
                      Cantidad: <span className="quantity-label">1</span>
                    </span>
                    <span className="update-quantity-link link-primary">
                      Actualizar
                    </span>
                    <span className="delete-quantity-link link-primary">
                      Eliminar
                    </span>
                  </div>
                </div>

                <div className="delivery-options">
                  <div className="delivery-options-title">
                    Elige una opción de entrega:
                  </div>
                  <div className="delivery-option">
                    <input type="radio" checked
                      className="delivery-option-input"
                      name="delivery-option-1" />
                    <div>
                      <div className="delivery-option-date">
                        Martes, 15 de Junio
                      </div>
                      <div className="delivery-option-price">
                        Envío GRATIS
                      </div>
                    </div>
                  </div>
                  <div className="delivery-option">
                    <input type="radio"
                      className="delivery-option-input"
                      name="delivery-option-1" />
                    <div>
                      <div className="delivery-option-date">
                        Jueves, 10 de Junio
                      </div>
                      <div className="delivery-option-price">
                        $4.99 - Envío Express
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="cart-item-container">
              <div className="delivery-date">
                Fecha de entrega: Jueves, 10 de Junio
              </div>

              <div className="cart-item-details-grid">
                <div className="product-image-container">
                  <div className="product-image">🌻</div>
                </div>

                <div className="cart-item-details">
                  <div className="product-name">
                    Ramo de Girasoles Frescos
                  </div>
                  <div className="product-price">
                    $32.50
                  </div>
                  <div className="product-quantity">
                    <span>
                      Cantidad: <span className="quantity-label">1</span>
                    </span>
                    <span className="update-quantity-link link-primary">
                      Actualizar
                    </span>
                    <span className="delete-quantity-link link-primary">
                      Eliminar
                    </span>
                  </div>
                </div>

                <div className="delivery-options">
                  <div className="delivery-options-title">
                    Elige una opción de entrega:
                  </div>
                  <div className="delivery-option">
                    <input type="radio"
                      className="delivery-option-input"
                      name="delivery-option-2" />
                    <div>
                      <div className="delivery-option-date">
                        Martes, 15 de Junio
                      </div>
                      <div className="delivery-option-price">
                        Envío GRATIS
                      </div>
                    </div>
                  </div>
                  <div className="delivery-option">
                    <input type="radio" checked
                      className="delivery-option-input"
                      name="delivery-option-2" />
                    <div>
                      <div className="delivery-option-date">
                        Jueves, 10 de Junio
                      </div>
                      <div className="delivery-option-price">
                        $4.99 - Envío Express
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen de pago */}
          <div className="payment-summary">
            <div className="payment-summary-title">
              Resumen de Pago
            </div>

            <div className="payment-summary-row">
              <div>Items (2):</div>
              <div className="payment-summary-money">$78.49</div>
            </div>

            <div className="payment-summary-row">
              <div>Envío:</div>
              <div className="payment-summary-money">$4.99</div>
            </div>

            <div className="payment-summary-row subtotal-row">
              <div>Total antes de impuestos:</div>
              <div className="payment-summary-money">$83.48</div>
            </div>

            <div className="payment-summary-row">
              <div>IVA estimado (13%):</div>
              <div className="payment-summary-money">$10.85</div>
            </div>

            <div className="payment-summary-row total-row">
              <div>Total del pedido:</div>
              <div className="payment-summary-money">$94.33</div>
            </div>

            <button className="place-order-button button-primary">
              Realizar Pedido
            </button>
          </div>
        </div>
      </div>
    </>
  );
}