// src/pages/CursoDetalle.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { auth } from "../firebase";

interface Clase {
  _id: string;
  numeroClase: number;
  titulo: string;
  descripcion: string;
  duracionMinutos: number;
  videoUrl?: string;
  materialesAdicionales?: Array<{
    nombre: string;
    url: string;
    tipo: 'pdf' | 'link' | 'archivo';
  }>;
  objetivos: string[];
  prerequisitos?: string[];
  orden: number;
}

interface Evaluacion {
  _id: string;
  evaluador: {
    nombre: string;
    fotoPerfil: string;
  };
  estrellas: number;
  comentario: string;
  fecha: string;
}

export default function CursoDetalle() {
  const { id } = useParams();
  const [curso, setCurso] = useState<any>(null);
  const [clases, setClases] = useState<Clase[]>([]);
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [claseActiva, setClaseActiva] = useState<number>(0);

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/cursos/${id}`);
        if (!res.ok) throw new Error("Error al obtener curso");
        const data = await res.json();
        setCurso(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchClases = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/clases/curso/${id}`);
        if (!res.ok) throw new Error("Error al obtener clases");
        const data = await res.json();
        setClases(data);
      } catch (err) {
        console.error('Error cargando clases:', err);
        // Si no hay clases, mostrar un mensaje en lugar de datos de ejemplo
        setClases([]);
      }
    };

    const fetchEvaluaciones = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/evaluacion/curso/${id}`);
        if (!res.ok) throw new Error("Error al obtener evaluaciones");
        const data = await res.json();
        setEvaluaciones(data);
      } catch (err) {
        console.error(err);
      }
    };

    Promise.all([fetchCurso(), fetchClases(), fetchEvaluaciones()]).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center">Cargando...</div>;
  }

  if (!curso) {
    return <div className="p-10 text-center text-red-500">No se pudo cargar el curso.</div>;
  }

  const estrellas = "⭐".repeat(Math.round(curso.calificacionPromedio || 0));
  const claseSeleccionada = clases[claseActiva] || null;

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header con navegación */}
        <div className="mb-6">
          <Link to="/aprender" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Volver a cursos
          </Link>
        </div>

        {/* Layout principal con dos columnas */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna izquierda: Lista de clases */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4">📚 Contenido del curso</h2>
              
              {clases.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-2">🔄 Este curso aún no tiene clases disponibles</p>
                  <p className="text-sm">El profesional está preparando el contenido</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {clases.map((clase, index) => (
                    <div
                      key={clase._id}
                      onClick={() => setClaseActiva(index)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        claseActiva === index
                          ? 'bg-blue-100 border-l-4 border-blue-600'
                          : 'hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm mb-1">
                            Clase {clase.numeroClase}: {clase.titulo}
                          </p>
                          <p className="text-xs text-gray-500">
                            ⏱️ {clase.duracionMinutos} min
                          </p>
                        </div>
                        {claseActiva === index && (
                          <div className="text-blue-600">
                            ▶️
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Información adicional del curso */}
              <div className="mt-6 pt-6 border-t">
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Precio:</span>{' '}
                    <span className="text-green-600 font-semibold">
                      ${curso.precio?.toLocaleString()} CLP
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Modalidad:</span>{' '}
                    <span className="capitalize">{curso.tipoPago}</span>
                  </div>
                  <div>
                    <span className="font-medium">Total clases:</span>{' '}
                    {clases.length}
                  </div>
                  {curso.calificacionPromedio > 0 && (
                    <div>
                      <span className="font-medium">Valoración:</span>{' '}
                      <span className="text-yellow-500">
                        {estrellas} ({curso.calificacionPromedio.toFixed(1)})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón de inscripción */}
              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={() => alert('Próximamente: funcionalidad de pago')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
                >
                  💳 Inscribirse al curso
                </button>
              </div>
            </div>
          </div>

          {/* Columna derecha: Información del curso y clase seleccionada */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información general del curso */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {curso.categoria}
                </span>
                {curso.activo && (
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    ✅ Activo
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-4">{curso.titulo}</h1>
              <p className="text-gray-700 mb-6 leading-relaxed">{curso.descripcion}</p>

              {/* Profesional */}
              {curso.profesionalId && (
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={
                      curso.profesionalId.fotoPerfil
                        ? `http://localhost:3000${curso.profesionalId.fotoPerfil}`
                        : "/default-user.png"
                    }
                    alt="Profesional"
                    className="w-16 h-16 rounded-full border object-cover"
                    onError={(e) => (e.currentTarget.src = "/default-user.png")}
                  />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Instructor</p>
                    <Link
                      to={`/perfil-trabajador/${curso.profesionalId.uid}`}
                      className="font-semibold text-blue-600 hover:underline text-lg"
                    >
                      {curso.profesionalId.nombre || "Profesional"}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Contenido de la clase seleccionada */}
            {claseSeleccionada ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold mb-2">
                    Clase {claseSeleccionada.numeroClase}: {claseSeleccionada.titulo}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>⏱️ {claseSeleccionada.duracionMinutos} minutos</span>
                    <span>📋 Clase {claseActiva + 1} de {clases.length}</span>
                  </div>
                </div>

                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700 leading-relaxed">{claseSeleccionada.descripcion}</p>
                </div>

                {/* Objetivos de la clase */}
                {claseSeleccionada.objetivos && claseSeleccionada.objetivos.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">🎯 Objetivos de aprendizaje</h3>
                    <ul className="space-y-2">
                      {claseSeleccionada.objetivos.map((objetivo, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          <span className="text-gray-700">{objetivo}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prerequisitos */}
                {claseSeleccionada.prerequisitos && claseSeleccionada.prerequisitos.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">📋 Prerequisitos</h3>
                    <ul className="space-y-2">
                      {claseSeleccionada.prerequisitos.map((prerequisito, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2 mt-1">→</span>
                          <span className="text-gray-700">{prerequisito}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Materiales de la clase */}
                {claseSeleccionada.materialesAdicionales && claseSeleccionada.materialesAdicionales.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">📁 Materiales de apoyo</h3>
                    <div className="grid gap-3">
                      {claseSeleccionada.materialesAdicionales.map((material, index) => {
                        const icono = material.tipo === 'pdf' ? '📄' : material.tipo === 'link' ? '🔗' : '📎';
                        return (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <span className="mr-3 text-lg">{icono}</span>
                              <span className="font-medium">{material.nombre}</span>
                              <span className="ml-2 text-xs text-gray-500 capitalize">({material.tipo})</span>
                            </div>
                            <button
                              onClick={() => {
                                if (material.tipo === 'link') {
                                  window.open(material.url, '_blank');
                                } else {
                                  alert('Disponible para usuarios inscritos');
                                }
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              {material.tipo === 'link' ? 'Visitar' : 'Descargar'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Video placeholder */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">🎥 Video de la clase</h3>
                  <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="text-4xl mb-2">▶️</div>
                      <p>Video disponible para usuarios inscritos</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : clases.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                <p className="text-lg">👆 Selecciona una clase para ver su contenido</p>
              </div>
            )}

            {/* Fechas disponibles */}
            {curso.agendaDisponible && curso.agendaDisponible.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">📅 Próximas fechas disponibles</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {curso.agendaDisponible.slice(0, 4).map((fecha: string, index: number) => (
                    <div key={index} className="p-3 border rounded-lg text-center">
                      <div className="text-sm font-medium">
                        {new Date(fecha).toLocaleDateString('es-CL', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long' 
                        })}
                      </div>
                      <div className="text-blue-600 font-semibold">
                        {new Date(fecha).toLocaleTimeString('es-CL', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evaluaciones del curso */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">🗣️ Opiniones de estudiantes</h3>

              {evaluaciones.length === 0 ? (
                <p className="text-gray-500">Aún no hay evaluaciones para este curso.</p>
              ) : (
                <ul className="space-y-6">
                  {evaluaciones.map((evaluacion) => (
                    <li key={evaluacion._id} className="border-b pb-4">
                      <div className="flex items-center mb-2">
                        <img
                          src={evaluacion.evaluador.fotoPerfil || "/default-user.png"}
                          alt="Evaluador"
                          className="w-10 h-10 rounded-full border object-cover mr-3"
                          onError={(e) => (e.currentTarget.src = "/default-user.png")}
                        />
                        <div>
                          <p className="font-semibold">{evaluacion.evaluador.nombre}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(evaluacion.fecha).toLocaleDateString("es-CL")}
                          </p>
                        </div>
                      </div>
                      <p className="text-yellow-500 text-lg mb-1">
                        {"⭐".repeat(evaluacion.estrellas)}
                      </p>
                      <p className="text-gray-700 text-sm">{evaluacion.comentario}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
