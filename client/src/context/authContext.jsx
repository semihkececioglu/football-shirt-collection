import { createContext, useState, useEffect, useContext, useMemo, useCallback } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const register = useCallback(async (userData) => {
    const data = await authService.register(userData);
    setUser(data.data);
    return data;
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.data);
    return data;
  }, []);

  const googleAuth = useCallback(async (credential) => {
    const data = await authService.googleAuth(credential);
    setUser(data.data);
    return data;
  }, []);

  const setUsername = useCallback(async (username) => {
    const data = await authService.setUsername(username);
    setUser(prev => ({ ...prev, ...data.data }));
    return data;
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    register,
    login,
    googleAuth,
    setUsername,
    updateUser,
    logout,
    isAuthenticated: !!user,
    needsUsername: user && !user.isProfileComplete,
  }), [user, loading, register, login, googleAuth, setUsername, updateUser, logout]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
