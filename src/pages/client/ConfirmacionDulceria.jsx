import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../api/Cliente.js";
import PaymentCheckoutPage from "./componentsClient/PaymentCheckoutPage";

const currency = (value) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(value);

const ConfirmacionDulceria = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const carrito = state?.carrito || [];

  useEffect(() => {
    if (!carrito || carrito.length === 0) {
      navigate("/dulceria");
    }
  }, [carrito, navigate]);

  const total = useMemo(
    () => carrito.reduce((sum, item) => sum + Number(item.precio) * item.cantidad, 0),
    [carrito]
  );

  const summaryContent = useMemo(() => {
    if (!carrito.length) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Resumen de compra</h2>
        <ul className="space-y-2">
          {carrito.map((item, index) => (
            <li key={`${item.id}-${index}`} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium text-gray-900">{item.nombre}</p>
                <p className="text-gray-500">
                  {currency(item.precio)} x {item.cantidad}
                </p>
              </div>
              <p className="font-medium text-gray-900">
                {currency(Number(item.precio) * item.cantidad)}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
          <span className="text-sm font-semibold text-gray-700">Total</span>
          <span className="text-base font-semibold text-purple-700">{currency(total)}</span>
        </div>
      </div>
    );
  }, [carrito, total]);

  const handlePay = async () => {
    const payload = carrito.map((item) => ({
      productoId: item.id,
      cantidad: item.cantidad,
      precioUnitario: item.precio,
      tipo: item.tipo,
    }));

    const response = await apiClient.post("/api/compras-dulceria", payload);
    const data = response?.data || {};
    const items = Array.isArray(data.items) ? data.items : [];

    return {
      title: "¡Compra exitosa!",
      message: "Tu compra ha sido confirmada correctamente.",
      footerMessage: "Tu comprobante fue enviado a tu correo electrónico.",
      details: [
        { label: "Compra", value: `#${data.id ?? "—"}` },
        {
          label: "Productos",
          value:
            items.length > 0
              ? items.map((item) => `${item.nombreProducto || "Producto"} x${item.cantidad}`).join(", ")
              : carrito.map((item) => `${item.nombre} x${item.cantidad}`).join(", "),
        },
        { label: "Folio", value: data.codigoQr ? "QR generado" : "—" },
      ],
      total: data.total ?? total,
      primaryActionLabel: "Ver mi historial",
      secondaryActionLabel: "Seguir comprando",
      onPrimaryAction: () => navigate("/historial"),
      onSecondaryAction: () => navigate("/dulceria"),
    };
  };

  if (!carrito || carrito.length === 0) {
    return null;
  }

  return (
    <PaymentCheckoutPage
      backTo="/dulceria"
      backLabel="Volver a dulcería"
      pageTitle="Realizar pago"
      summaryContent={summaryContent}
      total={total}
      onPay={handlePay}
    />
  );
};

export default ConfirmacionDulceria;
