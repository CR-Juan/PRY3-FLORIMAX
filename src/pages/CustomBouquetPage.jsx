import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Header } from '../components/Header';
import { availableFlowers, availableAccessories } from '../data/customBouquetData';
import './CustomBouquetPage.css';

export function CustomBouquetPage() {
  const { addCustomBouquet } = useCart();
  // Estados para el ramo personalizado
  const [selectedFlowers, setSelectedFlowers] = useState({});
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [bouquetName, setBouquetName] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');

  // Agregar o actualizar cantidad de flores
  const updateFlowerQuantity = (flowerId, quantity) => {
    if (quantity <= 0) {
      const newFlowers = { ...selectedFlowers };
      delete newFlowers[flowerId];
      setSelectedFlowers(newFlowers);
    } else {
      setSelectedFlowers({
        ...selectedFlowers,
        [flowerId]: quantity
      });
    }
  };

  // Toggle accesorios
  const toggleAccessory = (accessoryId) => {
    if (selectedAccessories.includes(accessoryId)) {
      setSelectedAccessories(selectedAccessories.filter(id => id !== accessoryId));
    } else {
      setSelectedAccessories([...selectedAccessories, accessoryId]);
    }
  };

  // Calcular precio total
  const calculateTotal = () => {
    let total = 0;
    
    // Sumar flores
    Object.keys(selectedFlowers).forEach(flowerId => {
      const flower = availableFlowers.find(f => f.id === flowerId);
      if (flower) {
        total += flower.price * selectedFlowers[flowerId];
      }
    });

    // Sumar accesorios
    selectedAccessories.forEach(accessoryId => {
      const accessory = availableAccessories.find(a => a.id === accessoryId);
      if (accessory) {
        total += accessory.price;
      }
    });

    return total.toFixed(2);
  };

  // Agregar ramo personalizado al carrito
  const handleAddToCart = () => {
    const totalFlowers = getTotalFlowers();
    
    if (totalFlowers === 0) {
      alert('Debes seleccionar al menos una flor para tu ramo');
      return;
    }

    // Preparar datos del ramo
    const bouquetData = {
      name: bouquetName || 'Ramo Personalizado',
      totalPrice: calculateTotal(),
      flowers: selectedFlowers,
      accessories: selectedAccessories,
      message: personalMessage
    };

    // Agregar al carrito
    addCustomBouquet(bouquetData);

    // Mostrar confirmación
    alert('¡Ramo agregado al carrito exitosamente! 🌸');

    // Limpiar formulario
    setSelectedFlowers({});
    setSelectedAccessories([]);
    setBouquetName('');
    setPersonalMessage('');
  };

  // Contar total de flores
  const getTotalFlowers = () => {
    return Object.values(selectedFlowers).reduce((sum, qty) => sum + qty, 0);
  };

  return (
    <>
      <title>FLORIMAX - Personaliza tu Ramo</title>
      
      <Header />

      <div className="custom-bouquet-page">
        <div className="page-header">
          <h1 className="page-title">🌸 Personaliza tu Ramo 🌸</h1>
          <p className="page-subtitle">Crea un ramo único y especial seleccionando tus flores y accesorios favoritos</p>
        </div>

        <div className="bouquet-builder-grid">
          {/* Panel izquierdo - Selección */}
          <div className="selection-panel">
            
            {/* Sección de Flores */}
            <div className="section">
              <h2 className="section-title">Selecciona tus Flores</h2>
              <div className="flowers-grid">
                {availableFlowers.map(flower => (
                  <div key={flower.id} className="flower-card">
                    <div className="flower-emoji">{flower.emoji}</div>
                    <div className="flower-info">
                      <div className="flower-name">{flower.name}</div>
                      <div className="flower-description">{flower.description}</div>
                      <div className="flower-price">₡{flower.price.toFixed(2)} c/u</div>
                    </div>
                    <div className="flower-controls">
                      <button 
                        className="qty-button"
                        onClick={() => updateFlowerQuantity(flower.id, (selectedFlowers[flower.id] || 0) - 1)}
                      >
                        -
                      </button>
                      <span className="qty-display">{selectedFlowers[flower.id] || 0}</span>
                      <button 
                        className="qty-button"
                        onClick={() => updateFlowerQuantity(flower.id, (selectedFlowers[flower.id] || 0) + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sección de Accesorios */}
            <div className="section">
              <h2 className="section-title">Agrega Accesorios</h2>
              <div className="accessories-grid">
                {availableAccessories.map(accessory => (
                  <div 
                    key={accessory.id} 
                    className={`accessory-card ${selectedAccessories.includes(accessory.id) ? 'selected' : ''}`}
                    onClick={() => toggleAccessory(accessory.id)}
                  >
                    <div className="accessory-emoji">{accessory.emoji}</div>
                    <div className="accessory-info">
                      <div className="accessory-name">{accessory.name}</div>
                      <div className="accessory-description">{accessory.description}</div>
                      <div className="accessory-price">₡{accessory.price.toFixed(2)}</div>
                    </div>
                    {selectedAccessories.includes(accessory.id) && (
                      <div className="selected-badge">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sección de Personalización */}
            <div className="section">
              <h2 className="section-title">Personaliza tu Ramo</h2>
              <div className="personalization-form">
                <div className="form-group">
                  <label>Nombre del Ramo (opcional)</label>
                  <input 
                    type="text"
                    placeholder='Ej: "Ramo de Aniversario", "Para Mamá"'
                    value={bouquetName}
                    onChange={(e) => setBouquetName(e.target.value)}
                    maxLength={50}
                  />
                </div>
                <div className="form-group">
                  <label>Mensaje Personalizado (opcional)</label>
                  <textarea 
                    placeholder='Ej: "Feliz cumpleaños amor", "Te amo mamá"'
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                    maxLength={200}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Panel derecho - Vista previa y resumen */}
          <div className="preview-panel">
            <div className="preview-sticky">
              <h2 className="preview-title">Vista Previa de tu Ramo</h2>
              
              <div className="preview-container">
                {getTotalFlowers() === 0 && selectedAccessories.length === 0 ? (
                  <div className="empty-preview">
                    <div className="empty-icon">💐</div>
                    <p>Selecciona flores y accesorios para ver tu ramo</p>
                  </div>
                ) : (
                  <>
                    {/* Mostrar flores seleccionadas */}
                    {Object.keys(selectedFlowers).length > 0 && (
                      <div className="preview-section">
                        <h3>Flores ({getTotalFlowers()})</h3>
                        <div className="preview-items">
                          {Object.keys(selectedFlowers).map(flowerId => {
                            const flower = availableFlowers.find(f => f.id === flowerId);
                            const quantity = selectedFlowers[flowerId];
                            return (
                              <div key={flowerId} className="preview-item">
                                <span className="preview-emoji">{flower.emoji}</span>
                                <span className="preview-text">{flower.name} x{quantity}</span>
                                <span className="preview-price">₡{(flower.price * quantity).toFixed(2)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Mostrar accesorios seleccionados */}
                    {selectedAccessories.length > 0 && (
                      <div className="preview-section">
                        <h3>Accesorios ({selectedAccessories.length})</h3>
                        <div className="preview-items">
                          {selectedAccessories.map(accessoryId => {
                            const accessory = availableAccessories.find(a => a.id === accessoryId);
                            return (
                              <div key={accessoryId} className="preview-item">
                                <span className="preview-emoji">{accessory.emoji}</span>
                                <span className="preview-text">{accessory.name}</span>
                                <span className="preview-price">₡{accessory.price.toFixed(2)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Mostrar personalización */}
                    {(bouquetName || personalMessage) && (
                      <div className="preview-section">
                        <h3>Personalización</h3>
                        {bouquetName && (
                          <div className="preview-detail">
                            <strong>Nombre:</strong> {bouquetName}
                          </div>
                        )}
                        {personalMessage && (
                          <div className="preview-detail">
                            <strong>Mensaje:</strong> {personalMessage}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Total y botón */}
              <div className="preview-footer">
                <div className="total-price">
                  <span>Total:</span>
                  <span className="price-amount">₡{calculateTotal()}</span>
                </div>
                <button 
                  className="add-to-cart-button button-primary"
                  disabled={getTotalFlowers() === 0}
                  onClick={handleAddToCart}
                >
                  {getTotalFlowers() === 0 ? 'Selecciona flores' : 'Agregar al Carrito'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}