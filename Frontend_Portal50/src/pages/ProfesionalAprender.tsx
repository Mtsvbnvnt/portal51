// src/pages/ProfesionalAprender.tsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

interface Profesional {
  _id: string;
  uid: string;
  nombre: string;
  fotoPerfil?: string;
  especialidades: string[];
  experiencia: string;
  pais?: string;
  rating: number;
  totalReseñas: number;
  certificaciones?: string[];
}

interface VideoIntro {
  _id: string;
  titulo: string;
  url: string;
  duracion: number;
  descripcion: string;
}

interface Reseña {
  _id: string;
  estudiante: {
    nombre: string;
    fotoPerfil?: string;
  };
  rating: number;
  comentario: string;
  fecha: string;
  util: number;
}

interface EstadoPago {
  estado: "inicial" | "cargando" | "en_proceso" | "exitoso" | "cancelado" | "error";
  mensaje?: string;
}

const MODALIDADES_CLASE = [
  { id: "unica", nombre: "Clase única", precio: 25000, descripcion: "1 sesión de 60 minutos" },
  { id: "pack3", nombre: "Pack 3 clases", precio: 65000, descripcion: "3 sesiones + seguimiento" },
  { id: "pack5", nombre: "Pack 5 clases", precio: 100000, descripcion: "5 sesiones + proyecto" },
  { id: "mentoria", nombre: "Mentoría continua", precio: 150000, descripcion: "Acompañamiento mensual" }
];

export default function ProfesionalAprender() {
  const { uid } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [profesional, setProfesional] = useState<Profesional | null>(null);
  const [videos, setVideos] = useState<VideoIntro[]>([]);
  const [reseñas, setReseñas] = useState<Reseña[]>([]);
  const [videoActual, setVideoActual] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState<string>("");
  const [estadoPago, setEstadoPago] = useState<EstadoPago>({ estado: "inicial" });
  const [filtroReseñas, setFiltroReseñas] = useState<string>("recientes");
  const [paginaReseñas, setPaginaReseñas] = useState(1);

  useEffect(() => {
    if (!uid) return;
    
    Promise.all([
      fetchProfesional(),
      fetchVideos(),
      fetchReseñas()
    ]).finally(() => setLoading(false));
  }, [uid]);

  const fetchProfesional = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/profesional/${uid}`);
      if (!res.ok) throw new Error("Profesional no encontrado");
      const data = await res.json();
      setProfesional(data);
    } catch (err) {
      setError("No pudimos cargar el perfil del profesional");
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/profesionales/${uid}/videos-intro`);
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (err) {
      console.error("Error cargando videos:", err);
    }
  };

  const fetchReseñas = async () => {
    try {
      const params = new URLSearchParams({
        filtro: filtroReseñas,
        pagina: paginaReseñas.toString()
      });
      const res = await fetch(`http://localhost:3000/api/profesionales/${uid}/reseñas?${params}`);
      if (res.ok) {
        const data = await res.json();
        setReseñas(data);
      }
    } catch (err) {
      console.error("Error cargando reseñas:", err);
    }
  };

  const iniciarPago = () => {
    if (!user) {
      navigate(`/login?return=/aprender/profesional/${uid}`);
      return;
    }
    setMostrarModalPago(true);
  };

  const procesarPago = async () => {
    if (!modalidadSeleccionada) return;

    setEstadoPago({ estado: "cargando", mensaje: "Preparando tu solicitud..." });

    try {
      // Simular proceso de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      setEstadoPago({ estado: "en_proceso", mensaje: "Procesando pago..." });
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simular éxito o error (90% éxito)
      if (Math.random() > 0.1) {
        setEstadoPago({ 
          estado: "exitoso", 
          mensaje: "¡Tu compra fue registrada! Pronto recibirás un email para agendar." 
        });
        
        // Cerrar modal después de 3 segundos
        setTimeout(() => {
          setMostrarModalPago(false);
          setEstadoPago({ estado: "inicial" });
        }, 3000);
      } else {
        setEstadoPago({ 
          estado: "error", 
          mensaje: "Hubo un problema con el pago. Intenta nuevamente." 
        });
      }
    } catch (err) {
      setEstadoPago({ 
        estado: "error", 
        mensaje: "Error de conexión. Verifica tu internet e intenta nuevamente." 
      });
    }
  };

  const renderEstrellas = (rating: number) => {
    return "⭐".repeat(Math.round(rating));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="flex gap-4 mb-6">
              <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="aspect-video bg-gray-300 rounded mb-6"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !profesional) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error || "Profesional no encontrado"}</p>
          <button 
            onClick={() => navigate("/aprender")}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Volver al catálogo
          </button>
        </div>
      </main>
    );
  }

  const modalidadActual = MODALIDADES_CLASE.find(m => m.id === modalidadSeleccionada);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header profesional */}
      <section className="bg-white py-8 px-4 border-b">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-6 mb-6">
            <img
              src={profesional.fotoPerfil ? `http://localhost:3000${profesional.fotoPerfil}` : "/default-user.png"}
              alt={profesional.nombre}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              onError={(e) => { (e.target as HTMLImageElement).src = "/default-user.png"; }}
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{profesional.nombre}</h1>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-lg">{renderEstrellas(profesional.rating)}</span>
                  <span className="text-gray-600">({profesional.totalReseñas} reseñas)</span>
                </div>
                {profesional.pais && (
                  <span className="text-gray-500">📍 {profesional.pais}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {profesional.especialidades.map((esp, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {esp}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">{profesional.experiencia}</p>
          
          {profesional.certificaciones && profesional.certificaciones.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">🏆 Certificaciones</h3>
              <ul className="text-sm text-gray-600">
                {profesional.certificaciones.map((cert, idx) => (
                  <li key={idx}>• {cert}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={iniciarPago}
            className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition text-lg font-semibold"
          >
            🎓 Tomar clases
          </button>
        </div>
      </section>

      {/* Videos introductorios */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">📹 Videos introductorios</h2>
          
          {videos.length === 0 ? (
            <div className="bg-white p-6 rounded-lg text-center">
              <p className="text-gray-500">Este profesional aún no ha subido videos introductorios.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Video principal */}
              {videoActual && (
                <div className="bg-white rounded-lg overflow-hidden shadow">
                  <div className="aspect-video">
                    <video 
                      controls 
                      key={videoActual}
                      className="w-full h-full"
                      onError={() => setVideoActual(null)}
                    >
                      <source src={`http://localhost:3000${videoActual}`} type="video/mp4" />
                      Tu navegador no soporta la reproducción de video.
                    </video>
                  </div>
                </div>
              )}
              
              {/* Lista de videos */}
              <div className="grid gap-4 md:grid-cols-2">
                {videos.map((video) => (
                  <div key={video._id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer"
                       onClick={() => setVideoActual(video.url)}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600">▶️</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{video.titulo}</h3>
                        <p className="text-sm text-gray-600">{video.descripcion}</p>
                        <span className="text-xs text-gray-500">{video.duracion} min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Reseñas */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">💬 Opiniones de estudiantes</h2>
            <select
              value={filtroReseñas}
              onChange={(e) => setFiltroReseñas(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="recientes">Más recientes</option>
              <option value="utiles">Más útiles</option>
              <option value="alto">Rating alto</option>
              <option value="bajo">Rating bajo</option>
            </select>
          </div>

          {reseñas.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aún no hay reseñas para este profesional.</p>
          ) : (
            <div className="space-y-6">
              {reseñas.map((reseña) => (
                <div key={reseña._id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={reseña.estudiante.fotoPerfil ? `http://localhost:3000${reseña.estudiante.fotoPerfil}` : "/default-user.png"}
                      alt={reseña.estudiante.nombre}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/default-user.png"; }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{reseña.estudiante.nombre}</span>
                        <span className="text-yellow-500">{renderEstrellas(reseña.rating)}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(reseña.fecha).toLocaleDateString("es-CL")}
                      </p>
                      <p className="text-gray-700">{reseña.comentario}</p>
                      <button className="text-xs text-gray-500 mt-2 hover:text-blue-600">
                        👍 Útil ({reseña.util})
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {reseñas.length >= 5 && (
                <div className="text-center">
                  <button 
                    onClick={() => setPaginaReseñas(paginaReseñas + 1)}
                    className="text-blue-600 hover:underline"
                  >
                    Ver más reseñas
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Modal de pago */}
      {mostrarModalPago && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            {estadoPago.estado === "inicial" && (
              <>
                <h3 className="text-xl font-bold mb-4">Selecciona modalidad</h3>
                <div className="space-y-3 mb-6">
                  {MODALIDADES_CLASE.map((modalidad) => (
                    <label key={modalidad.id} className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="modalidad"
                        value={modalidad.id}
                        checked={modalidadSeleccionada === modalidad.id}
                        onChange={(e) => setModalidadSeleccionada(e.target.value)}
                      />
                      <div className="flex-1">
                        <div className="font-semibold">{modalidad.nombre}</div>
                        <div className="text-sm text-gray-600">{modalidad.descripcion}</div>
                        <div className="text-green-600 font-semibold">${modalidad.precio.toLocaleString()} CLP</div>
                      </div>
                    </label>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setMostrarModalPago(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={procesarPago}
                    disabled={!modalidadSeleccionada}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    Continuar
                  </button>
                </div>
              </>
            )}

            {estadoPago.estado === "cargando" && (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>{estadoPago.mensaje}</p>
              </div>
            )}

            {estadoPago.estado === "en_proceso" && (
              <div className="text-center py-8">
                <div className="animate-pulse w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-4"></div>
                <p>{estadoPago.mensaje}</p>
              </div>
            )}

            {estadoPago.estado === "exitoso" && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">✓</span>
                </div>
                <h3 className="text-xl font-bold text-green-600 mb-2">¡Compra exitosa!</h3>
                <p className="text-gray-600">{estadoPago.mensaje}</p>
                {modalidadActual && (
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <p className="font-semibold">{modalidadActual.nombre}</p>
                    <p className="text-sm text-gray-600">con {profesional.nombre}</p>
                  </div>
                )}
              </div>
            )}

            {(estadoPago.estado === "cancelado" || estadoPago.estado === "error") && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">✗</span>
                </div>
                <h3 className="text-xl font-bold text-red-600 mb-2">
                  {estadoPago.estado === "cancelado" ? "Pago cancelado" : "Error en el pago"}
                </h3>
                <p className="text-gray-600 mb-4">{estadoPago.mensaje}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setMostrarModalPago(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
                  >
                    Volver al perfil
                  </button>
                  <button
                    onClick={() => setEstadoPago({ estado: "inicial" })}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
