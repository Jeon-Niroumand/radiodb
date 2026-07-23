import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    console.log("refreshUser() called");

    try {
      const { data } = await api.get("/auth/me");

      console.log("AUTH RESPONSE:", data);

      setUser(data.user);

      console.log("SETTING USER:", data.user);
    } catch (err) {
      console.log("AUTH ERROR:", err);
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);
      setUser(null);
    } finally {
      console.log("LOADING FALSE");
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  function login() {
    const url = `${process.env.REACT_APP_API_URL}/auth/google`;

    console.log("Login URL:", url);
    alert(url);

    window.location.href = url;
  }

  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}