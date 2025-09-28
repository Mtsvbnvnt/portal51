// src/pages/Home.tsx
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Home() {
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(location.state?.success);
  const [showLoginSuccess, setShowLoginSuccess] = useState(location.state?.loginSuccess);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (location.state?.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }

    if (location.state?.loginSuccess) {
      setShowLoginSuccess(true);
      const timer = setTimeout(() => {
        setShowLoginSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <main className="min-h-screen bg-white text-gray-800 relative">
      {/* Barra verde de éxito */}
      {showSuccess && (
        <div className="fixed top-0 left-0 w-full bg-green-500 text-white text-center py-2 z-50">
          ✅ Registro exitoso
        </div>
      )}
      {showLoginSuccess && (
        <div className="fixed top-0 left-0 w-full bg-green-500 text-white text-center py-2 z-50">
          ✅ Inicio de sesión exitoso
        </div>
      )}

      {/* Hero principal */}
<<<<<<< HEAD
      <section className="bg-gray-100 py-16 px-4 text-center">
        {user ? (
          <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ¡Bienvenido de vuelta, {user.nombre}!
            </h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              {user.rol === 'profesional' && "Gestiona tus cursos, encuentra nuevas oportunidades y conecta con otros profesionales."}
              {user.rol === 'empresa' && "Publica ofertas, encuentra talento y gestiona tus procesos de reclutamiento."}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Bienvenido a <span className="text-black">Portal</span>
              <span className="text-blue-600">50+</span>
            </h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Tu comunidad para conectar empresas, profesionales y aprendices con oportunidades reales.
            </p>
          </>
        )}
      </section>

      {/* Sección de información destacada - solo para usuarios NO logueados */}
      {!user && (
        <section className="py-20 px-4 bg-white text-center">
          <h2 className="text-3xl font-bold mb-6">¿Qué es Portal50+?</h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8">
            Portal50+ es una plataforma que impulsa la conexión entre profesionales con experiencia,
            empresas que valoran el talento y aprendices que buscan crecer.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Link to="/register-usuario" className="border p-8 rounded-lg shadow-lg hover:shadow-xl transition bg-white hover:bg-blue-50 cursor-pointer block">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Para Profesionales</h3>
              <p className="text-gray-600 text-base mb-4">
                ¿Tienes experiencia y buscas nuevas oportunidades laborales? Únete como profesional para:
=======
      <section className="bg-gray-100 py-20 px-4 text-center">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6">
          Bienvenido a <span className="text-black">Portal</span>
          <span className="text-blue-600">50+</span>
        </h1>
        <p className="text-2xl md:text-3xl mb-10 max-w-3xl mx-auto font-medium">
          Tu comunidad para conectar empresas, profesionales y aprendices con oportunidades reales.
        </p>
        {user ? (
          <div className="flex justify-center items-center min-h-[300px] mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-xl">
              {/* Empresa: Quiero contratar y Quiero aprender */}
              {user.rol === "empresa" && (
                <>
                  <Link to="/quiero-contratar" className="border p-6 sm:p-8 rounded shadow hover:shadow-lg transition block bg-white hover:bg-blue-50">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-blue-600">Quiero contratar</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Encuentra talento certificado para tu empresa.</p>
                  </Link>
                  <Link to="/aprender" className="border p-6 sm:p-8 rounded shadow hover:shadow-lg transition block bg-white hover:bg-green-50">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-green-600">Quiero aprender</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Accede a cursos y mentorías para potenciar tus habilidades.</p>
                  </Link>
                </>
              )}
              {/* Trabajador: Quiero trabajar y Quiero aprender */}
              {(user.rol === "profesional" || user.rol === "profesional-ejecutivo") && (
                <>
                  <Link to="/trabajar" className="border p-6 sm:p-8 rounded shadow hover:shadow-lg transition block bg-white hover:bg-green-50">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-green-600">Quiero trabajar</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Encuentra ofertas laborales y postula a empleos.</p>
                  </Link>
                  <Link to="/aprender" className="border p-6 sm:p-8 rounded shadow hover:shadow-lg transition block bg-white hover:bg-blue-50">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-blue-600">Quiero aprender</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Accede a cursos y mentorías para potenciar tus habilidades.</p>
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : null}
      </section>

      {/* Sección de información destacada */}
      <section className="py-20 px-4 bg-white text-center">
        <h2 className="text-3xl font-bold mb-6">¿Qué es Portal50+?</h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-8">
          Portal50+ es una plataforma que impulsa la conexión entre profesionales con experiencia,
          empresas que valoran el talento y aprendices que buscan crecer.
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Link to="/register-usuario" className="border p-4 sm:p-6 rounded shadow hover:shadow-lg transition bg-white hover:bg-blue-50 cursor-pointer block">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Profesionales</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Encuentra trabajo, publica tu perfil y accede a cursos para mejorar tus habilidades.
>>>>>>> parent of f8026c2 (feat: Mejoras Portal50+ - Página Aprender con cursos, fixes backend y UI)
              </p>
              <span className="mt-3 inline-block text-blue-600 font-semibold">Regístrate como profesional →</span>
            </Link>
            <Link to="/register-empresa" className="border p-4 sm:p-6 rounded shadow hover:shadow-lg transition bg-white hover:bg-green-50 cursor-pointer block">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Quiero Contratar</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Publica ofertas laborales, busca talento y conecta con profesionales capacitados.
              </p>
              <span className="mt-3 inline-block text-green-600 font-semibold">Regístrate como empresa →</span>
            </Link>
            <Link to="/register-usuario?rol=aprendiz" className="border p-4 sm:p-6 rounded shadow hover:shadow-lg transition bg-white hover:bg-purple-50 cursor-pointer block">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Aprendices</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Accede a cursos, mentorías y oportunidades para iniciar tu carrera profesional.
              </p>
              <span className="mt-3 inline-block text-purple-600 font-semibold">Regístrate como aprendiz →</span>
            </Link>
        </div>
      </section>
      )}

      {/* Sección para usuarios logueados */}
      {user && (
        <section className="py-20 px-4 bg-white text-center">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {user.rol === 'profesional' && (
              <>
                <div className="bg-white border-2 border-blue-300 p-6 rounded-lg hover:bg-blue-50 transition">
                  <h3 className="text-xl font-bold text-blue-800 mb-3">Mis Cursos</h3>
                  <p className="text-blue-700 text-sm mb-4">Gestiona y crea nuevos cursos para compartir tu experiencia.</p>
                  <Link to="/dashboard" className="text-blue-600 font-semibold hover:text-blue-800">
                    Ir a Mis Cursos →
                  </Link>
                </div>
                <div className="bg-white border-2 border-blue-300 p-6 rounded-lg hover:bg-blue-50 transition">
                  <h3 className="text-xl font-bold text-blue-800 mb-3">Oportunidades</h3>
                  <p className="text-blue-700 text-sm mb-4">Encuentra ofertas laborales que valoren tu experiencia.</p>
                  <Link to="/trabajar" className="text-blue-600 font-semibold hover:text-blue-800">
                    Ver Ofertas →
                  </Link>
                </div>
              </>
            )}
            
            {user.rol === 'empresa' && (
              <>
                <div className="bg-white border-2 border-blue-300 p-6 rounded-lg hover:bg-blue-50 transition">
                  <h3 className="text-xl font-bold text-blue-800 mb-3">Mis Ofertas</h3>
                  <p className="text-blue-700 text-sm mb-4">Gestiona tus ofertas laborales y candidatos.</p>
                  <Link to="/dashboard" className="text-blue-600 font-semibold hover:text-blue-800">
                    Gestionar Ofertas →
                  </Link>
                </div>
                <div className="bg-white border-2 border-blue-300 p-6 rounded-lg hover:bg-blue-50 transition">
                  <h3 className="text-xl font-bold text-blue-800 mb-3">Candidatos</h3>
                  <p className="text-blue-700 text-sm mb-4">Revisa postulaciones y encuentra el talento ideal.</p>
                  <Link to="/dashboard" className="text-blue-600 font-semibold hover:text-blue-800">
                    Ver Candidatos →
                  </Link>
                </div>
              </>
            )}

            <div className="bg-white border-2 border-blue-300 p-6 rounded-lg hover:bg-blue-50 transition">
              <h3 className="text-xl font-bold text-blue-800 mb-3">Mi Perfil</h3>
              <p className="text-blue-700 text-sm mb-4">Actualiza tu información y configuración.</p>
              <Link to="/dashboard" className="text-blue-600 font-semibold hover:text-blue-800">
                Editar Perfil →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action final */}
      <section className="bg-blue-600 py-16 px-4 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">¿Listo para unirte?</h2>
        <p className="mb-8">Crea tu cuenta hoy mismo y comienza a conectar con oportunidades reales.</p>
        <Link
          to="/register"
          className="bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-slate-400 transition"
        >
          Crear Cuenta
        </Link>
      </section>
    </main>
  );
}
