import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Trabajadores() {
  const [trabajadores, setTrabajadores] = useState<any[]>([]);
  const [modalidadFiltro, setModalidadFiltro] = useState("todas");

  useEffect(() => {
    const fetchTrabajadores = async () => {
      try {
        // Obtener filtro de modalidad desde URL
        const urlParams = new URLSearchParams(window.location.search);
        const modalidadUrl = urlParams.get('modalidad');
        
        const res = await fetch(`http://localhost:3000/api/users/trabajadores`);
        if (!res.ok) throw new Error("Error cargando trabajadores");
        const data = await res.json();

        const transformados = data.map((t: any) => {
          let fotoFinal = "/default-user.png";
          if (
            t.fotoPerfil &&
            typeof t.fotoPerfil === "string" &&
            t.fotoPerfil.trim() !== "" &&
            !t.fotoPerfil.includes("undefined")
          ) {
            fotoFinal = t.fotoPerfil.startsWith("http")
              ? t.fotoPerfil
              : `http://localhost:3000${t.fotoPerfil}`;
          }
          return { ...t, fotoPerfil: fotoFinal };
        });

        setTrabajadores(transformados);
        
        // Aplicar filtro de URL si existe
        if (modalidadUrl) {
          setModalidadFiltro(modalidadUrl);
        }
      } catch (err) {
        console.error("❌ Error cargando trabajadores:", err);
      }
    };

    fetchTrabajadores();
  }, []);

  const trabajadoresFiltrados =
    modalidadFiltro === "todas"
      ? trabajadores
      : trabajadores.filter(
          (t) =>
            t.modalidadPreferida?.toLowerCase() === modalidadFiltro.toLowerCase()
        );

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-800">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">
            👥 Trabajadores Disponibles
          </h1>
          <p className="text-gray-600">
            Encuentra profesionales activos y revisa sus perfiles para contratar.
          </p>
        </div>

        <div>
          <label htmlFor="modalidad" className="mr-2 text-sm font-medium">
            Filtrar por modalidad:
          </label>
          <select
            id="modalidad"
            className="border rounded px-3 py-1 text-sm"
            value={modalidadFiltro}
            onChange={(e) => setModalidadFiltro(e.target.value)}
          >
            <option value="todas">Todas</option>
            <option value="remoto">Remoto</option>
            <option value="fraccional">Fraccional</option>
            <option value="tiempo completo">Tiempo completo</option>
            <option value="presencial">Presencial</option>
            <option value="híbrida">Híbrido</option>
          </select>
        </div>
      </div>

      {trabajadoresFiltrados.length === 0 ? (
        <p className="text-gray-500">No hay trabajadores disponibles para esta modalidad.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trabajadoresFiltrados.map((t) => (
            <div
              key={t._id}
              className="bg-white border rounded-b-md shadow-md hover:shadow-blue-400/80 hover:-translate-y-1 transition transform duration-150 ease-in-out flex flex-col"
            >
              <div className="flex items-center gap-3 mb-2 p-4">
                <img
                  src={t.fotoPerfil}
                  alt={`Foto de ${t.nombre}`}
                  className="w-10 h-10 rounded-full object-cover border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/default-user.png";
                  }}
                />
                <h2 className="text-lg font-bold">{t.nombre}</h2>
              </div>

              <div className="px-4 pb-4 flex-grow">
                <p className="text-sm text-gray-600 mb-2">
                  Modalidad preferida:{" "}
                  <span className="font-semibold">{t.modalidadPreferida || "No especificada"}</span>
                </p>
                <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                  {t.experiencia || "Sin presentación registrada."}
                </p>
              </div>

              <Link
                to={`/perfil-trabajador/${t.uid}`}
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 mt-auto rounded-b-md"
              >
                Ver Perfil
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
