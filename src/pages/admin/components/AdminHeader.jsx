const AdminHeader = ({activeTab,setActiveTab}) => {

    return (
        <header className="mb-6">
            <h1 className="text-[1.8rem] font-semibold mb-1">Panel de administración</h1>
            <p className="text-sm text-black/70">Gestiona las funciones, películas, productos, combos y estrenos desde un solo lugar.</p>

            <div className="flex flex-wrap gap-3 mt-4">
                <button
                    type="button"
                    onClick={() => setActiveTab("funciones")}
                    className={`px-4 py-2 rounded-[20px] border text-sm transition-colors ${
                        activeTab === "funciones"
                            ? "bg-black text-white border-black"
                            : "bg-transparent border-[#ccc] text-gray-700 hover:bg-gray-100"
                    }`}
                >
                    Gestión de funciones
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("peliculas")}
                    className={`px-4 py-2 rounded-[20px] border text-sm transition-colors ${
                        activeTab === "peliculas"
                            ? "bg-black text-white border-black"
                            : "bg-transparent border-[#ccc] text-gray-700 hover:bg-gray-100"
                    }`}
                >
                    Gestión de películas
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("productos")}
                    className={`px-4 py-2 rounded-[20px] border text-sm transition-colors ${
                        activeTab === "productos"
                            ? "bg-black text-white border-black"
                            : "bg-transparent border-[#ccc] text-gray-700 hover:bg-gray-100"
                    }`}
                >
                    Gestión de productos
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("combos")}
                    className={`px-4 py-2 rounded-[20px] border text-sm transition-colors ${
                        activeTab === "combos"
                            ? "bg-black text-white border-black"
                            : "bg-transparent border-[#ccc] text-gray-700 hover:bg-gray-100"
                    }`}
                >
                    Gestión de combos
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("estrenos")}
                    className={`px-4 py-2 rounded-[20px] border text-sm transition-colors ${
                        activeTab === "estrenos"
                            ? "bg-black text-white border-black"
                            : "bg-transparent border-[#ccc] text-gray-700 hover:bg-gray-100"
                    }`}
                >
                    Gestión de estrenos
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;