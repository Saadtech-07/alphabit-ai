import { createContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, getMe } from "../services/authService.js";
import { STORAGE_KEYS } from "../utils/constants.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.TOKEN)
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [toast, setToast] = useState(null);

  const isAuthenticated = !!token && !!user;

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const saveAuth = useCallback((authToken, authUser) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, authToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authUser));
    localStorage.removeItem(STORAGE_KEYS.CHATS);
    setToken(authToken);
    setUser(authUser);
    setShowAuthModal(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.CHATS);
    setToken(null);
    setUser(null);
    setAuthMode("login");
    showToast("Logged out successfully");
  }, [showToast]);

  const login = useCallback(
    async (email, password) => {
      const data = await loginUser({ email, password });
      saveAuth(data.token, data.user);
      showToast("Login Successful");
      return data;
    },
    [saveAuth, showToast]
  );

  const register = useCallback(
    async (username, email, password) => {
      const data = await registerUser({ username, email, password });
      saveAuth(data.token, data.user);
      showToast("Account created successfully");
      return data;
    },
    [saveAuth, showToast]
  );

  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (!storedToken) {
        setShowAuthModal(true);
        setIsLoading(false);
        return;
      }

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
      }

      try {
        const data = await getMe();
        setUser(data.user);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        setToken(storedToken);
      } catch {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        setToken(null);
        setUser(null);
        setShowAuthModal(true);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    login,
    register,
    logout,
    toast,
    showToast,
    dismissToast,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
