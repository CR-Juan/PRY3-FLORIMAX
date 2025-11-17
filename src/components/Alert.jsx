import React, { useState, useEffect } from "react";
import "./Alert.css";

export function Alert({ 
  type = "info", 
  message, 
  onClose, 
  children, 
  autoClose = false, // Si true, se cierra automáticamente
  duration = 5000,   // duración de la alerta automática en ms
  className = "" 
}) {
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(true);

  // Manejar cierre de alerta
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setVisible(false);
      if (onClose) onClose();
    }, 300); // duración animación
  };

  // Auto cierre si autoClose=true
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  if (!visible) return null;

  return (
    <div className={`alert alert-${type} ${closing ? "closing" : ""} ${className}`}>
      <span className="alert-message">{message}</span>
      {children && <div className="alert-children">{children}</div>}
    </div>
  );
}
