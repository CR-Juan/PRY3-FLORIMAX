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
    setTimeout(() => setAlertData(null), 5000);
  };

  const updateFlowerQuantity = (flowerId, quantity) => {
    if (quantity <= 0) {
      const newFlowers = { ...selectedFlowers };
      delete newFlowers[flowerId];
      setSelectedFlowers(newFlowers);
    } else {
      // Límite de 20 flores
      const totalFlowers = Object.values(selectedFlowers).reduce((sum, qty) => sum + qty, 0);
      if (totalFlowers + (quantity - (selectedFlowers[flowerId] || 0)) > 20) {
        showAlert('¡Solo puedes seleccionar hasta 20 flores!', 'warning');
        return;
      }

      setSelectedFlowers({ ...selectedFlowers, [flowerId]: quantity });
    }
  };

  const toggleAccessory = (accessoryId) => {
    if (selectedAccessories.includes(accessoryId)) {
      setSelectedAccessories(selectedAccessories.filter(id => id !== accessoryId));
    } else {
      setSelectedAccessories([...selectedAccessories, accessoryId]);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    Object.keys(selectedFlowers).forEach(flowerId => {
      const flower = availableFlowers.find(f => f.id === flowerId);
      if (flower) total += flower.price * selectedFlowers[flowerId];
    });
    selectedAccessories.forEach(accessoryId => {
      const accessory = availableAccessories.find(a => a.id === accessoryId);
      if (accessory) total += accessory.price;
    });
    return total.toFixed(2);
  };

  const getTotalFlowers = () => Object.values(selectedFlowers).reduce((sum, qty) => sum + qty, 0);

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

      {alertData && <Alert type={alertData.type} message={alertData.message} autoClose={true} />}

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
                    <img src={flower.image} alt={flower.name} className="flower-image" />
                    <div className="flower-info">
                      <div className="flower-name">{flower.name}</div>
                      <div className="flower-description">{flower.description}</div>
                      <div className="flower-price">₡{flower.price.toFixed(2)} c/u</div>
                    </div>
                    <div className="flower-controls">
                      <button className="qty-button" onClick={() => updateFlowerQuantity(flower.id, (selectedFlowers[flower.id] || 0) - 1)}>-</button>
                      <span className="qty-display">{selectedFlowers[flower.id] || 0}</span>
                      <button className="qty-button" onClick={() => updateFlowerQuantity(flower.id, (selectedFlowers[flower.id] || 0) + 1)}>+</button>
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
                  <div key={accessory.id} className={`accessory-card ${selectedAccessories.includes(accessory.id) ? 'selected' : ''}`} onClick={() => toggleAccessory(accessory.id)}>
                    <img src={accessory.image} alt={accessory.name} className="accessory-image" />
                    <div className="accessory-info">
                      <div className="accessory-name">{accessory.name}</div>
                      <div className="accessory-description">{accessory.description}</div>
                      <div className="accessory-price">₡{accessory.price.toFixed(2)}</div>
                    </div>
                    {selectedAccessories.includes(accessory.id) && <div className="selected-badge">✓</div>}
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
                  <input type="text" placeholder='Ej: "Ramo de Aniversario"' value={bouquetName} onChange={(e) => setBouquetName(e.target.value)} maxLength={50} />
                </div>
                <div className="form-group">
                  <label>Mensaje Personalizado (opcional)</label>
                  <textarea placeholder='Ej: "Feliz cumpleaños", "Te amo mamá"' value={personalMessage} onChange={(e) => setPersonalMessage(e.target.value)} maxLength={200} rows={4} />
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
                    {/* === CANVAS DEL RAMO COMPLETAMENTE REDISEÑADO === */}
                    {getTotalFlowers() > 0 && (
                      <div className="bouquet-visualization-canvas">
                        
                        {/* FLORES AGRUPADAS VERTICALMENTE */}
                        {(() => {
                          const flowerElements = [];
                          const flatFlowers = [];
                          let flowerCount = 0;
                          
                          // Recopilar flores
                          Object.keys(selectedFlowers).sort().forEach(flowerId => {
                            const flower = availableFlowers.find(f => f.id === flowerId);
                            const quantity = selectedFlowers[flowerId];
                            for (let i = 0; i < quantity && flowerCount < 20; i++) {
                              flatFlowers.push(flower);
                              flowerCount++;
                            }
                          });

                          const totalFlowers = flatFlowers.length;
                          const centerX = 50;
                          
                          // Definir capas verticales MÁS ABIERTAS (estilo abanico)
                          const layers = [
                            { y: 28, count: Math.min(4, totalFlowers), spread: 28 },      // Capa trasera más abierta
                            { y: 35, count: Math.min(5, totalFlowers - 4), spread: 32 },  // Capa media-trasera
                            { y: 42, count: Math.min(6, totalFlowers - 9), spread: 35 },  // Capa media
                            { y: 50, count: Math.min(5, totalFlowers - 15), spread: 30 }  // Capa frontal
                          ];

                          let flowerIndex = 0;

                          layers.forEach((layer, layerIdx) => {
                            const flowersInLayer = Math.min(layer.count, totalFlowers - flowerIndex);
                            
                            for (let i = 0; i < flowersInLayer; i++) {
                              if (flowerIndex >= flatFlowers.length) break;
                              
                              const flower = flatFlowers[flowerIndex];
                              
                              // Distribución horizontal dentro de la capa
                              const spread = layer.spread;
                              const step = flowersInLayer > 1 ? spread / (flowersInLayer - 1) : 0;
                              const x = centerX - (spread / 2) + (step * i);
                              
                              // EFECTO ABANICO: Las flores del centro más arriba
                              const distanceFromCenter = Math.abs(x - centerX); // Distancia del centro
                              const maxDistance = spread / 2;
                              const curveAmount = 8; // Qué tan pronunciada es la curva (ajustable)
                              const curveFactor = (distanceFromCenter / maxDistance); // 0 en centro, 1 en extremos
                              const curveOffset = Math.pow(curveFactor, 2) * curveAmount; // Curva parabólica
                              
                              // Pequeña variación aleatoria
                              const offsetX = (Math.random() - 0.5) * 4;
                              const offsetY = (Math.random() - 0.5) * 3;
                              
                              // Ajustar Y con la curva (las de los lados bajan más)
                              const adjustedY = layer.y + curveOffset;
                              
                              // Rotación suave
                              const rotation = (Math.random() - 0.5) * 15;
                              
                              // Tamaño aumentado
                              const size = 85 + (layerIdx * 5); // Más grandes adelante
                              
                              // Z-index por capa
                              const zIndex = 100 + (layerIdx * 50) + i;
                              
                              flowerElements.push(
                                <div
                                  key={`${flower.id}-${flowerIndex}`}
                                  style={{
                                    position: "absolute",
                                    left: `${x + offsetX}%`,
                                    top: `${adjustedY + offsetY}%`,
                                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                                    zIndex: zIndex,
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    overflow: "hidden"
                                  }}
                                >
                                  <img 
                                    src={flower.image}
                                    alt={flower.name}
                                    style={{
                                      width: "100%",
                                      height: "auto",
                                      display: "block",
                                      objectFit: "cover",
                                      objectPosition: "center 20%", // Mostrar solo la parte superior
                                      filter: "drop-shadow(3px 4px 6px rgba(0,0,0,0.35))"
                                    }}
                                  />
                                </div>
                              );
                              
                              flowerIndex++;
                            }
                          });

                          return flowerElements;
                        })()}

                        {/* ENVOLTORIO MEJORADO - MÁS BAJO */}
                        <div style={{
                          position: "absolute",
                          bottom: "0",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "200px",
                          height: "180px",
                          zIndex: 300
                        }}>
                          {/* Parte trasera */}
                          <div style={{
                            position: "absolute",
                            bottom: "35px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "180px",
                            height: "130px",
                            background: "linear-gradient(to bottom, #f5e6dc 0%, #e8d5c4 40%, #d4bca8 100%)",
                            borderRadius: "90px 90px 20px 20px",
                            clipPath: "polygon(8% 0%, 92% 0%, 78% 100%, 22% 100%)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.2), inset -3px 0 8px rgba(0,0,0,0.1)",
                            zIndex: 50
                          }} />
                          
                          {/* Parte frontal - MÁS BAJA */}
                          <div style={{
                            position: "absolute",
                            bottom: "0",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "180px",
                            height: "100px",
                            background: "linear-gradient(to bottom, #f5e6dc 0%, #e8d5c4 60%, #d4bca8 100%)",
                            borderRadius: "90px 90px 20px 20px",
                            clipPath: "polygon(8% 0%, 92% 0%, 78% 100%, 22% 100%)",
                            boxShadow: "0 6px 16px rgba(0,0,0,0.25), inset 3px 0 8px rgba(0,0,0,0.1)",
                            zIndex: 500
                          }} />
                        </div>

                        {/* ACCESORIOS (LAZOS) */}
                        {selectedAccessories.map(accessoryId => {
                          const accessory = availableAccessories.find(a => a.id === accessoryId);
                          if (!accessory) return null;
                          
                          return (
                            <img 
                              key={accessory.id}
                              src={accessory.image}
                              alt={accessory.name}
                              style={{
                                position: "absolute",
                                bottom: "22%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "120px",
                                zIndex: 600,
                                filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))"
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
                                <img src={accessory.image} alt={accessory.name} className="preview-image" />
                                <span className="preview-text">{accessory.name}</span>
                                <span className="preview-price">₡{accessory.price.toFixed(2)}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* PERSONALIZACIÓN */}
                    {(bouquetName || personalMessage) && (
                      <div className="preview-section">
                        <h3>Personalización</h3>
                        {bouquetName && <div className="preview-detail"><strong>Nombre:</strong> {bouquetName}</div>}
                        {personalMessage && <div className="preview-detail"><strong>Mensaje:</strong> {personalMessage}</div>}
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
                <button className="add-to-cart-button button-primary" disabled={getTotalFlowers() === 0} onClick={handleAddToCart}>
                  {getTotalFlowers() === 0 ? "Selecciona flores" : "Agregar al Carrito"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
