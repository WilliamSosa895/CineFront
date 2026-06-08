import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect, useState } from "react";

import { Navbar } from "./components/Navbar";
import LoginPage from "./pages/LoginPage.jsx";

import GestionDeFunciones from "./pages/admin/GestionDeFunciones.jsx";
import GestionProductos from "./pages/admin/GestionProductos.jsx";
import GestionCombos from "./pages/admin/GestionCombos.jsx";
import GestionEstrenos from "./pages/admin/GestionEstrenos.jsx";
import DetalleEstreno from "./pages/DetalleEstreno.jsx";

import CarteleraPage from "./pages/client/CarteleraPage.jsx";
import Dulceria from "./pages/client/Dulceria.jsx";
import FuncionesPage from "./pages/client/FuncionesPage.jsx";
import ConfirmacionDulceria from "./pages/client/ConfirmacionDulceria.jsx";
import SeleccionAsientosPage from "./pages/client/SeleccionAsientosPage.jsx";
import PagoPage from "./pages/client/PagoPage.jsx";
import ProfilePage from "./pages/client/ProfilePage.jsx";
import ProfileHistoryPage from "./pages/client/ProfileHistoryPage.jsx";
import ProfilePaymentsPage from "./pages/client/ProfilePaymentsPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Footer from "./components/Footer.jsx";

import "./App.css";
import AdminRoute from "./components/AdminRoute.jsx";
import ClientRoute from "./components/ClientRoute.jsx";

function AppShell() {
  const { isLogged } = useAuth();
  const location = useLocation();

  const [istryLogin, setIsTryLogin] = useState(false);
  const [istryRegister, setIsTryRegister] = useState(false);

  useEffect(() => {
    if (location.pathname === "/pago" && !isLogged) {
      setIsTryLogin(true);
    }
  }, [location.pathname, isLogged]);

  useEffect(() => {
    if (isLogged) setIsTryLogin(false);
  }, [isLogged]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5fb]">
      <Navbar setIsTryLogin={setIsTryLogin} />

      {istryLogin ? (
        <LoginPage
          setIsTryLogin={setIsTryLogin}
          setIsTryRegister={setIsTryRegister}
        />
      ) : null}

      {istryRegister ? (
        <RegisterPage
          setIsTryRegister={setIsTryRegister}
          setIsTryLogin={setIsTryLogin}
        />
      ) : null}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<CarteleraPage />} />
          <Route path="/cartelera" element={<CarteleraPage />} />
          <Route path="/historial" element={
            <ClientRoute>
              <ProfileHistoryPage />
            </ClientRoute>
          } />

          <Route path="/dulceria" element={<Dulceria />} />
          <Route
            path="/dulceria/confirmar"
            element={
              <ClientRoute>
                <ConfirmacionDulceria />
              </ClientRoute>
            }
          />

          <Route
            path="/gestion-funciones"
            element={
              <AdminRoute>
                <GestionDeFunciones />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/gestion-productos"
            element={
              <AdminRoute>
                <GestionProductos />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/gestion-combos"
            element={
              <AdminRoute>
                <GestionCombos />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/gestion-estrenos"
            element={
              <AdminRoute>
                <GestionEstrenos />
              </AdminRoute>
            }
          />

          <Route path="/estrenos/:id" element={<DetalleEstreno />} />

          <Route path="/funciones" element={<FuncionesPage />} />
          <Route path="/asientos" element={<SeleccionAsientosPage />} />

          <Route path="/pago" element={isLogged ? <PagoPage /> : null} />

          <Route
            path="/perfil"
            element={
              <ClientRoute>
                <ProfilePage />
              </ClientRoute>
            }
          />
          <Route
            path="/pagos"
            element={
              <ClientRoute>
                <ProfilePaymentsPage />
              </ClientRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;