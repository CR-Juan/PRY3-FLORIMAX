import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function EditProfile() {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();

  const fullUser = JSON.parse(localStorage.getItem("florimax_users"))
    .find(u => u.id === currentUser.id);

  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);

  const currentPassRef = useRef("");
  const newPassRef = useRef("");
  const confirmPassRef = useRef("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSave = () => {
    setError("");
    setSuccess("");

    const updatedData = {};

    if (editName) updatedData.name = name;
    if (editEmail) updatedData.email = email;

    if (editPassword) {
      const currentPass = currentPassRef.current.value;
      const newPass = newPassRef.current.value;
      const confirmPass = confirmPassRef.current.value;

      if (currentPass !== fullUser.password) {
        setError("La contraseña actual es incorrecta.");
        return;
      }

      if (newPass !== confirmPass) {
        setError("Las contraseñas no coinciden.");
        return;
      }

      updatedData.password = newPass;
    }

    if (Object.keys(updatedData).length === 0) {
      setError("No hay cambios para guardar.");
      return;
    }

    try {
      updateUser(updatedData);
      setSuccess("Datos actualizados ✔️");

      setEditName(false);
      setEditEmail(false);
      setEditPassword(false);

      if (currentPassRef.current) currentPassRef.current.value = "";
      if (newPassRef.current) newPassRef.current.value = "";
      if (confirmPassRef.current) confirmPassRef.current.value = "";

    } catch (err) {
      setError(err.message);
    }
  };

  const Card = ({ title, editing, value, onEditClick, children }) => (
    <div
      style={{
        background: "white",
        padding: "18px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          alignItems: "center"
        }}
      >
        <strong>{title}</strong>

        {!editing && (
          <button
            onClick={onEditClick}
            style={{
              background: "#1b8545",
              color: "white",
              padding: "6px 14px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Editar
          </button>
        )}
      </div>

      {!editing ? (
        <p style={{ marginTop: "5px", fontSize: "16px" }}>{value}</p>
      ) : (
        children
      )}
    </div>
  );

  return (
    <>
      <title>FLORIMAX - Actualizar Información</title>

      <div className="auth-page" style={{ paddingTop: "40px" }}>
        <div className="auth-container" style={{ maxWidth: "430px", marginTop: "20px" }}>

          <button
            onClick={() => navigate('/')}
            style={{
              position: 'absolute',
              top: '20px',
              right: '25px',
              fontSize: '26px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#444',
              fontWeight: 'bold'
            }}
          >
            𝗫
          </button>

          <div style={{ textAlign: "center", marginBottom: "25px" }}>
            <h1 style={{ fontSize: "28px" }}>Mi Perfil</h1>
            <p style={{ color: "#777" }}>Gestiona tu información</p>
          </div>

          {error && (
            <div style={{
              background: "#ffe1e1",
              border: "1px solid #ffb3b3",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "10px",
              color: "#b30000"
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: "#e6ffe6",
              border: "1px solid #b3ffb3",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "10px",
              color: "#1b7a1b"
            }}>
              {success}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* NOMBRE */}
            <Card
              title="Nombre"
              editing={editName}
              value={name}
              onEditClick={() => setEditName(true)}
            >
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc"
                }}
                autoFocus
              />
              <button
                onClick={() => {
                  setName(currentUser.name);
                  setEditName(false);
                }}
                style={{
                  marginTop: "10px",
                  background: "#ccc",
                  color: "#333",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Cancelar
              </button>
            </Card>

            {/* CORREO */}
            <Card
              title="Correo"
              editing={editEmail}
              value={email}
              onEditClick={() => setEditEmail(true)}
            >
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc"
                }}
                autoFocus
              />
              <button
                onClick={() => {
                  setEmail(currentUser.email);
                  setEditEmail(false);
                }}
                style={{
                  marginTop: "10px",
                  background: "#ccc",
                  color: "#333",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Cancelar
              </button>
            </Card>

            {/* CONTRASEÑA */}
            <Card
              title="Contraseña"
              editing={editPassword}
              value="***********"
              onEditClick={() => setEditPassword(true)}
            >
              <input
                type="password"
                placeholder="Contraseña actual"
                ref={currentPassRef}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginBottom: "10px"
                }}
              />

              <input
                type="password"
                placeholder="Nueva contraseña"
                ref={newPassRef}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginBottom: "10px"
                }}
              />

              <input
                type="password"
                placeholder="Confirmar contraseña"
                ref={confirmPassRef}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc"
                }}
              />

              <button
                onClick={() => {
                  if (currentPassRef.current) currentPassRef.current.value = "";
                  if (newPassRef.current) newPassRef.current.value = "";
                  if (confirmPassRef.current) confirmPassRef.current.value = "";
                  setEditPassword(false);
                }}
                style={{
                  marginTop: "10px",
                  background: "#ccc",
                  color: "#333",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Cancelar
              </button>
            </Card>

          </div>

          <button
            onClick={handleSave}
            style={{
              marginTop: "25px",
              width: "100%",
              padding: "12px 0",
              borderRadius: "10px",
              background: "#1b8545",
              border: "none",
              color: "white",
              fontSize: "17px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            Guardar cambios ✓
          </button>
        </div>
      </div>
    </>
  );
}
