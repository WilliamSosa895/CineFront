import { useLocation } from "react-router-dom";
import {
  createPurchase,
  getShowtimeDetails,
  getMyPurchases,
} from "../../api/UserApi";
import PaymentCheckoutPage from "./componentsClient/PaymentCheckoutPage";

export default function PagoPage() {
  const location = useLocation();
  const {
    idShowtime,
    total = 0,
    selectedSeats = [],
    movieTitle = "Película",
    hall = "",
  } = location.state || {};

  const totalNumber = Number(total) || 0;

  const seatCodeToIndex = (code) => {
    const row = code.charCodeAt(0) - "A".charCodeAt(0);
    const col = parseInt(code.slice(1), 10) - 1;
    return [row, col];
  };

  const handlePay = async () => {
    if (!idShowtime) {
      throw new Error("No se encontró la función para procesar el pago.");
    }

    const detailsRes = await getShowtimeDetails(idShowtime);
    const matrix = detailsRes?.data?.seats || [];
    const rowCount = matrix.length;
    const colCount = matrix[0]?.length || 0;

    const seatsConverted = selectedSeats
      .map(seatCodeToIndex)
      .filter(([r, c]) => r >= 0 && c >= 0 && r < rowCount && c < colCount);

    if (seatsConverted.length !== selectedSeats.length) {
      throw new Error("Hay asientos inválidos para esta sala. Vuelve a seleccionar.");
    }

    const anyTaken = seatsConverted.some(([r, c]) => matrix[r]?.[c] !== 0);
    if (anyTaken) {
      throw new Error("Uno o más asientos ya no están disponibles. Vuelve a seleccionar.");
    }

    await createPurchase({ idShowtime, seats: seatsConverted });

    try {
      const purchasesRes = await getMyPurchases();
      const list = purchasesRes?.data || [];
      const last = [...list]
        .sort((a, b) => (Number(a?.id) || 0) - (Number(b?.id) || 0))
        .pop();

      return {
        movieTitle,
        hall,
        seats: selectedSeats,
        folio: last?.folio || "—",
        total: last?.totalAmount ?? totalNumber,
        primaryActionLabel: "Volver a cartelera",
        footerMessage: "El boleto ha sido enviado a tu correo electrónico.",
      };
    } catch (error) {
      console.error(error);
      return {
        movieTitle,
        hall,
        seats: selectedSeats,
        folio: "—",
        total: totalNumber,
        primaryActionLabel: "Volver a cartelera",
        footerMessage: "El boleto ha sido enviado a tu correo electrónico.",
      };
    }
  };

  return (
    <PaymentCheckoutPage
      backTo="/asientos"
      backLabel="Volver a asientos"
      pageTitle="Realizar pago"
      total={totalNumber}
      onPay={handlePay}
    />
  );
}
