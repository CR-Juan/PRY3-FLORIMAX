import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


export function EditProfile() {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const updatedData = {
      name,
      email
    };

    if (password.trim() !== "") {
      updatedData.password = password;
    }

    try {
      updateUser(updatedData);
      setSuccess("Datos actualizados correctamente ✔️");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* Botón cerrar */}
        <button
          className="close-login-button"
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            fontSize: '22px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#333',
            transition: '0.2s',
          }}
        >
          𝗫
        </button>

        <div className="auth-header">
          <h1 className="auth-title">Editar Perfil</h1>
          <p className="auth-subtitle">Actualiza tu información personal</p>
        </div>
      </div>
    </div>
  );
}
