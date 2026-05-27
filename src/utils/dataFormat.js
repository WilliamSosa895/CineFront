export const getInitialTime = (showtime) => {
  if (!showtime) return "";

  const rawTime = showtime.time || showtime.showtime || "";

  if (!rawTime) return "";

  if (typeof rawTime === "string") {
    if (/^\d{2}:\d{2}$/.test(rawTime)) {
      return rawTime;
    }

    if (/^\d{2}:\d{2}:\d{2}(\.\d{1,3})?$/.test(rawTime)) {
      return rawTime.slice(0, 5);
    }

    const parsedDate = new Date(rawTime);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toTimeString().slice(0, 5);
    }
  }

  if (rawTime instanceof Date) {
    return rawTime.toTimeString().slice(0, 5);
  }

  return String(rawTime).slice(0, 5);
};

export const getInitialDate = (showtime) => {
  if (!showtime) return "";

  const rawDate = showtime.date || showtime.showtime || "";

  if (!rawDate) return "";

  const parsedDate = new Date(rawDate);
  if (Number.isNaN(parsedDate.getTime())) return "";

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const buildTimestampFromDateAndTime = (dateValue, timeValue) => {
  if (!dateValue || !timeValue) return null;

  const baseDate = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(baseDate.getTime())) return null;

  const [hours, minutes] = timeValue.split(":");
  baseDate.setHours(Number(hours), Number(minutes), 0, 0);

  return baseDate.toISOString();
};

export const formatShowtime = (showtime) => {
  if (!showtime) return "-";
  // Format as HH:MM or return as is if already formatted
  if (typeof showtime === "string" && showtime.includes(":")) {
    return showtime;
  }
  return showtime.toString();
};

export const dataFormat = () => {
  throw new Error("No implementado");
};

export default dataFormat;
