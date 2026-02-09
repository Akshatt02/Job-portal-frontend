import { createContext, useState, useEffect } from "react";
import API from "../api/axios.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function loadUser() {
    try {
      const res = await API.get("/me");
      setUser(res.data);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) loadUser();
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    loadUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
