import { createContext, useState, useContext, useEffect } from 'react';

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
    const storedUser = localStorage.getItem('florimax_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Registrar nuevo usuario
  const register = (userData) => {
    // En producción, esto haría una llamada a tu backend
    // Por ahora, simulamos el registro
    
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
      email: newUser.email
    };

    setCurrentUser(userSession);
    localStorage.setItem('florimax_user', JSON.stringify(userSession));

    return userSession;
  };

  // Iniciar sesión
  const login = (email, password) => {
    // En producción, esto haría una llamada a tu backend
    // Por ahora, verificamos contra localStorage
    
    const existingUsers = JSON.parse(localStorage.getItem('florimax_users') || '[]');
    
    // Buscar usuario
    const user = existingUsers.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error('Correo o contraseña incorrectos');
    }

    // Crear sesión
    const userSession = {
      id: user.id,
      name: user.name,
      email: user.email
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
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}