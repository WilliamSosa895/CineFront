import { useEffect, useState } from "react";
import apiClient from "../../api/Cliente.js";

const ComboFormModal = ({ initial, onCancel, onSaved }) => {
  const [form, setForm] = useState({
    nombre: initial?.nombre || '',
    descripcion: initial?.descripcion || '',
    precio: initial?.precio || '',
    activo: initial?.activo ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const dto = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: Number(form.precio || 0),
        activo: Boolean(form.activo),
      };

      if (initial && initial.id) {
        await apiClient.put(`/api/combos/${initial.id}`, dto);
      } else {
        await apiClient.post(`/api/combos`, dto);
      }

      onSaved();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data || 'Error al guardar combo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-30 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white rounded p-6 w-[90%] max-w-md">
        <h3 className="text-lg font-semibold mb-3">{initial ? 'Editar' : 'Nuevo'} combo</h3>

        <label className="block text-sm">Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} className="w-full rounded p-2 mb-2 border" />

        <label className="block text-sm">Descripción</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="w-full rounded p-2 mb-2 border" />

        <label className="block text-sm">Precio</label>
        <input type="number" step="0.01" name="precio" value={form.precio} onChange={handleChange} className="w-full rounded p-2 mb-2 border" />

        <label className="flex items-center gap-2 text-sm mb-3"><input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} /> Activo</label>

        {error && <div className="text-red-600 mb-2">{String(error)}</div>}

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-black text-white rounded">{loading ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  );
};

const GestionCombos = () => {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/combos');
      setCombos(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Error cargando combos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar combo?')) return;
    try {
      await apiClient.delete(`/api/combos/${id}`);
      fetch();
    } catch (err) {
      alert('Error eliminando combo');
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Gestión de combos</h1>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="px-4 py-2 bg-black text-white rounded">Nuevo Combo</button>
      </div>

      {loading ? <div>Cargando...</div> : error ? <div className="text-red-600">{error}</div> : (
        <table className="w-full bg-white rounded shadow overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Precio</th>
              <th className="p-3 text-left">Activo</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {combos.map(c => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.nombre}</td>
                <td className="p-3">{c.precio}</td>
                <td className="p-3">{c.activo ? 'Sí' : 'No'}</td>
                <td className="p-3">
                  <button onClick={() => { setEditing(c); setShowModal(true); }} className="mr-2 text-sm text-blue-600">Editar</button>
                  <button onClick={() => handleDelete(c.id)} className="text-sm text-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <ComboFormModal initial={editing} onCancel={() => setShowModal(false)} onSaved={() => { setShowModal(false); fetch(); }} />
      )}
    </div>
  );
};

export default GestionCombos;
