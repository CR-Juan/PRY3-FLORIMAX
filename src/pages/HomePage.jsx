import { useState } from 'react';
import { Header } from '../components/Header';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { products } from '../data/products';
import { Alert } from '../components/Alert';
import './HomePage.css';

export function HomePage() {
  const { addToCart } = useCart();
  const [addedProducts, setAddedProducts] = useState({});
  const [quantities, setQuantities] = useState({});
  const [alertMessage, setAlertMessage] = useState("");

  const { currentUser } = useAuth(); // ⚡ currentUser
  

  // Manejar cambio de cantidad
  const handleQuantityChange = (productId, value) => {
    setQuantities({
      ...quantities,
      [productId]: parseInt(value)
    });
  };

  // Agregar al carrito
  const handleAddToCart = (product) => {
    if (!currentUser) {
      setAlertMessage("Debe iniciar sesión para agregar productos al carrito");
      return;
    }

    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);

    setAddedProducts({
      ...addedProducts,
      [product.id]: true
    });

    setTimeout(() => {
      setAddedProducts({
        ...addedProducts,
        [product.id]: false
      });
    }, 2000);
  };

  return (
    <>
      <title>FLORIMAX - Floristería Online</title>

      <Header />

      {/* Alerta automática 5 segundos */}
      {alertMessage && (
        <Alert
          type="warning"
          message={alertMessage}
          autoClose={true}
          duration={5000}
          onClose={() => setAlertMessage("")}
        />
      )}

      <div className="home-page">
        {/* Banner de Personalización */}
        <div className="custom-bouquet-banner">
          <div className="banner-content">
            <div className="banner-text">
              <h2>✨ Crea tu Ramo Personalizado ✨</h2>
              <p>Elige tus flores favoritas, agrega accesorios y crea un ramo único y especial</p>
            </div>

            <button
              className="custom-bouquet-button button-primary"
              onClick={() => {
                if (!currentUser) {
                  setAlertMessage("Debe iniciar sesión para personalizar un ramo");
                  return;
                }
                window.location.href = "/custom-bouquet";
              }}
            >
              🌸 Personalizar mi Ramo 🌸
            </button>
          </div>
        </div>

        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-container">
              <div className="product-image-container">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
              </div>

              <div className="product-name limit-text-to-2-lines">
                {product.name}
              </div>

              <div className="product-rating-container">
                <div className="product-rating-stars">⭐⭐⭐⭐⭐</div>
                <div className="product-rating-count link-primary">
                  {product.reviews}
                </div>
              </div>

              <div className="product-price">
                ₡{product.price.toFixed(2)}
              </div>

              <div className="product-quantity-container">
                <select 
                  value={quantities[product.id] || 1}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>

              <div className="product-spacer"></div>

              <div 
                className="added-to-cart"
                style={{ opacity: addedProducts[product.id] ? 1 : 0 }}
              >
                <span>✓</span>
                Agregado
              </div>

              <button 
                className="add-to-cart-button button-primary"
                onClick={() => handleAddToCart(product)}
              >
                Agregar al Carrito
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
