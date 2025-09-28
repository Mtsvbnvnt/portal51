// src/pages/Aprender.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  videosIntro: Array<{
    _id: string;
    titulo: string;
    url: string;
    duracion: number;
  }>;
}

interface EstadosBusqueda {
  loading: boolean;
  error: string | null;
  sinResultados: boolean;
}

const PAISES_HABILITADOS = ["CL", "MX", "PE"];

export default function Aprender() {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [filtros, setFiltros] = useState({
    busqueda: "",
    especialidad: "",
    ratingMinimo: 0,
    ordenar: "relevancia"
  });
  const [estados, setEstados] = useState<EstadosBusqueda>({
    loading: true,
    error: null,
    sinResultados: false
  });
  const [paisUsuario] = useState<string>("CL");

  useEffect(() => {
    fetchProfesionales();
  }, [filtros]);

  const fetchProfesionales = async () => {
    setEstados({ loading: true, error: null, sinResultados: false });
    
    try {
      const queryParams = new URLSearchParams({
        busqueda: filtros.busqueda,
        especialidad: filtros.especialidad,
        ratingMinimo: filtros.ratingMinimo.toString(),
        ordenar: filtros.ordenar
      });
      
      // Por ahora usamos el endpoint de trabajadores existente
      const res = await fetch(`http://localhost:3000/api/users/trabajadores?${queryParams}`);
      if (!res.ok) throw new Error("Error al cargar profesionales");
      
      const data = await res.json();
      
      // Transformar datos para incluir rating simulado
      const profesionalesConRating = data.map((prof: any) => ({
        ...prof,
        especialidades: prof.modalidadPreferida ? [prof.modalidadPreferida] : ["General"],
        rating: Math.random() * 2 + 3, // Rating entre 3-5
        totalReseñas: Math.floor(Math.random() * 50) + 5,
        videosIntro: []
      }));
      
      setProfesionales(profesionalesConRating);
      setEstados({ 
        loading: false, 
        error: null, 
        sinResultados: profesionalesConRating.length === 0 
      });
    } catch (error) {
      console.error("❌ Error al obtener profesionales:", error);
      setEstados({ 
        loading: false, 
        error: "No pudimos cargar el catálogo. Reintenta", 
        sinResultados: false 
      });
    }
  };

  const renderEstrellas = (rating: number) => {
    return "⭐".repeat(Math.round(rating));
  };

  if (!PAISES_HABILITADOS.includes(paisUsuario)) {
    return (
      <main className="min-h-screen bg-gray-50 text-gray-800 py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">🌎 Servicio no disponible</h1>
          <p className="text-gray-600 mb-6">
            Aún no ofrecemos servicios de aprendizaje en tu país. Estamos trabajando para expandir nuestra cobertura.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
            Notifícame cuando esté disponible
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <section className="bg-white py-12 px-4 border-b">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">🎓 Quiero Aprender</h1>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Descubre profesionales certificados y accede a clases cortas, mentorías personalizadas para potenciar tus habilidades.
          </p>
          
          {/* Barra de búsqueda y filtros */}
          <div className="max-w-4xl mx-auto grid gap-4 md:grid-cols-4">
            <input
              type="text"
              placeholder="Buscar por tema o profesional..."
              value={filtros.busqueda}
              onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
              className="border rounded-lg px-4 py-2"
            />
            
            <select
              value={filtros.especialidad}
              onChange={(e) => setFiltros({...filtros, especialidad: e.target.value})}
              className="border rounded-lg px-4 py-2"
            >
              <option value="">Todas las especialidades</option>
              <option value="desarrollo">Desarrollo</option>
              <option value="diseño">Diseño</option>
              <option value="marketing">Marketing</option>
              <option value="finanzas">Finanzas</option>
              <option value="idiomas">Idiomas</option>
            </select>
            
            <select
              value={filtros.ratingMinimo}
              onChange={(e) => setFiltros({...filtros, ratingMinimo: Number(e.target.value)})}
              className="border rounded-lg px-4 py-2"
            >
              <option value={0}>Cualquier rating</option>
              <option value={3}>3+ estrellas</option>
              <option value={4}>4+ estrellas</option>
              <option value={4.5}>4.5+ estrellas</option>
            </select>
            
            <select
              value={filtros.ordenar}
              onChange={(e) => setFiltros({...filtros, ordenar: e.target.value})}
              className="border rounded-lg px-4 py-2"
            >
              <option value="relevancia">Relevancia</option>
              <option value="rating">Mejor rating</option>
              <option value="popular">Más solicitados</option>
            </select>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Estados de carga */}
          {estados.loading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {estados.error && (
            <div className="text-center py-12" role="alert">
              <p className="text-red-600 mb-4">{estados.error}</p>
              <button 
                onClick={fetchProfesionales}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Reintentar
              </button>
            </div>
          )}

          {estados.sinResultados && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No encontramos profesionales para tu búsqueda. Ajusta filtros.</p>
              <button 
                onClick={() => setFiltros({busqueda: "", especialidad: "", ratingMinimo: 0, ordenar: "relevancia"})}
                className="text-blue-600 hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}

          {/* Grid de profesionales */}
          {!estados.loading && !estados.error && profesionales.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {profesionales.map((profesional) => (
                <div key={profesional._id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                  {/* Header profesional */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={profesional.fotoPerfil ? `http://localhost:3000${profesional.fotoPerfil}` : "/default-user.png"}
                      alt={profesional.nombre}
                      className="w-16 h-16 rounded-full object-cover border"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/default-user.png"; }}
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{profesional.nombre}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-yellow-500">{renderEstrellas(profesional.rating)}</span>
                        <span className="text-gray-600">({profesional.totalReseñas} reseñas)</span>
                      </div>
                    </div>
                  </div>

                  {/* Especialidades */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {profesional.especialidades.slice(0, 3).map((esp, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {esp}
                      </span>
                    ))}
                  </div>

                  {/* Bio breve */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {profesional.experiencia?.slice(0, 200)}...
                  </p>

<<<<<<< HEAD
                  {/* Metadatos */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-500">
                        ⏱️ {formatearDuracion(curso.duracionMinutos)}
                      </span>
                      <span className="flex items-center text-gray-500">
                        📂 {curso.categoria}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-yellow-600">
                        {renderEstrellas(curso.calificacionPromedio)} ({curso.calificacionPromedio.toFixed(1)})
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                        {curso.tipoPago === 'sesion' ? 'Por sesión' : 'Mensual'}
                      </span>
                    </div>
                  </div>

                  {/* Precio y acción */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {formatearPrecio(curso.precio)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {curso.tipoPago === 'sesion' ? 'por sesión' : 'por mes'}
                      </p>
                    </div>
                    <Link
                      to={`/curso/${curso._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      Ver curso
                    </Link>
                  </div>
=======
                  {/* CTA */}
                  <Link
                    to={`/aprender/profesional/${profesional.uid}`}
                    className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Ver perfil y videos
                  </Link>
>>>>>>> parent of f8026c2 (feat: Mejoras Portal50+ - Página Aprender con cursos, fixes backend y UI)
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
