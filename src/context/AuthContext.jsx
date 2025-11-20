import { createContext, useState, useContext, useEffect } from 'react';
import { users as defaultUsers } from "../data/users";

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar la autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

// Provider de autenticación
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {

  const storedUsers = localStorage.getItem("florimax_users");

  // Si no existe lista en localStorage, cargar la lista default
  if (!storedUsers) {
    localStorage.setItem("florimax_users", JSON.stringify(defaultUsers));
  }

  const storedUser = localStorage.getItem("florimax_user");
  if (storedUser) {
    setCurrentUser(JSON.parse(storedUser));
  }

  setIsLoading(false);
}, []);

  // Registrar nuevo usuario
  const register = (userData) => {
    // Obtener usuarios existentes
    const existingUsers = JSON.parse(localStorage.getItem('florimax_users') || '[]');
    
    // Verificar si el email ya existe
    const userExists = existingUsers.find(user => user.email === userData.email);
    if (userExists) {
      throw new Error('Este correo ya está registrado');
    }

    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString(),
      accountType: "user",          // Solo las cuentas de cliente se pueden crear desde
      name: userData.name,
      email: userData.email,
      password: userData.password, // En producción, esto estaría hasheado
      createdAt: new Date().toISOString()
    };

    // Guardar en la lista de usuarios
    existingUsers.push(newUser);
    localStorage.setItem('florimax_users', JSON.stringify(existingUsers));

    // Crear sesión
    const userSession = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      accountType: newUser.accountType 
    };

    setCurrentUser(userSession);
    localStorage.setItem('florimax_user', JSON.stringify(userSession));

    return userSession;
  };

  // Iniciar sesión
  const login = (email, password) => {
  // Normalizar email para evitar problemas
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Obtener usuarios guardados
  let existingUsers = JSON.parse(localStorage.getItem('florimax_users'));

  // 2. Si no existen o están vacíos → usar usuarios del archivo
  if (!existingUsers || existingUsers.length === 0) {
    existingUsers = defaultUsers;
    localStorage.setItem('florimax_users', JSON.stringify(defaultUsers));
  }

  // 3. Buscar correo EXACTO sin importar mayúsculas
  const userByEmail = existingUsers.find(
    u => u.email.trim().toLowerCase() === normalizedEmail
  );

  if (!userByEmail) {
    throw new Error("Este correo no está registrado");
  }

  // 4. Validar contraseña
  if (userByEmail.password !== password) {
    throw new Error("Contraseña incorrecta");
  }

  // 5. Crear sesión
  const userSession = {
    id: userByEmail.id,
    name: userByEmail.name,
    email: userByEmail.email,
    accountType: userByEmail.accountType
  };

  setCurrentUser(userSession);
  localStorage.setItem('florimax_user', JSON.stringify(userSession));

  return userSession;
};

  // Cerrar sesión
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('florimax_user');
  };

  // Actualizar datos del usuario (EDIT PROFILE)
  const updateUser = (updatedData) => {
    if (!currentUser) return;

    // 1) Actualizar lista de usuarios
    const users = JSON.parse(localStorage.getItem("florimax_users")) || [];

    const updatedUsers = users.map((user) =>
      user.id === currentUser.id
        ? { ...user, ...updatedData }
        : user
    );

    localStorage.setItem("florimax_users", JSON.stringify(updatedUsers));

    // 2) Actualizar la sesión actual
    const updatedSession = { ...currentUser, ...updatedData };

    setCurrentUser(updatedSession);
    localStorage.setItem("florimax_user", JSON.stringify(updatedSession));
  };

  // Verificar si está autenticado
  const isAuthenticated = () => {
    return currentUser !== null;
  };

  const value = {
    currentUser,
    isLoading,
    register,
    login,
    logout,
    isAuthenticated,
    updateUser, 
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

