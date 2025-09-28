// src/pages/EmpresaPostulantes.tsx

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { auth } from "../firebase";

export default function EmpresaPostulantes() {
  const { jobId } = useParams();
  const [oferta, setOferta] = useState<any>(null);
  const [postulaciones, setPostulaciones] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showEntrevista, setShowEntrevista] = useState<string | null>(null);
  const [showNota, setShowNota] = useState<string | null>(null);
  const [notas, setNotas] = useState<{[key:string]: string[]}>({});
  const [entrevistas, setEntrevistas] = useState<{[key:string]: string[]}>({});
  const [inputNota, setInputNota] = useState("");
  const [inputEntrevista, setInputEntrevista] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idToken = await auth.currentUser?.getIdToken();

        // Traer datos de la oferta
        const resOferta = await fetch(`http://localhost:3000/api/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!resOferta.ok) throw new Error("Error obteniendo oferta");
        const ofertaData = await resOferta.json();
        setOferta(ofertaData);

        // Traer postulaciones a la oferta
        const resPost = await fetch(`http://localhost:3000/api/postulaciones/oferta/${jobId}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!resPost.ok) throw new Error("Error obteniendo postulaciones");
        const posts = await resPost.json();
        setPostulaciones(posts);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [jobId]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleUpdateEstado = async (postId: string, estado: string) => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const res = await fetch(`http://localhost:3000/api/postulaciones/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ estado }),
      });
      if (!res.ok) throw new Error("Error actualizando estado");
      setPostulaciones((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, estado } : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      {oferta && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{oferta.titulo}</h1>
          <p className="text-gray-600">{oferta.descripcion}</p>
        </div>
      )}

      {postulaciones.length === 0 ? (
        <p>No hay postulantes para esta oferta aún.</p>
      ) : (
        postulaciones.map((p) => (
          <div key={p._id} className="border rounded p-4 mb-4 bg-white shadow">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">{p.usuarioId.nombre}</p>
                <p className="text-sm text-gray-500">Estado: {p.estado}</p>
              </div>
              <button
                onClick={() => toggleExpand(p._id)}
                className="text-blue-600 underline"
              >
                {expandedId === p._id ? "Ocultar" : "Ver Detalles"}
              </button>
            </div>

            {expandedId === p._id && (
              <div className="mt-4 border-t pt-4 text-sm space-y-2">
                <p><strong>Mensaje:</strong> {p.mensaje || "Sin mensaje."}</p>

                <p>
                  <strong>CV:</strong>{" "}
                  {p.usuarioId.cv ? (
                    <a
                      href={p.usuarioId.cv}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver CV
                    </a>
                  ) : (
                    "No tiene CV en línea"
                  )}
                </p>

                <p>
                  <strong>Video:</strong>{" "}
                  {p.usuarioId.videoPresentacion ? (
                    <a
                      href={p.usuarioId.videoPresentacion}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver Video
                    </a>
                  ) : (
                    "No subido"
                  )}
                </p>

                {p.preguntasRespondidas?.length > 0 && (
                  <div className="pt-2">
                    <h4 className="font-semibold mb-1">Respuestas:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      {p.preguntasRespondidas.map(
                        (pr: any, idx: number) => (
                          <li key={idx}>
                            <strong>{pr.pregunta}:</strong> {pr.respuesta || "No respondida"}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2 mt-2 flex-wrap">
                  <button
                    onClick={() => handleUpdateEstado(p._id, "preseleccionado")}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Preseleccionar
                  </button>
                  <button
                    onClick={() => handleUpdateEstado(p._id, "rechazado")}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Rechazar
                  </button>
                  <button
                    onClick={() => setShowEntrevista(p._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Agendar entrevista
                  </button>
                  <button
                    onClick={() => setShowNota(p._id)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Agregar nota al perfil
                  </button>
                </div>
                {/* Mostrar entrevistas y notas */}
                {entrevistas[p._id]?.length > 0 && (
                  <div className="mt-2">
                    <strong>Entrevistas:</strong>
                    <ul className="list-disc pl-6">
                      {entrevistas[p._id].map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {notas[p._id]?.length > 0 && (
                  <div className="mt-2">
                    <strong>Notas:</strong>
                    <ul className="list-disc pl-6">
                      {notas[p._id].map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Modal entrevista */}
                {showEntrevista === p._id && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow max-w-md w-full">
                      <h3 className="font-bold mb-2">Agendar entrevista</h3>
                      <textarea
                        className="w-full border rounded p-2 mb-2"
                        rows={3}
                        placeholder="Detalles de la entrevista (fecha, hora, link, etc)"
                        value={inputEntrevista}
                        onChange={e => setInputEntrevista(e.target.value)}
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          className="bg-gray-300 px-3 py-1 rounded"
                          onClick={() => { setShowEntrevista(null); setInputEntrevista(""); }}
                        >Cancelar</button>
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                          onClick={() => {
                            setEntrevistas(prev => ({
                              ...prev,
                              [p._id]: [...(prev[p._id] || []), inputEntrevista]
                            }));
                            setShowEntrevista(null);
                            setInputEntrevista("");
                          }}
                          disabled={!inputEntrevista.trim()}
                        >Guardar</button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Modal nota */}
                {showNota === p._id && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow max-w-md w-full">
                      <h3 className="font-bold mb-2">Agregar nota al perfil</h3>
                      <textarea
                        className="w-full border rounded p-2 mb-2"
                        rows={3}
                        placeholder="Escribe una nota sobre este postulante"
                        value={inputNota}
                        onChange={e => setInputNota(e.target.value)}
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          className="bg-gray-300 px-3 py-1 rounded"
                          onClick={() => { setShowNota(null); setInputNota(""); }}
                        >Cancelar</button>
                        <button
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                          onClick={() => {
                            setNotas(prev => ({
                              ...prev,
                              [p._id]: [...(prev[p._id] || []), inputNota]
                            }));
                            setShowNota(null);
                            setInputNota("");
                          }}
                          disabled={!inputNota.trim()}
                        >Guardar</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </main>
  );
}
