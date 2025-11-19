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
                    {/* === CANVAS DEL RAMO === */}
                    {getTotalFlowers() > 0 && (
                      <div className="bouquet-visualization-canvas">
                        
                        <div className="bouquet-wrap" style={{
                          position: "absolute",
                          bottom: 40,  //Para subirlo o bajarlp
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "140px",
                          height: "160px",
                          background: "linear-gradient(to bottom, #f5e6dc, #e0c4b0)",
                          borderRadius: "60px 60px 10px 10px",
                          clipPath: "polygon(0 0, 100% 0, 80% 100%, 20% 100%)",
                          zIndex: 50,
                          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        }} />

                        {/* FLORES (hasta 20) */}
                        {(() => {
                          const flowerElements = [];
                          const flatFlowers = [];
                          let flowerCount = 0;
                          Object.keys(selectedFlowers).sort().forEach(flowerId => {
                            const flower = availableFlowers.find(f => f.id === flowerId);
                            const quantity = selectedFlowers[flowerId];
                            for (let i = 0; i < quantity && flowerCount < 20; i++) {
                              flatFlowers.push(flower);
                              flowerCount++;
                            }
                          });

                          const layers = [4, 6, 5, 5];
                          const baseY = 60;
                          const layerSpacing = 40;
                          const horizontalSpacing = 5.5;
                          let flowerIndex = 0;

                          layers.forEach((count, layerIdx) => {
                            const layerY = baseY + layerIdx * layerSpacing;
                            const totalWidth = (count - 1) * horizontalSpacing;
                            const startX = 50 - totalWidth / 2;

                            for (let i = count - 1; i >= 0; i--) {
                              if (flowerIndex >= flatFlowers.length) break;
                              const flower = flatFlowers[flowerIndex];
                              const x = startX + i * horizontalSpacing;
                              const offset = i - (count - 1) / 2;
                              const curveY = layerY - Math.pow(offset, 2) * 1.8;

                              flowerElements.push(
                                <img key={`${flower.id}-${flowerIndex}`} src={flower.image} className="bouquet-flower-image"
                                  style={{
                                    position: "absolute",
                                    left: `calc(${x}%)`,
                                    top: `${curveY}px`,
                                    width: "50px",
                                    transform: `translate(-50%, -50%) rotate(${Math.random() * 14 - 7}deg)`,
                                    zIndex: 100 + flowerIndex,
                                    filter: "drop-shadow(1.5px 1.5px 3px rgba(0,0,0,0.25))"
                                  }}
                                />
                              );
                              flowerIndex++;
                            }
                          });

                          return flowerElements;
                        })()}

                        <div
                          className="bouquet-wrap-front"
                          style={{
                            position: "absolute",
                            bottom: -20,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "140px",
                            height: "160px",
                            background: "linear-gradient(to bottom, #f5e6dc, #e0c4b0)",
                            borderRadius: "60px 60px 10px 10px",
                            clipPath: `polygon(0% 0%, 100% 0%, ${80}% 100%, ${20}% 100%)`,
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                            zIndex: 500,
                          }}
                        />

                        {/* ACCESORIOS */}
                        {selectedAccessories.map(accessoryId => {
                          const accessory = availableAccessories.find(a => a.id === accessoryId);
                          if (!accessory) return null;
                          const isWrap = accessory.name.includes("Papel");
                          const isBow = accessory.name.includes("Cinta");
                          return (
                            <img key={accessory.id} src={accessory.image} alt="" className="bouquet-accessory-image"
                              style={{
                                position: "absolute",
                                bottom: isWrap ? 0 : "10%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: isWrap ? "140px" : "80px",
                                zIndex: isWrap ? 30 : 300,
                                opacity: isWrap ? 0.9 : 1
                              }}
                            />
                          )
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
