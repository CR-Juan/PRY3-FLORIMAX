import { Header } from '../components/Header';
import './OrdersPage.css';

export function OrdersPage() {
  return (
    <>
      <title>FLORIMAX - Mis Pedidos</title>

      <Header />

      <div className="orders-page">
        <div className="page-title">Tus Pedidos</div>

        <div className="orders-grid">
          {/* Pedido 1 */}
          <div className="order-container">
            <div className="order-header">
              <div className="order-header-left-section">
                <div className="order-date">
                  <div className="order-header-label">Pedido realizado:</div>
                  <div>12 de Agosto</div>
                </div>
                <div className="order-total">
                  <div className="order-header-label">Total:</div>
                  <div>$94.33</div>
                </div>
              </div>

              <div className="order-header-right-section">
                <div className="order-header-label">ID del Pedido:</div>
                <div>27cba69d-4c3d-4098-b42d</div>
              </div>
            </div>

            <div className="order-details-grid">
              <div className="product-image-container">
                <div className="product-image">🌹</div>
              </div>

              <div className="product-details">
                <div className="product-name">
                  Ramo de 12 Rosas Rojas Premium
                </div>
                <div className="product-delivery-date">
                  Llegando el: 15 de Agosto
                </div>
                <div className="product-quantity">
                  Cantidad: 1
                </div>
                <button className="buy-again-button button-primary">
                  <span className="buy-again-icon">🛒</span>
                  <span className="buy-again-message">Comprar de nuevo</span>
                </button>
              </div>

              <div className="product-actions">
                <a href="/tracking">
                  <button className="track-package-button button-secondary">
                    Rastrear paquete
                  </button>
                </a>
              </div>

              <div className="product-image-container">
                <div className="product-image">🌻</div>
              </div>

              <div className="product-details">
                <div className="product-name">
                  Ramo de Girasoles Frescos
                </div>
                <div className="product-delivery-date">
                  Llegando el: 19 de Agosto
                </div>
                <div className="product-quantity">
                  Cantidad: 1
                </div>
                <button className="buy-again-button button-primary">
                  <span className="buy-again-icon">🛒</span>
                  <span className="buy-again-message">Comprar de nuevo</span>
                </button>
              </div>

              <div className="product-actions">
                <a href="/tracking">
                  <button className="track-package-button button-secondary">
                    Rastrear paquete
                  </button>
                </a>
              </div>
            </div>
          </div>

          {/* Pedido 2 */}
          <div className="order-container">
            <div className="order-header">
              <div className="order-header-left-section">
                <div className="order-date">
                  <div className="order-header-label">Pedido realizado:</div>
                  <div>10 de Junio</div>
                </div>
                <div className="order-total">
                  <div className="order-header-label">Total:</div>
                  <div>$52.00</div>
                </div>
              </div>

              <div className="order-header-right-section">
                <div className="order-header-label">ID del Pedido:</div>
                <div>b6b6c212-d30e-4d4a-805d</div>
              </div>
            </div>

            <div className="order-details-grid">
              <div className="product-image-container">
                <div className="product-image">🌺</div>
              </div>

              <div className="product-details">
                <div className="product-name">
                  Orquídea Phalaenopsis en Maceta
                </div>
                <div className="product-delivery-date">
                  Llegando el: 17 de Junio
                </div>
                <div className="product-quantity">
                  Cantidad: 1
                </div>
                <button className="buy-again-button button-primary">
                  <span className="buy-again-icon">🛒</span>
                  <span className="buy-again-message">Comprar de nuevo</span>
                </button>
              </div>

              <div className="product-actions">
                <a href="/tracking">
                  <button className="track-package-button button-secondary">
                    Rastrear paquete
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}