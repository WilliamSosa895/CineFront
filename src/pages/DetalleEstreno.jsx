import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../api/Cliente.js";

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (e) {
    return iso;
  }
};

export default function DetalleEstreno() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [estreno, setEstreno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/estrenos/${id}`);
        setEstreno(res.data);
      } catch (err) {
        console.error(err);
        setError('No se encontró el estreno');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="p-4">Cargando...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!estreno) return null;

  return (
    <main className="flex-1 min-h-[70vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="mb-4 text-sm text-gray-600">← Volver</button>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="h-80 w-full overflow-hidden">
            <img src={estreno.imagenUrl} alt={estreno.titulo} className="h-full w-full object-cover" />
          </div>

          <div className="p-6">
            <div className="mb-3">
              <span className="inline-block bg-yellow-400 text-black font-semibold px-3 py-1 rounded">Próximamente</span>
            </div>

            <h1 className="text-2xl font-semibold mb-2">{estreno.titulo}</h1>
            <div className="text-sm text-gray-500 mb-4">{formatDate(estreno.fechaEstreno)}</div>

            <div className="text-gray-700 whitespace-pre-line">{estreno.sinopsis}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
