import { useEffect, useState } from "react";
import apiClient from "../../api/Cliente.js";

const EstrenoFormModal = ({ initial, onCancel, onSaved }) => {
  const [form, setForm] = useState({
    titulo: initial?.titulo || '',
    fechaEstreno: initial?.fechaEstreno ? initial.fechaEstreno.split('T')[0] : '',
    sinopsis: initial?.sinopsis || '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorFecha, setErrorFecha] = useState(null);

  const minDate = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === 'fechaEstreno') setErrorFecha(null);
  };

  const handleFile = (e) => setFile(e.target.files?.[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dto = { titulo: form.titulo, fechaEstreno: form.fechaEstreno, sinopsis: form.sinopsis };
      const fd = new FormData();
      fd.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
      if (file) fd.append('imagen', file);

      if (initial && initial.id) {
        await apiClient.put(`/api/estrenos/${initial.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await apiClient.post(`/api/estrenos`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      onSaved();
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      const msg = err?.response?.data || '';
      if (status === 400 && msg && msg.toString().toLowerCase().includes('fecha')) {
        setErrorFecha(msg);
      } else {
        alert('Error al guardar estreno');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-30 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white rounded p-6 w-[90%] max-w-md">
        <h3 className="text-lg font-semibold mb-3">{initial ? 'Editar' : 'Nuevo'} estreno</h3>

        <label className="block text-sm">Título</label>
        <input name="titulo" value={form.titulo} onChange={handleChange} className="w-full rounded p-2 mb-2 border" required />

        <label className="block text-sm">Fecha de estreno</label>
        <input type="date" name="fechaEstreno" min={minDate} value={form.fechaEstreno} onChange={handleChange} className="w-full rounded p-2 mb-2 border" required />
        {errorFecha && <div className="text-red-600 text-sm mb-2">{String(errorFecha)}</div>}

        <label className="block text-sm">Sinopsis</label>
        <textarea name="sinopsis" value={form.sinopsis} onChange={handleChange} className="w-full rounded p-2 mb-2 border" />

        <label className="block text-sm">Imagen {initial ? '(opcional)' : '(requerida)'}</label>
        <input type="file" accept="image/*" onChange={handleFile} className="block w-full mb-3" required={!initial} />

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-black text-white rounded">{loading ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  );
};

const GestionEstrenos = () => {
  const [estrenos, setEstrenos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/estrenos');
      setEstrenos(res.data || []);
    } catch (err) {
      console.error(err);
      alert('Error cargando estrenos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar estreno?')) return;
    try {
      await apiClient.delete(`/api/estrenos/${id}`);
      fetch();
    } catch (err) {
      alert('Error eliminando estreno');
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Gestión de estrenos</h1>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="px-4 py-2 bg-black text-white rounded">Nuevo Estreno</button>
      </div>

      {loading ? <div>Cargando...</div> : (
        <table className="w-full bg-white rounded shadow overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Mini</th>
              <th className="p-3 text-left">Título</th>
              <th className="p-3 text-left">Fecha estreno</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estrenos.map(e => (
              <tr key={e.id} className="border-t">
                <td className="p-3">{e.id}</td>
                <td className="p-3"><img src={e.imagenUrl} alt={e.titulo} className="w-12 h-8 object-cover rounded" /></td>
                <td className="p-3">{e.titulo}</td>
                <td className="p-3">{e.fechaEstreno?.split('T')[0] ?? e.fechaEstreno}</td>
                <td className="p-3">
                  <button onClick={() => { setEditing(e); setShowModal(true); }} className="mr-2 text-sm text-blue-600">Editar</button>
                  <button onClick={() => handleDelete(e.id)} className="text-sm text-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <EstrenoFormModal initial={editing} onCancel={() => setShowModal(false)} onSaved={() => { setShowModal(false); fetch(); }} />
      )}
    </div>
  );
};

export default GestionEstrenos;
