import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

type EstadoDisponibilidad = "disponible" | "con condiciones" | "no disponible";

const disponibilidadInfo: Record<EstadoDisponibilidad, { texto: string; color: string }> = {
  disponible: {
    texto: "🟢 Disponible para trabajar",
    color: "bg-green-100 text-green-800 border-green-300",
  },
  "con condiciones": {
    texto: "🟡 Disponible con condiciones",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  "no disponible": {
    texto: "🔴 No disponible por ahora",
    color: "bg-red-100 text-red-800 border-red-300",
  },
};

export default function PerfilTrabajador() {
  const { id } = useParams<{ id: string }>();
  const [trabajador, setTrabajador] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrabajador = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users/uid/${id}`);
        if (!res.ok) throw new Error("Error cargando trabajador");
        const data = await res.json();

        // Foto de perfil
        if (
          data.fotoPerfil &&
          typeof data.fotoPerfil === "string" &&
          data.fotoPerfil.trim() !== "" &&
          !data.fotoPerfil.includes("undefined")
        ) {
          data.fotoPerfil = data.fotoPerfil.startsWith("http")
            ? data.fotoPerfil
            : `http://localhost:3000${data.fotoPerfil}`;
        } else {
          data.fotoPerfil = "/default-user.png";
        }

        setTrabajador(data);
      } catch (err) {
        console.error("❌ Error cargando trabajador:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrabajador();
  }, [id]);

  if (loading) return <p className="p-6">Cargando perfil...</p>;
  if (!trabajador) return <p className="p-6">Trabajador no encontrado.</p>;

  // Banner de disponibilidad (solo visual)
  const disponibilidad = (trabajador.disponibilidad as EstadoDisponibilidad) || "disponible";
  const banner = disponibilidadInfo[disponibilidad] ?? disponibilidadInfo["disponible"];

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-800 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        👤 Perfil de {trabajador.nombre}
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Izquierda */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <img
            src={trabajador.fotoPerfil}
            alt={`Foto de perfil de ${trabajador.nombre}`}
            className="w-48 h-48 rounded-full object-cover border shadow mb-4"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/default-user.png";
            }}
          />

          {trabajador.cv ? (
            <a
              href={`http://localhost:3000/api/users/download/${trabajador.cv.split('/').pop()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm mb-2"
            >
              📄 Descargar CV
            </a>
          ) : (
            <p className="text-sm text-gray-600 text-center mt-2">
              ⚠️ Este usuario no tiene CV disponible.
            </p>
          )}

          <button
            onClick={() => alert("Aquí podrías abrir un formulario de contacto")}
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            📩 Contactar Profesional
          </button>
        </div>

        {/* Derecha */}
        <div className="flex-grow">
          <div className={`border rounded px-4 py-2 mb-4 inline-block ${banner.color}`}>
            {banner.texto}
          </div>

          <div className="space-y-2 mb-4">
            <p><strong>Email:</strong> {trabajador.email}</p>
            <p><strong>Teléfono:</strong> {trabajador.telefono || "No disponible"}</p>
            <p><strong>País:</strong> {trabajador.pais || "No especificado"}</p>
            <p><strong>Modalidad Preferida:</strong> {trabajador.modalidadPreferida || "No especificada"}</p>
            <div>
              <strong>Descripción:</strong>
              <p className="whitespace-pre-line mt-1">
                {trabajador.experiencia || "Sin descripción registrada."}
              </p>
            </div>
          </div>

          {trabajador.videoPresentacion ? (
            <div className="mb-4">
              <h2 className="font-bold mb-2">🎥 Video de Presentación</h2>
              <video
                src={trabajador.videoPresentacion}
                controls
                className="w-full max-w-xl rounded shadow"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-600 mb-4">
              🎥 Este usuario no tiene video de presentación.
            </p>
          )}

          <Link
            to="/quiero-contratar/trabajadores"
            className="text-blue-600 underline"
          >
            ← Volver a Trabajadores
          </Link>
        </div>
      </div>
    </main>
  );
}
