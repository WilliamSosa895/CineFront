import React from 'react';

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (e) {
    return iso;
  }
};

const EstrenoCard = ({ estreno, onVerDetalle }) => {
  return (
    <article className="bg-white rounded-2xl shadow-sm overflow-hidden relative cursor-pointer" onClick={() => onVerDetalle(estreno.id)}>
      <div className="relative h-44 w-full overflow-hidden">
        <img src={estreno.imagenUrl} alt={estreno.titulo} className="h-full w-full object-cover" />
        <span className="absolute top-2 left-2 bg-yellow-400 text-xs text-black font-semibold px-2 py-1 rounded">Próximamente</span>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900">{estreno.titulo}</h3>
        <p className="text-xs text-gray-500 mt-1">{formatDate(estreno.fechaEstreno)}</p>
      </div>
    </article>
  );
};

const SeccionEstrenos = ({ estrenos, onVerDetalle }) => {
  if (!estrenos || estrenos.length === 0) return null;

  return (
    <section className="py-6 bg-blue-50 rounded-xl mb-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Próximamente</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {estrenos.map((e) => (
            <EstrenoCard key={e.id} estreno={e} onVerDetalle={onVerDetalle} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeccionEstrenos;
