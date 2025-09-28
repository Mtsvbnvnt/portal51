import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function PostularOferta() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<any>(null);
  const [empresa, setEmpresa] = useState<any>(null);
  const [mensaje, setMensaje] = useState("");
  const [respuestas, setRespuestas] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/jobs/${jobId}`);
        if (!res.ok) throw new Error("Error cargando la oferta");
        const data = await res.json();
        setJob(data);

        const empresaId = data.empresa?._id || data.empresaId;
        if (empresaId) {
          const empresaRes = await fetch(`http://localhost:3000/api/empresas/${empresaId}`);
          if (empresaRes.ok) {
            const empresaData = await empresaRes.json();

            if (empresaData.fotoPerfil && empresaData.fotoPerfil !== "") {
              empresaData.fotoPerfil = empresaData.fotoPerfil.startsWith("http")
                ? empresaData.fotoPerfil
                : `http://localhost:3000${empresaData.fotoPerfil}`;
            } else {
              empresaData.fotoPerfil = null;
            }
            setEmpresa(empresaData);
          }
        }
      } catch (err) {
        console.error("❌ Error cargando la oferta o empresa:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    for (let i = 0; i < job.preguntas.length; i++) {
      if (job.preguntas[i].obligatoria && !respuestas[i]) {
        alert(`Por favor responde la pregunta: ${job.preguntas[i].pregunta}`);
        return;
      }
    }

    try {
      const idToken = await auth.currentUser?.getIdToken();
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user || !user._id) {
        alert("Sesión inválida. Vuelve a iniciar sesión.");
        return;
      }

      const payload = {
        ofertaId: jobId,
        usuarioId: user._id,
        mensaje,
        preguntasRespondidas: job.preguntas.map((p: any, i: number) => ({
          pregunta: p.pregunta,
          respuesta: respuestas[i] || ""
        })),
      };

      const res = await fetch(`http://localhost:3000/api/postulaciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        alert("⚠️ Ya estás postulado a esta oferta. No puedes postular dos veces.");
        return;
      }

      if (!res.ok) throw new Error("Error enviando postulación");

      alert("✅ Postulación enviada correctamente");
      navigate("/trabajar");
    } catch (err) {
      console.error("❌ Error enviando postulación:", err);
    }
  };

  if (loading) return <p className="p-6">Cargando oferta...</p>;
  if (!job) return <p className="p-6">Oferta no encontrada</p>;

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">{job.titulo}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Columna Detalles */}
        <div className="bg-white p-4 border rounded shadow">
          {/* ✅ Banner dentro de la columna */}
          {empresa?.fotoPerfil && (
            <img
              src={empresa.fotoPerfil}
              alt="Banner Empresa"
              className="w-full h-40 object-cover rounded mb-4"
            />
          )}

          <h2 className="text-xl font-semibold mb-2">Descripción de la Oferta</h2>
          <div
            className="mb-4 whitespace-pre-line"
            dangerouslySetInnerHTML={{
              __html: job.descripcion.replace(/\n/g, "<br />"),
            }}
          ></div>

          <div className="space-y-1 text-sm">
            <p><strong>Modalidad:</strong> {job.modalidad}</p>
            <p><strong>Jornada:</strong> {job.jornada}</p>
            <p><strong>Ubicación:</strong> {job.ubicacion || "No especificada"}</p>
            <p><strong>Salario: $</strong> {job.salario || "No especificado"}</p>
            <p><strong>Etiquetas:</strong> {(job.etiquetas || []).join(", ")}</p>
          </div>

          {job.preguntas.length === 0 && (
            <div className="mt-4 p-3 bg-orange-100 border border-orange-300 rounded text-orange-800 text-sm">
              ⚠️ Esta oferta no tiene preguntas previas, la postulación es directa con entrevista.
            </div>
          )}
        </div>

        {/* Columna Formulario */}
        <form onSubmit={handleSubmit} className="bg-white p-4 border rounded shadow space-y-4">
          <h2 className="text-xl font-semibold mb-2">Completa tu Postulación</h2>

          <div>
            <label className="block font-semibold mb-1">Carta de Presentación (opcional)</label>
            <textarea
              className="w-full border rounded p-2"
              rows={4}
              placeholder="Escribe un mensaje o carta de presentación..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
            ></textarea>
          </div>

          {job.preguntas.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Preguntas de la Empresa</h3>
              {job.preguntas.map((p: any, i: number) => (
                <div key={i}>
                  <label className="block mb-1">
                    {p.pregunta} {p.obligatoria && <span className="text-red-600">*</span>}
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={respuestas[i] || ""}
                    onChange={(e) => setRespuestas({ ...respuestas, [i]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Enviar Postulación
          </button>
        </form>
      </div>
    </main>
  );
}
