import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import UserHeader from "./client/componentsClient/UserHeader";
import ProfileTabs from "./client/componentsClient/ProfileTabs";
import apiClient from "../api/Cliente.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { getUserProfile } from "../api/UserApi";

const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("es-MX", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const TarjetaBoleto = ({ item }) => (
  <article className="bg-white border border-gray-200 border-l-4 border-l-blue-500 rounded-2xl shadow-sm px-5 py-4">
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1 text-sm">
        <span className="inline-flex px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-[0.7rem] font-medium">BOLETO</span>
        <p className="m-0 font-semibold text-gray-900">{item.pelicula}</p>
        <p className="m-0 text-[0.8rem] text-gray-500">Función: <span className="font-medium text-gray-800">{item.funcion}</span></p>
        <p className="m-0 text-[0.8rem] text-gray-500">Sala: <span className="font-medium text-gray-800">{item.sala}</span></p>
        <p className="m-0 text-[0.8rem] text-gray-500">Asientos: <span className="font-medium text-gray-800">{item.asientos.join(", ")}</span></p>
        <p className="m-0 text-[0.8rem] text-gray-500">Fecha: <span className="font-medium text-gray-800">{formatDateTime(item.fecha)}</span></p>
      </div>

      <div className="text-right text-xs shrink-0">
        <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-[0.7rem] font-medium text-purple-600 mb-2">Folio: {item.folio}</span>
        <p className="m-0 text-[0.8rem] text-gray-500">Total</p>
        <p className="m-0 font-semibold text-gray-900">{item.total}</p>
      </div>
    </div>
  </article>
);

const TarjetaDulceria = ({ item }) => (
  <article className="bg-white border border-gray-200 border-l-4 border-l-emerald-500 rounded-2xl shadow-sm px-5 py-4">
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1 text-sm">
        <span className="inline-flex px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[0.7rem] font-medium">DULCERIA</span>
        <p className="m-0 font-semibold text-gray-900">{item.items.map((i) => i.nombreProducto).join(", ")}</p>
        <div className="space-y-1">
          {item.items.map((i, index) => (
            <p key={`${item.id}-${index}`} className="m-0 text-[0.8rem] text-gray-500">{i.nombreProducto}: <span className="font-medium text-gray-800">x{i.cantidad}</span></p>
          ))}
        </div>
        <p className="m-0 text-[0.8rem] text-gray-500">Fecha: <span className="font-medium text-gray-800">{formatDateTime(item.fecha)}</span></p>
      </div>

      <div className="text-right text-xs shrink-0">
        <p className="m-0 text-[0.8rem] text-gray-500">Total</p>
        <p className="m-0 font-semibold text-gray-900">{item.total}</p>
      </div>
    </div>
  </article>
);

const Spinner = () => (
  <div className="flex items-center justify-center py-10">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600" />
  </div>
);

export default function Historial() {
  const { usuario } = useContext(AuthContext);
  const [fullName, setFullName] = useState(usuario?.fullName || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [historial, setHistorial] = useState({ boletos: [], dulceria: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (usuario?.fullName) setFullName(usuario.fullName);
    if (usuario?.email) setEmail(usuario.email);
  }, [usuario]);

  useEffect(() => {
    const fetchHistorial = async () => {
      const userId = usuario?.id ?? usuario?.idUser ?? usuario?.id_user;
      if (!userId) {
        try {
          const profileRes = await getUserProfile();
          const profile = profileRes?.data;
          const recoveredId = profile?.idUser ?? profile?.id ?? profile?.id_user;

          if (!recoveredId) {
            setLoading(false);
            return;
          }

          setFullName(profile?.fullName || fullName);
          setEmail(profile?.email || email);

          const res = await apiClient.get(`/api/historial/usuario/${recoveredId}`);
          const raw = res?.data || {};

          const boletos = (Array.isArray(raw.boletos) ? raw.boletos : []).map((b) => ({
            id: b.id ?? b.folio ?? crypto.randomUUID(),
            tipo: "BOLETO",
            pelicula: b.movieTitle ?? b.pelicula ?? "",
            funcion: b.fechaFuncion ?? b.functionDate ?? b.funcion ?? b.fecha ?? "",
            sala: b.roomName ?? b.sala ?? "",
            asientos: String(b.seats ?? b.asientos ?? "").split(",").map((s) => s.trim()).filter(Boolean),
            fecha: b.fecha ?? b.date ?? b.createdAt ?? b.purchaseDate ?? b.functionDate ?? "",
            total: b.totalAmount ?? b.total ?? "",
            folio: b.folio ?? b.id ?? "",
          }));

          const dulceria = (Array.isArray(raw.dulceria) ? raw.dulceria : []).map((d) => ({
            id: d.id ?? crypto.randomUUID(),
            tipo: "DULCERIA",
            fecha: d.fecha ?? d.createdAt ?? d.purchaseDate ?? "",
            total: d.total ?? d.totalAmount ?? "",
            items: (Array.isArray(d.items) ? d.items : []).map((i) => ({
              productoId: i.productoId ?? i.id ?? null,
              nombreProducto: i.nombreProducto ?? i.nombre ?? "",
              cantidad: i.cantidad ?? 0,
            })),
          }));

          const todo = [...boletos, ...dulceria].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
          setHistorial({ boletos, dulceria, todo });
        } catch (err) {
          console.error(err);
          setError("No se pudo cargar tu historial.");
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await apiClient.get(`/api/historial/usuario/${userId}`);
        const raw = res?.data || {};

        const boletos = (Array.isArray(raw.boletos) ? raw.boletos : []).map((b) => ({
          id: b.id ?? b.folio ?? crypto.randomUUID(),
          tipo: "BOLETO",
          pelicula: b.movieTitle ?? b.pelicula ?? "",
          funcion: b.fechaFuncion ?? b.functionDate ?? b.funcion ?? b.fecha ?? "",
          sala: b.roomName ?? b.sala ?? "",
          asientos: String(b.seats ?? b.asientos ?? "").split(",").map((s) => s.trim()).filter(Boolean),
          fecha: b.fecha ?? b.date ?? b.createdAt ?? b.purchaseDate ?? b.functionDate ?? "",
          total: b.totalAmount ?? b.total ?? "",
          folio: b.folio ?? b.id ?? "",
        }));

        const dulceria = (Array.isArray(raw.dulceria) ? raw.dulceria : []).map((d) => ({
          id: d.id ?? crypto.randomUUID(),
          tipo: "DULCERIA",
          fecha: d.fecha ?? d.createdAt ?? d.purchaseDate ?? "",
          total: d.total ?? d.totalAmount ?? "",
          items: (Array.isArray(d.items) ? d.items : []).map((i) => ({
            productoId: i.productoId ?? i.id ?? null,
            nombreProducto: i.nombreProducto ?? i.nombre ?? "",
            cantidad: i.cantidad ?? 0,
          })),
        }));

        const todo = [...boletos, ...dulceria].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setHistorial({ boletos: boletos, dulceria: dulceria, todo });
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar tu historial.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [usuario, fullName, email]);

  const todo = useMemo(() => historial.todo || [], [historial]);

  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-10 pb-10">
        <UserHeader fullName={fullName} email={email} />
        <ProfileTabs />

        <section className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-6">
          <h3 className="text-[1rem] font-semibold text-gray-900 m-0">Historial de Compras</h3>
          <p className="mt-1 mb-5 text-[0.85rem] text-gray-500">Tus últimas compras y reservaciones</p>

          {loading && <Spinner />}

          {!loading && error && (
            <div className="text-center py-8">
              <p className="text-sm text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-full bg-black text-white px-4 py-2 text-sm font-medium"
              >
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && todo.length === 0 && (
            <div className="text-center py-10 space-y-4">
              <p className="text-sm text-gray-600">Aún no tienes compras</p>
              <div className="flex items-center justify-center gap-3">
                <Link to="/cartelera" className="rounded-full bg-purple-600 text-white px-4 py-2 text-sm font-medium hover:bg-purple-700">
                  Ir a cartelera
                </Link>
                <Link to="/dulceria" className="rounded-full bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black">
                  Ir a dulcería
                </Link>
              </div>
            </div>
          )}

          {!loading && !error && todo.length > 0 && (
            <div className="space-y-4">
              {todo.map((item) =>
                item.tipo === "BOLETO" ? (
                  <TarjetaBoleto key={`boleto-${item.id}`} item={item} />
                ) : (
                  <TarjetaDulceria key={`dulceria-${item.id}`} item={item} />
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
