import React from "react";
import { useNavigate } from "react-router-dom";

const ModalCompraExitosa = ({
  onClose,
  onPrimaryAction,
  onSecondaryAction,
  primaryActionLabel = "Volver a cartelera",
  secondaryActionLabel,
  title = "¡Compra exitosa!",
  message = "Tu compra ha sido confirmada correctamente.",
  footerMessage = "El comprobante ha sido enviado a tu correo electrónico.",
  details,
  movieTitle,
  hall,
  seats,
  folio,
  total,
}) => {
  const navigate = useNavigate();

  const handlePrimaryAction = () => {
    if (onClose) onClose();
    if (onPrimaryAction) {
      onPrimaryAction();
      return;
    }
    navigate("/");
  };

  const handleSecondaryAction = () => {
    if (onClose) onClose();
    if (onSecondaryAction) onSecondaryAction();
  };

  const safeSeats = Array.isArray(seats) ? seats : seats ? [seats] : [];
  const normalizedDetails = Array.isArray(details)
    ? details
    : [
        movieTitle ? { label: "Película", value: movieTitle } : null,
        hall ? { label: "Sala", value: hall } : null,
        safeSeats.length > 0 ? { label: "Asientos", value: safeSeats.join(", ") } : null,
        folio ? { label: "Folio", value: folio } : null,
      ].filter(Boolean);

  const formatMoney = (value) => {
    if (typeof value === "number" && Number.isFinite(value)) return value.toFixed(2);
    const num = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
    return Number.isFinite(num) ? num.toFixed(2) : "0.00";
  };

  return (
    <div
      className="
        fixed inset-0 bg-[rgba(0,0,0,0.35)]
        flex items-center justify-center
        z-50
      "
    >
      <div
        className="
          w-full max-w-[380px] mx-4 bg-white
          rounded-[16px] border border-[#ddd]
          shadow-xl
          relative
          overflow-hidden
        "
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-emerald-400" />

        <button
          onClick={onClose}
          className="
            absolute right-4 top-4
            text-gray-400 hover:text-gray-600
            text-lg
          "
        >
          ✕
        </button>

        <div className="p-6 pb-5">
          <div className="flex justify-center mb-4">
            <div
              className="
                w-[60px] h-[60px]
                rounded-full
                bg-emerald-50
                border border-emerald-400
                flex items-center justify-center
                text-[1.7rem] text-emerald-500
              "
            >
              ✔
            </div>
          </div>

          <h2 className="text-center m-0 text-[1.25rem] font-semibold text-gray-900">
            {title}
          </h2>

          <p className="text-center text-[0.9rem] text-gray-600 mt-1 mb-4">
            {message}
          </p>

          <hr className="my-3" />

          <div className="mb-3 text-[0.9rem] space-y-1.5">
            {normalizedDetails.map((detail) => (
              <p key={detail.label} className="my-[0.15rem]">
                <strong className="text-gray-800">{detail.label}:</strong>{" "}
                <span className="text-gray-700">{detail.value || "—"}</span>
              </p>
            ))}
          </div>

          <div className="mt-2 mb-4">
            <div
              className="
                flex items-center justify-between
                px-3 py-2.5
                rounded-[10px]
                bg-purple-50
              "
            >
              <span className="text-[0.9rem] text-gray-700">Total pagado</span>
              <span className="text-[1.1rem] font-semibold text-purple-700">
                ${formatMoney(total)}
              </span>
            </div>
          </div>

          <p className="text-center text-[0.85rem] mb-[1.2rem] text-gray-500">
            {footerMessage}
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={handlePrimaryAction}
              className="
                w-full py-[0.55rem]
                border border-gray-300
                rounded-[8px]
                bg-white
                text-[0.9rem] text-gray-800
                hover:bg-gray-50
                transition
              "
            >
              {primaryActionLabel}
            </button>

            {secondaryActionLabel && (
              <button
                onClick={handleSecondaryAction}
                className="
                  w-full py-[0.55rem]
                  border border-transparent
                  rounded-[8px]
                  bg-purple-600
                  text-[0.9rem] text-white
                  hover:bg-purple-700
                  transition
                "
              >
                {secondaryActionLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCompraExitosa;