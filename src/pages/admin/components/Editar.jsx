import { useEffect, useState } from "react";
import { getInitialTime, getInitialDate, buildTimestampFromDateAndTime } from "../../../utils/dataFormat";
import { updateRoom, getAllAdminMovies, getAllRooms } from "../../../api/UserApi";

const Editar = ({ showtime, onCancel, onUpdated }) => {
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [formData, setFormData] = useState({
    movieId: showtime?.movie?.id ?? "",
    roomId: showtime?.room?.idRoom ?? "",
    date: getInitialDate(showtime) || "",
    time: getInitialTime(showtime) || "",
    language: showtime?.languaje || showtime?.language || "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllAdminMovies()
      .then((res) => {
        const data = res.data || res || [];
        const safe = Array.isArray(data) ? data : [];
        setMovies(safe);
      })
      .catch((err) => {
        console.error("Error al cargar películas", err);
      });

    getAllRooms()
      .then((res) => {
        const data = res.data || res || [];
        const safe = Array.isArray(data) ? data : [];
        setRooms(safe);
      })
      .catch((err) => {
        console.error("Error al cargar salas", err);
      });
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.movieId) newErrors.movieId = "La película es obligatoria.";
    if (!formData.roomId) newErrors.roomId = "La sala es obligatoria.";
    if (!formData.date) newErrors.date = "La fecha es obligatoria.";
    if (!formData.time) newErrors.time = "La hora es obligatoria.";
    if (!formData.language) newErrors.language = "El idioma es obligatorio.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (submitError) setSubmitError(null);
  };

  const buildPayload = () => {
    const showtimeValue = buildTimestampFromDateAndTime(formData.date, formData.time);

    return {
      room: Number(formData.roomId),
      movie: Number(formData.movieId),
      showtime: showtimeValue,
      language: formData.language || null,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = buildPayload();

      await updateRoom(showtime.id, payload); 

      onUpdated?.();
      onCancel();
    } catch (err) {
      console.error("Error al actualizar función", err);
      setSubmitError("Hubo un error al actualizar la función. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="z-10 top-0 left-0 w-screen h-screen fixed bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl border border-black/10 p-8 w-[90%] max-w-md">
        <h2 className="text-2xl font-semibold mb-2">Editar función</h2>
        <p className="text-black/70 mb-4">
          Modifica los datos de la función seleccionada.
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          
          <div>
            <label htmlFor="editMovieId" className="block text-xs font-medium text-gray-700 mb-1">
              Película
            </label>
            <select
              id="editMovieId"
              name="movieId"
              value={formData.movieId}
              onChange={handleChange}
              className={`
                w-full rounded-xl p-2.5 px-3
                border ${errors.movieId ? "border-red-500" : "border-gray-300"}
                bg-gray-50
                focus:outline-none
                focus:border-blue-600
                focus:ring-2 focus:ring-blue-500/50
                transition
              `}
            >
              <option value="">Selecciona una película</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>
            {errors.movieId && <p className="text-red-500 text-xs mt-1">{errors.movieId}</p>}
          </div>

          
          <div>
            <label htmlFor="editRoomId" className="block text-xs font-medium text-gray-700 mb-1">
              Sala
            </label>
            <select
              id="editRoomId"
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              className={`
                w-full rounded-xl p-2.5 px-3
                border ${errors.roomId ? "border-red-500" : "border-gray-300"}
                bg-gray-50
                focus:outline-none
                focus:border-blue-600
                focus:ring-2 focus:ring-blue-500/50
                transition
              `}
            >
              <option value="">Selecciona una sala</option>
              {rooms.map((room) => (
                <option key={room.idRoom} value={room.idRoom}>
                  {room.name}
                </option>
              ))}
            </select>
            {errors.roomId && <p className="text-red-500 text-xs mt-1">{errors.roomId}</p>}
          </div>

          
          <div>
            <label htmlFor="editShowtimeDate" className="block text-xs font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              id="editShowtimeDate"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`
                w-full rounded-xl p-2.5 px-3
                border ${errors.date ? "border-red-500" : "border-gray-300"}
                bg-gray-50
                focus:outline-none
                focus:border-blue-600
                focus:ring-2 focus:ring-blue-500/50
                transition
              `}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          <div>
            <label htmlFor="editShowtimeTime" className="block text-xs font-medium text-gray-700 mb-1">
              Hora
            </label>
            <input
              id="editShowtimeTime"
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`
                w-full rounded-xl p-2.5 px-3
                border ${errors.time ? "border-red-500" : "border-gray-300"}
                bg-gray-50
                focus:outline-none
                focus:border-blue-600
                focus:ring-2 focus:ring-blue-500/50
                transition
              `}
            />
            {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
          </div>

          <div>
            <label htmlFor="editShowtimeLanguage" className="block text-xs font-medium text-gray-700 mb-1">
              Idioma
            </label>
            <select
              id="editShowtimeLanguage"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className={`
                w-full rounded-xl p-2.5 px-3
                border ${errors.language ? "border-red-500" : "border-gray-300"}
                bg-gray-50
                focus:outline-none
                focus:border-blue-600
                focus:ring-2 focus:ring-blue-500/50
                transition
              `}
            >
              <option value="">Selecciona un idioma</option>
              <option value="ESPAÑOL_LAT">Español LAT</option>
              <option value="ESPAÑOL_SUB">Español SUB</option>
              <option value="INGLES_SUB">Inglés SUB</option>
              <option value="INGLES_LAT">Inglés LAT</option>
            </select>
            {errors.language && <p className="text-red-500 text-xs mt-1">{errors.language}</p>}
          </div>
          
          {submitError && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
              {submitError}
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              className="flex-1 px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-colors font-semibold cursor-pointer"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="
                flex-1 px-4 py-2 bg-black text-white rounded-lg
                hover:bg-gray-800 transition-colors font-semibold cursor-pointer
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Editar;