import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/Cliente.js";

const currency = (v) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v);

const ProductoCard = ({ item, onAdd }) => {
  return (
    <article className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="h-40 w-full overflow-hidden">
        <img src={item.imagenUrl} alt={item.nombre} className="h-full w-full object-cover" />
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-gray-900">{item.nombre}</h3>
        <p className="text-sm text-gray-500 mt-1">{currency(item.precio)}</p>
        {typeof item.cantidadDisponible !== 'undefined' && (
          <p className="text-xs text-gray-400 mt-1">Stock: {item.cantidadDisponible}</p>
        )}

        <button
          onClick={() => onAdd(item, 'producto')}
          className="mt-auto w-full rounded-full bg-purple-600 text-white text-sm font-medium py-2 text-center hover:bg-purple-700"
        >
          Agregar
        </button>
      </div>
    </article>
  );
};

const ComboCard = ({ item, onAdd }) => {
  return (
    <article className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="h-40 w-full overflow-hidden flex items-center justify-center bg-gray-50">
        {item.imagenUrl ? (
          <img src={item.imagenUrl} alt={item.nombre} className="h-full w-full object-cover" />
        ) : (
          <div className="text-sm text-gray-500 p-4">Sin imagen</div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-gray-900">{item.nombre}</h3>
        <p className="text-sm text-gray-500 mt-1">{item.descripcion}</p>
        <p className="text-sm text-gray-500 mt-2">{currency(item.precio)}</p>

        <button
          onClick={() => onAdd(item, 'combo')}
          className="mt-auto w-full rounded-full bg-purple-600 text-white text-sm font-medium py-2 text-center hover:bg-purple-700"
        >
          Agregar
        </button>
      </div>
    </article>
  );
};

const CarritoDulceria = ({ carrito, setCarrito, onCheckout }) => {
  const increment = (idx, delta) => {
    setCarrito((c) => {
      const copy = [...c];
      const item = { ...copy[idx] };
      item.cantidad = Math.max(1, Math.min(item.stockMax ?? 9999, item.cantidad + delta));
      copy[idx] = item;
      return copy;
    });
  };

  const remove = (idx) => setCarrito((c) => c.filter((_, i) => i !== idx));

  const total = carrito.reduce((s, it) => s + Number(it.precio) * it.cantidad, 0);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold">Mi carrito</h3>
      {carrito.length === 0 ? (
        <p className="text-sm text-gray-500 mt-2">No hay productos en el carrito.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {carrito.map((it, idx) => (
            <li key={idx} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={it.imagenUrl} alt={it.nombre} className="w-12 h-12 object-cover rounded" />
                <div>
                  <div className="text-sm font-medium">{it.nombre}</div>
                  <div className="text-xs text-gray-500">{currency(it.precio)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => increment(idx, -1)} className="px-2 py-1 bg-gray-100 rounded">-</button>
                <div className="w-6 text-center">{it.cantidad}</div>
                <button onClick={() => increment(idx, +1)} className="px-2 py-1 bg-gray-100 rounded">+</button>
                <button onClick={() => remove(idx)} className="ml-2 text-sm text-red-500">Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm font-semibold">Total: {currency(total)}</div>
        <button
          onClick={onCheckout}
          disabled={carrito.length === 0}
          className="ml-3 rounded-full bg-black text-white px-4 py-2 disabled:opacity-60"
        >
          Ir al pago
        </button>
      </div>
    </div>
  );
};

const Dulceria = () => {
  const [productos, setProductos] = useState([]);
  const [combos, setCombos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setCargando(true);
    setError(null);

    Promise.all([
      apiClient.get('/api/productos'),
      apiClient.get('/api/combos'),
    ])
      .then(([pRes, cRes]) => {
        setProductos(pRes.data || []);
        setCombos(cRes.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Error cargando catálogo');
      })
      .finally(() => setCargando(false));
  }, []);

  const addToCarrito = (item, tipo) => {
    setCarrito((prev) => {
      const idx = prev.findIndex((x) => x.id === item.id && x.tipo === tipo);
      if (idx >= 0) {
        const copy = [...prev];
        const existing = { ...copy[idx] };
        if ((existing.cantidad + 1) > (existing.stockMax ?? 9999)) {
          alert(`Solo quedan ${existing.stockMax} disponibles`);
          return copy;
        }
        existing.cantidad += 1;
        copy[idx] = existing;
        return copy;
      }

      const nuevo = {
        id: item.id,
        tipo,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: 1,
        imagenUrl: item.imagenUrl || item.imageUrl || '',
        stockMax: item.cantidadDisponible ?? 9999,
      };

      if (nuevo.cantidad > nuevo.stockMax) {
        alert(`Solo quedan ${nuevo.stockMax} disponibles`);
        return prev;
      }

      return [...prev, nuevo];
    });
  };

  const handleCheckout = () => {
    if (carrito.length === 0) return;
    navigate('/dulceria/confirmar', { state: { carrito } });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Dulcería</h1>

      {cargando ? (
        <div> cargando... </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <section>
              <h2 className="text-lg font-semibold mb-3">Productos</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {productos.map((p) => (
                  <ProductoCard key={p.id} item={p} onAdd={addToCarrito} />
                ))}
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-lg font-semibold mb-3">Combos</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {combos.map((c) => (
                  <ComboCard key={c.id} item={c} onAdd={addToCarrito} />
                ))}
              </div>
            </section>
          </div>

          <aside className="md:col-span-1">
            <CarritoDulceria carrito={carrito} setCarrito={setCarrito} onCheckout={handleCheckout} />
          </aside>
        </div>
      )}
    </div>
  );
};

export default Dulceria;
