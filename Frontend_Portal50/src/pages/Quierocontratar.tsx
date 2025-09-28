import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";


export default function QuieroContratar() {
  const { user } = useContext(UserContext);

  return (
    <main className="min-h-screen bg-white text-gray-800">

      {/* HERO: ¿Quieres contratar? */}
      <section className="py-20 text-center px-4 bg-gray-50">
        <h1 className="text-4xl md:text-5xl font-bold mb-10">
          ¿Quieres contratar?
        </h1>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="border rounded-lg p-6 shadow hover:shadow-md transition">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="font-bold text-lg mb-2">Profesionales certificados tiempo completo</h3>
            <p className="text-gray-600 mb-2 text-base">Profesionales verificados para posiciones permanentes en tu empresa.</p>
          </div>
          <div className="border rounded-lg p-6 shadow hover:shadow-md transition">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="font-bold text-lg mb-2">Profesionales certificados fraccionales</h3>
            <p className="text-gray-600 mb-2 text-base">Especialistas para trabajar por horas, proyectos o necesidades puntuales.</p>
          </div>
          <div className="border rounded-lg p-6 shadow hover:shadow-md transition">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="font-bold text-lg mb-2">Consultorías</h3>
            <p className="text-gray-600 mb-2 text-base">Recibe asesoría experta para resolver desafíos específicos de tu organización.</p>
          </div>
          <div className="border rounded-lg p-6 shadow hover:shadow-md transition">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="font-bold text-lg mb-2">Mentorías</h3>
            <p className="text-gray-600 mb-2 text-base">Accede a mentoría personalizada para potenciar el desarrollo de tu equipo.</p>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA: pasos */}
      <section className="py-0 px-4 bg-gray-50">
        <h2 className="text-3xl font-extrabold text-center mb-12">¿Cómo funciona?</h2>
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Paso 1 */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100 text-center">
            <div className="text-2xl font-bold text-blue-700 mb-2">Paso 1</div>
            <h3 className="text-xl font-semibold mb-4">Hablemos para explorar tus necesidades</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition">Agendar llamada</button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold transition">Iniciar chat</button>
            </div>
            <p className="text-gray-600">Nuestro equipo te contactará para entender tu cultura y requisitos.</p>
          </div>
          {/* Paso 2 */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100 text-center">
            <div className="text-2xl font-bold text-blue-700 mb-2">Paso 2</div>
            <h3 className="text-xl font-semibold mb-4">En nuestra plataforma tendrás acceso a los perfiles de los candidatos preseleccionados para ti.</h3>
            <ul className="text-gray-700 text-base mb-4 list-disc list-inside text-left max-w-lg mx-auto">
              <li className="mb-2">Podrás agendar una entrevista</li>
              <li>Podrás darnos feedback si es necesario expandir la búsqueda</li>
            </ul>
            <p className="text-gray-600">Te acompañamos en todo el proceso de selección.</p>
          </div>
          {/* Paso 3 */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100 text-center">
            <div className="text-2xl font-bold text-blue-700 mb-2">Paso 3</div>
            <h3 className="text-xl font-semibold mb-4">Te acompañamos en el proceso de contratación e inducción</h3>
            <p className="text-gray-600 mb-4">Nuestro equipo estará contigo en cada etapa para asegurar una integración exitosa.</p>
            <div className="bg-blue-100 text-blue-800 font-bold rounded-lg px-4 py-2 inline-block mt-2">
              ¡Revisa nuestra garantía de 3 meses!
            </div>
          </div>
        </div>
      </section>

      {/* Invitación a empresas (solo si no es empresa) */}
      {(!user || user.rol !== "empresa") && (
        <section className="py-12 px-4 text-center">
          <div className="inline-block bg-gradient-to-br from-blue-100 via-blue-50 to-white border-2 border-blue-400 text-blue-900 px-12 py-10 rounded-3xl shadow-2xl max-w-2xl animate-fade-in">
            <h3 className="text-3xl md:text-4xl font-extrabold mb-4 text-blue-800 drop-shadow">¿Eres una empresa?</h3>
            <p className="mb-6 text-lg md:text-xl font-medium">Únete a Portal 50+ y accede a una red exclusiva de trabajadores certificados.<br/>Publica tus ofertas de empleo y encuentra el talento que tu empresa necesita.</p>
            <Link
              to="/register-empresa"
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg transition transform hover:scale-105"
            >
              ¡Quiero unirme como empresa!
            </Link>
          </div>
        </section>
      )}

      {/* SELECCIÓN DE CONTRATACIÓN */}
      {/* Se eliminó la sección de 'Selecciona el tipo de contratación' */}
    </main>
  );
}
