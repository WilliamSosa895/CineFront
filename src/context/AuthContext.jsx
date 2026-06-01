import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../api/UserApi";

const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const isLogged = !!user;
  const isAdmin = user?.role === "ADMIN";
  const usuario = user;


  const login = (userData) => {
    setUser(userData);
    if (userData?.token) {
      localStorage.setItem("token", userData.token);
    }
    localStorage.setItem("user", JSON.stringify(userData));
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setUser(parsed);

      if (!parsed?.idUser && localStorage.getItem("token")) {
        getUserProfile()
          .then((res) => {
            const profile = res?.data;
            if (!profile) return;

            const merged = {
              ...parsed,
              ...profile,
              idUser: profile.idUser ?? parsed?.idUser,
            };
            setUser(merged);
            localStorage.setItem("user", JSON.stringify(merged));
          })
          .catch((err) => {
            console.warn("No se pudo completar el perfil del usuario", err);
          });
      }
    } catch (err) {
      console.warn("Valor inválido en localStorage para 'user', limpiando...", err);
      localStorage.removeItem("user");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, usuario, isLogged, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  }
  return ctx;
}

export { AuthContext };