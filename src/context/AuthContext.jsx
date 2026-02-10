/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import API from "../api/axios.js";

/**
 * AuthContext provides global user authentication state
 * 
 * Value Object:
 * @typedef {Object} AuthContextValue
 * @property {Object|null} user - Current logged-in user or null
 * @property {boolean} loading - Whether auth state is still loading
 * @property {Function} login - Store token and fetch user profile
 * @property {Function} logout - Clear token and user state
 * @property {Function} refreshUser - Reload user profile from server
 */
export const AuthContext = createContext();

/**
 * AuthProvider wraps app to provide authentication state globally
 * - Loads user on mount if token exists
 * - Provides login/logout/refreshUser functions
 * - Handles JWT token storage in localStorage
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches current user profile from /me endpoint
   * Called on initial load and after login/updates
   */
  async function loadUser() {
    try {
      const res = await API.get("/me");
      setUser(res.data || res.data.user);
    } catch (err) {
      console.error("Failed to load user:", err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Stores JWT token and loads user profile
   * @param {string} token - JWT authentication token from login response
   */
  const login = (token) => {
    localStorage.setItem("token", token);
    loadUser();
  };

  /**
   * Clears authentication token and user state
   * Called on logout button click in Navbar
   */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  /**
   * Refreshes user profile from server
   * Used after profile updates (e.g., wallet address saved)
   * Useful for components (Navbar) to reload user state after API updates
   */
  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
