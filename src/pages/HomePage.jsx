import { useState } from 'react';
import { Header } from '../components/Header';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import './HomePage.css';

export function HomePage() {
  const { addToCart } = useCart();
  const [addedProducts, setAddedProducts] = useState({});
  const [quantities, setQuantities] = useState({});

  // Manejar cambio de cantidad
  const handleQuantityChange = (productId, value) => {
    setQuantities({
      ...quantities,
      [productId]: parseInt(value)
    });
  };

  // Agregar al carrito
  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);
    
    // Mostrar mensaje "Agregado"
    setAddedProducts({
      ...addedProducts,
      [product.id]: true
    });

    // Ocultar mensaje después de 2 segundos
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

      <div className="home-page">
        {/* Banner de Personalización */}
        <div className="custom-bouquet-banner">
          <div className="banner-content">
            <div className="banner-text">
              <h2>✨ Crea tu Ramo Personalizado ✨</h2>
              <p>Elige tus flores favoritas, agrega accesorios y crea un ramo único y especial</p>
            </div>
            <a href="/custom-bouquet">
              <button className="custom-bouquet-button button-primary">
                🌸 Personalizar mi Ramo 🌸
              </button>
            </a>
          </div>
        </div>

        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-container">
              <div className="product-image-container">
                <div className="product-image-placeholder">{product.emoji}</div>
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
                ${product.price.toFixed(2)}
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