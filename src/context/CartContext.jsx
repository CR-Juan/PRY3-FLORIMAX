import { createContext, useState, useContext } from 'react';

// Crear el contexto
const CartContext = createContext();

// Hook personalizado para usar el carrito
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
}

// Provider del carrito
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Agregar producto al carrito
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      // Verificar si el producto ya existe
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Si existe, actualizar cantidad
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si no existe, agregarlo
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  // Agregar ramo personalizado al carrito
  const addCustomBouquet = (bouquetData) => {
    const customProduct = {
      id: `custom-${Date.now()}`, // ID único
      name: bouquetData.name || 'Ramo Personalizado',
      price: parseFloat(bouquetData.totalPrice),
      quantity: 1,
      type: 'custom',
      emoji: '💐',
      details: bouquetData // Guardar todos los detalles del ramo
    };
    
    setCartItems(prevItems => [...prevItems, customProduct]);
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Obtener cantidad total de items
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Obtener precio total
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Obtener subtotal (sin impuestos ni envío)
  const getSubtotal = () => {
    return getTotalPrice();
  };

  // Calcular costo de envío
  const getShippingCost = () => {
    const subtotal = getSubtotal();
    if (subtotal >= 10000) {
      return 0; // Envío gratis si el subtotal es mayor a $50
    }
    return 2500;
  };

  // Calcular impuestos (13% - Costa Rica)
  const getTax = () => {
    const subtotal = getSubtotal();
    //const shipping = getShippingCost();
    return (subtotal) * 0.13;
  };

  // Obtener total final (con impuestos y envío)
  const getFinalTotal = () => {
    return getSubtotal() + getShippingCost() + getTax();
  };

  const value = {
    cartItems,
    addToCart,
    addCustomBouquet,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getSubtotal,
    getShippingCost,
    getTax,
    getFinalTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}