import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Trabajar() {
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [empresas, setEmpresas] = useState<Map<string, { nombre: string, fotoPerfil?: string }>>(new Map());

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/jobs`);
        if (!res.ok) throw new Error("Error cargando ofertas");
        const allJobs = await res.json();
        const activas = allJobs.filter((job: any) => job.estado === "activa");

        const uniqueEmpresaIds: string[] = Array.from(new Set(activas.map((job: any) => job.empresaId)));

        const empresasMap = new Map<string, { nombre: string, fotoPerfil?: string }>();
        await Promise.all(
          uniqueEmpresaIds.map(async (id) => {
            const resEmpresa = await fetch(`http://localhost:3000/api/empresas/${id}`);
            if (resEmpresa.ok) {
              const empresa = await resEmpresa.json();
              empresasMap.set(id, {
                nombre: empresa.nombre,
                fotoPerfil: empresa.fotoPerfil
                  ? empresa.fotoPerfil.startsWith("http")
                    ? empresa.fotoPerfil
                    : `http://localhost:3000${empresa.fotoPerfil}`
                  : undefined,
              });
            }
          })
        );

        setEmpresas(empresasMap);
        setOfertas(activas);
      } catch (err) {
        console.error("❌ Error cargando ofertas o empresas:", err);
      }
    };

    fetchOfertas();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Ofertas de Trabajo Disponibles</h1>
      <p className="mb-6 text-gray-600">Encuentra tu próximo desafío profesional y postula fácilmente.</p>

      <div className="space-y-6">
        {ofertas.length === 0 ? (
          <p className="text-gray-500">No hay ofertas activas por ahora. ¡Vuelve pronto!</p>
        ) : (
          ofertas.map((oferta) => {
            const empresaData = empresas.get(oferta.empresaId);

            return (
              <div key={oferta._id} className="border rounded p-4 bg-white shadow-md hover:shadow-lg hover:shadow-blue-400/80 transform hover:-translate-y-1 transition duration-300 ease-in-out">
                <h2 className="text-xl font-bold mb-1">{oferta.titulo}</h2>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  {empresaData?.fotoPerfil ? (
                    <img
                      src={empresaData.fotoPerfil}
                      alt="Logo Empresa"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold">
                      ?
                    </div>
                  )}
                  <span>{empresaData?.nombre || "Empresa Desconocida"}</span>
                </div>

                <p className="mb-2">{oferta.descripcion?.slice(0, 150)}...</p>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Modalidad: {oferta.modalidad}</p>
                  <Link
                    to={`/postular-oferta/${oferta._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    Postular
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
