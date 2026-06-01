import { useEffect, useState } from "react";
import apiClient from "../../api/Cliente.js";

const ProductoFormModal = ({ initial, onCancel, onSaved }) => {
  const [form, setForm] = useState({
    nombre: initial?.nombre || '',
    precio: initial?.precio || '',
    cantidadDisponible: initial?.cantidadDisponible ?? 0,
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFile = (e) => setFile(e.target.files?.[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const dto = {
        nombre: form.nombre,
        precio: Number(form.precio || 0),
        cantidadDisponible: Number(form.cantidadDisponible || 0),
      };

      const fd = new FormData();
      fd.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
      if (file) fd.append('imagen', file);

      if (initial && initial.id) {
        await apiClient.put(`/api/productos/${initial.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await apiClient.post(`/api/productos`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      onSaved();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-30 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white rounded p-6 w-[90%] max-w-lg">
        <h3 className="text-lg font-semibold mb-3">{initial ? 'Editar' : 'Nuevo'} producto</h3>

        <label className="block text-sm">Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} className="w-full rounded p-2 mb-2 border" />

        <label className="block text-sm">Precio</label>
        <input type="number" step="0.01" name="precio" value={form.precio} onChange={handleChange} className="w-full rounded p-2 mb-2 border" />

        <label className="block text-sm">Cantidad disponible</label>
        <input type="number" name="cantidadDisponible" value={form.cantidadDisponible} onChange={handleChange} className="w-full rounded p-2 mb-2 border" />

        <label className="block text-sm">Imagen (opcional)</label>
        <input type="file" accept="image/*" onChange={handleFile} className="block w-full mb-3" />

        {error && <div className="text-red-600 mb-2">{String(error)}</div>}

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-black text-white rounded">{loading ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  );
};

const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/productos');
      setProductos(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Error cargando productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar producto?')) return;
    try {
      await apiClient.delete(`/api/productos/${id}`);
      fetch();
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409) {
        alert(err?.response?.data || 'No se puede eliminar: pertenece a un combo activo');
      } else {
        alert('Error eliminando');
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Gestión de productos</h1>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="px-4 py-2 bg-black text-white rounded">Nuevo Producto</button>
      </div>

      {loading ? <div>Cargando...</div> : error ? <div className="text-red-600">{error}</div> : (
        <table className="w-full bg-white rounded shadow overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Mini</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Precio</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-3"><img src={p.imagenUrl} alt={p.nombre} className="w-12 h-8 object-cover rounded" /></td>
                <td className="p-3">{p.nombre}</td>
                <td className="p-3">{p.precio}</td>
                <td className="p-3">{p.cantidadDisponible}</td>
                <td className="p-3">
                  <button onClick={() => { setEditing(p); setShowModal(true); }} className="mr-2 text-sm text-blue-600">Editar</button>
                  <button onClick={() => handleDelete(p.id)} className="text-sm text-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <ProductoFormModal initial={editing} onCancel={() => setShowModal(false)} onSaved={() => { setShowModal(false); fetch(); }} />
      )}
    </div>
  );
};

export default GestionProductos;
