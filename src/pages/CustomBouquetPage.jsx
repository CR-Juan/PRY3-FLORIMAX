import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Header } from '../components/Header';
import { availableFlowers, availableAccessories } from '../data/customBouquetData';
import { Alert } from "../components/Alert";
import './CustomBouquetPage.css';

export function CustomBouquetPage() {
  const { addCustomBouquet } = useCart();

  const [selectedFlowers, setSelectedFlowers] = useState({});
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [bouquetName, setBouquetName] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [alertData, setAlertData] = useState(null);

  const showAlert = (message, type = "info") => {
    setAlertData({ message, type });

    setTimeout(() => {
      setAlertData(null);
    }, 5000);
  };

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

  // Calcular total
  const calculateTotal = () => {
    let total = 0;

    // Flores
    Object.keys(selectedFlowers).forEach(flowerId => {
      const flower = availableFlowers.find(f => f.id === flowerId);
      if (flower) {
        total += flower.price * selectedFlowers[flowerId];
      }
    });

    // Accesorios
    selectedAccessories.forEach(accessoryId => {
      const accessory = availableAccessories.find(a => a.id === accessoryId);
      if (accessory) {
        total += accessory.price;
      }
    });

    return total.toFixed(2);
  };

  // Contar flores
  const getTotalFlowers = () => {
    return Object.values(selectedFlowers).reduce((sum, qty) => sum + qty, 0);
  };

  // Agregar al carrito
  const handleAddToCart = () => {
    if (getTotalFlowers() === 0) {
      showAlert('Debes seleccionar al menos una flor para tu ramo', 'warning');
      return;
    }

    const bouquetData = {
      name: bouquetName || 'Ramo Personalizado',
      totalPrice: calculateTotal(),
      flowers: selectedFlowers,
      accessories: selectedAccessories,
      message: personalMessage
    };

    addCustomBouquet(bouquetData);

    showAlert('¡Ramo agregado al carrito exitosamente!', 'success');

    setSelectedFlowers({});
    setSelectedAccessories([]);
    setBouquetName('');
    setPersonalMessage('');
  };

  return (
    <>
      <title>FLORIMAX - Personaliza tu Ramo</title>

      <Header />

      {alertData && (
        <Alert
          type={alertData.type}
          message={alertData.message}
          autoClose={true}
        />
      )}

      <div className="custom-bouquet-page">
        <div className="page-header">
          <h1 className="page-title">Personaliza tu Ramo</h1>
          <p className="page-subtitle">Elige flores, accesorios y crea un ramo único</p>
        </div>

        <div className="bouquet-builder-grid">

          {/* PANEL IZQUIERDO */}
          <div className="selection-panel">

            {/* FLORES */}
            <div className="section">
              <h2 className="section-title">Selecciona tus Flores</h2>
              <div className="flowers-grid">
                {availableFlowers.map(flower => (
                  <div key={flower.id} className="flower-card">

                    <img
                      src={flower.image}
                      alt={flower.name}
                      className="flower-image"
                    />

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

                      <span className="qty-display">
                        {selectedFlowers[flower.id] || 0}
                      </span>

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

            {/* ACCESORIOS */}
            <div className="section">
              <h2 className="section-title">Agrega Accesorios</h2>

              <div className="accessories-grid">
                {availableAccessories.map(accessory => (
                  <div
                    key={accessory.id}
                    className={`accessory-card ${selectedAccessories.includes(accessory.id) ? 'selected' : ''}`}
                    onClick={() => toggleAccessory(accessory.id)}
                  >

                    <img
                      src={accessory.image}
                      alt={accessory.name}
                      className="accessory-image"
                    />

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

            {/* PERSONALIZACIÓN */}
            <div className="section">
              <h2 className="section-title">Personalización</h2>

              <div className="personalization-form">
                <div className="form-group">
                  <label>Nombre del Ramo (opcional)</label>
                  <input
                    type="text"
                    placeholder='Ej: "Ramo de Aniversario"'
                    value={bouquetName}
                    onChange={(e) => setBouquetName(e.target.value)}
                    maxLength={50}
                  />
                </div>

                <div className="form-group">
                  <label>Mensaje Personalizado (opcional)</label>
                  <textarea
                    placeholder='Ej: "Feliz cumpleaños", "Te amo mamá"'
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                    maxLength={200}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PANEL DERECHO - PREVIEW */}
          <div className="preview-panel">
            <div className="preview-sticky">
              <h2 className="preview-title">Vista Previa</h2>

              <div className="preview-container">
                {getTotalFlowers() === 0 && selectedAccessories.length === 0 ? (
                  <div className="empty-preview">
                    <div className="empty-icon">💐</div>
                    <p>Selecciona flores y accesorios para ver tu ramo</p>
                  </div>
                ) : (
                  <>
                    {/* === CANVAS DEL RAMO === */}
                    {getTotalFlowers() > 0 && (
                      <div className="bouquet-visualization-canvas">

                        {/* === FLORES (RAMO COMPACTO) === */}
                        <div className="bouquet-flowers-cluster">
                          {(() => {
                            const flowerElements = [];
                            const total = getTotalFlowers();
                            if (total === 0) return [];

                            const centerY = 55;

                            // 🔥 Radio dinámico: más flores → ramo más abierto
                            const minRadius = 65;
                            const radius = minRadius + total * 4; 
                            // Ej: 5 flores = 85px | 20 flores = 145px

                            // Construir lista lineal de flores
                            const flatFlowers = [];
                            Object.keys(selectedFlowers).forEach(flowerId => {
                              const flower = availableFlowers.find(f => f.id === flowerId);
                              const quantity = selectedFlowers[flowerId];
                              for (let i = 0; i < quantity; i++) flatFlowers.push(flower);
                            });

                            // Ángulos del semicírculo (primer + segundo cuadrante)
                            const maxAngle = Math.PI / 2;   // +90°
                            const minAngle = -Math.PI / 2;  // -90°

                            // PRIMERA flor al centro (0°)
                            const angles = [0];

                            const remaining = total - 1;

                            if (remaining > 0) {
                              // 🔥 Más flores → más separación angular
                              const angleStep = (maxAngle - minAngle) / (remaining + 1);

                              for (let i = 1; i <= remaining; i++) {
                                const angle = maxAngle - angleStep * i;

                                // Alternar izquierda/derecha para simetría perfecta
                                angles.push(i % 2 === 0 ? angle : -angle);
                              }
                            }

                            // Renderizar flores
                            flatFlowers.forEach((flower, index) => {
                              const angle = angles[index];

                              const x = Math.cos(angle) * radius;
                              const y = Math.sin(angle) * radius * 0.45;

                              const rotation = angle * (180 / Math.PI);

                              flowerElements.push(
                                <img
                                  key={`${flower.id}-${index}`}
                                  src={flower.image}
                                  className="bouquet-flower-image"
                                  style={{
                                    position: "absolute",
                                    left: `calc(50% + ${x}px)`,
                                    top: `calc(${centerY + y}px)`,
                                    width: "65px",
                                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                                    zIndex: 200 - index,
                                    filter: "drop-shadow(1.5px 1.5px 3px rgba(0,0,0,0.25))",
                                  }}
                                />
                              );
                            });

                            return flowerElements;
                          })()}



                        </div>

                        {/* ACCESORIOS (envoltorio y cinta) */}
                        {selectedAccessories.map(accessoryId => {
                          const accessory = availableAccessories.find(a => a.id === accessoryId);
                          if (!accessory) return null;

                          const isWrap = accessory.name.includes("Papel");
                          const isBow = accessory.name.includes("Cinta");

                          return (
                            <img
                              key={accessory.id}
                              src={accessory.image}
                              alt=""
                              className="bouquet-accessory-image"
                              style={{
                                position: "absolute",
                                bottom: isWrap ? 0 : "10%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: isWrap ? "100%" : "80px",
                                zIndex: isWrap ? 1 : 300,
                                opacity: isWrap ? 0.9 : 1,
                              }}
                            />
                          );
                        })}
                      </div>
                    )}

                    {/* LISTA DE ACCESORIOS */}
                    {selectedAccessories.length > 0 && (
                      <div className="preview-section">
                        <h3>Accesorios ({selectedAccessories.length})</h3>
                        <div className="preview-items">
                          {selectedAccessories.map(accessoryId => {
                            const accessory = availableAccessories.find(a => a.id === accessoryId);
                            return (
                              <div key={accessoryId} className="preview-item">
                                <img
                                  src={accessory.image}
                                  alt={accessory.name}
                                  className="preview-image"
                                />
                                <span className="preview-text">{accessory.name}</span>
                                <span className="preview-price">
                                  ₡{accessory.price.toFixed(2)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* PERSONALIZACIÓN */}
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

              {/* FOOTER */}
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
                  {getTotalFlowers() === 0
                    ? "Selecciona flores"
                    : "Agregar al Carrito"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}