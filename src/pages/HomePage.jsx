import { Header } from '../components/Header';
import './HomePage.css';

export function HomePage() {
  return (
    <>
      <title>FLORIMAX - Floristería Online</title>

      <Header />

      <div className="home-page">
        <div className="products-grid">
          {/* Producto 1 - Rosas Rojas */}
          <div className="product-container">
            <div className="product-image-container">
              <div className="product-image-placeholder">🌹</div>
            </div>

            <div className="product-name limit-text-to-2-lines">
              Ramo de 12 Rosas Rojas Premium
            </div>

            <div className="product-rating-container">
              <div className="product-rating-stars">⭐⭐⭐⭐⭐</div>
              <div className="product-rating-count link-primary">
                156
              </div>
            </div>

            <div className="product-price">
              $45.99
            </div>

            <div className="product-quantity-container">
              <select>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            <div className="product-spacer"></div>

            <div className="added-to-cart">
              <span>✓</span>
              Agregado
            </div>

            <button className="add-to-cart-button button-primary">
              Agregar al Carrito
            </button>
          </div>

          {/* Producto 2 - Girasoles */}
          <div className="product-container">
            <div className="product-image-container">
              <div className="product-image-placeholder">🌻</div>
            </div>

            <div className="product-name limit-text-to-2-lines">
              Ramo de Girasoles Frescos
            </div>

            <div className="product-rating-container">
              <div className="product-rating-stars">⭐⭐⭐⭐⭐</div>
              <div className="product-rating-count link-primary">
                89
              </div>
            </div>

            <div className="product-price">
              $32.50
            </div>

            <div className="product-quantity-container">
              <select>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            <div className="product-spacer"></div>

            <div className="added-to-cart">
              <span>✓</span>
              Agregado
            </div>

            <button className="add-to-cart-button button-primary">
              Agregar al Carrito
            </button>
          </div>

          {/* Producto 3 - Tulipanes */}
          <div className="product-container">
            <div className="product-image-container">
              <div className="product-image-placeholder">🌷</div>
            </div>

            <div className="product-name limit-text-to-2-lines">
              Ramo de Tulipanes Multicolor - 15 Unidades
            </div>

            <div className="product-rating-container">
              <div className="product-rating-stars">⭐⭐⭐⭐</div>
              <div className="product-rating-count link-primary">
                127
              </div>
            </div>

            <div className="product-price">
              $38.99
            </div>

            <div className="product-quantity-container">
              <select>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            <div className="product-spacer"></div>

            <div className="added-to-cart">
              <span>✓</span>
              Agregado
            </div>

            <button className="add-to-cart-button button-primary">
              Agregar al Carrito
            </button>
          </div>

          {/* Producto 4 - Orquídeas */}
          <div className="product-container">
            <div className="product-image-container">
              <div className="product-image-placeholder">🌺</div>
            </div>

            <div className="product-name limit-text-to-2-lines">
              Orquídea Phalaenopsis en Maceta
            </div>

            <div className="product-rating-container">
              <div className="product-rating-stars">⭐⭐⭐⭐⭐</div>
              <div className="product-rating-count link-primary">
                203
              </div>
            </div>

            <div className="product-price">
              $52.00
            </div>

            <div className="product-quantity-container">
              <select>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            <div className="product-spacer"></div>

            <div className="added-to-cart">
              <span>✓</span>
              Agregado
            </div>

            <button className="add-to-cart-button button-primary">
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </>
  );
}