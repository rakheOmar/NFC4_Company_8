import { createContext, useContext, useEffect, useState } from "react";
import axios from "../../lib/axios";

const AuthContext = createContext();

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://nfc4-company-8.onrender.com",
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCurrentUser = async () => {
    const res = await axiosInstance.get("/users/me");
    return res.data;
  };

  const logoutUser = async () => {
    await axiosInstance.post("/users/logout");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data);
      } catch (error) {
        console.warn(
          "Not logged in or token invalid:",
          error?.response?.data?.message || error.message
        );
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.warn(
        "Logout failed or user already logged out:",
        error?.response?.data?.message || error.message
      );
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
