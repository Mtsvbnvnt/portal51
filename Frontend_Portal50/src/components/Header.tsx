import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { auth } from "../firebase";
import { LiaChartPieSolid, LiaCogSolid, LiaTimesSolid } from "react-icons/lia";
import { FaUserCircle } from "react-icons/fa";
  import { UserContext } from "../context/UserContext";

export default function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [esEjecutivo, setEsEjecutivo] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();

        let res = await fetch(`http://localhost:3000/api/users/uid/${firebaseUser.uid}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        let data;
        if (res.ok) {
          data = await res.json();
        } else {
          res = await fetch(`http://localhost:3000/api/empresas/uid/${firebaseUser.uid}`, {
            headers: { Authorization: `Bearer ${idToken}` },
          });
          if (res.ok) {
            data = await res.json();
            if (!data.rol) data.rol = "empresa";
          }
        }

        if (data) {
          const fotoPerfil = data.fotoPerfil?.startsWith("http")
            ? data.fotoPerfil
            : `http://localhost:3000${data.fotoPerfil}`;

          const finalUser = {
            ...data,
            fotoPerfil,
          };

          setUser(finalUser);
          localStorage.setItem("user", JSON.stringify(finalUser));

          if (data.rol === "profesional") {
            const empresasRes = await fetch(`http://localhost:3000/api/empresas/activas`, {
              headers: { Authorization: `Bearer ${idToken}` },
            });
            if (empresasRes.ok) {
              const empresas = await empresasRes.json();
              const found = empresas.some((e: any) =>
                (e.ejecutivos || []).some((ej: any) => ej._id === data._id)
              );
              setEsEjecutivo(found);
            }
          } else {
            setEsEjecutivo(false);
          }
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } else {
        setUser(null);
        localStorage.removeItem("user");
        setEsEjecutivo(false);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    setImgError(false);
  }, [user?.fotoPerfil]);

  const handleSignOut = () => {
    auth.signOut();
    localStorage.removeItem("user");
    setUser(null);
    setEsEjecutivo(false);
    navigate("/");
  };

  const getDisponibilidadColor = (estado: string) => {
    switch (estado) {
      case "disponible":
        return "bg-green-400 shadow-green-500/50";
      case "con condiciones":
        return "bg-yellow-400 shadow-yellow-500/50";
      case "no disponible":
        return "bg-red-400 shadow-red-500/50";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <header className="bg-gray-200 text-gray-800 py-4 shadow w-full">
      <div className="container mx-auto flex flex-col md:flex-row items-center px-4">
        {/* IZQUIERDA */}
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold mb-2 md:mb-0">
          <img
            src="/Portal50.png"
            alt="Logo Portal 50+"
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
          />
          <div>
            <span className="text-black">Portal</span>
            <span className="text-blue-600">50+</span>
          </div>
        </Link>

        {/* CENTRO */}
        <nav className="flex-1 flex flex-wrap justify-center space-x-2 md:space-x-6 text-base md:text-lg">
          <Link to="/" className="hover:text-blue-600">Inicio</Link>
          {/* Empresa: Quiero contratar y Quiero aprender */}
          {user?.rol === "empresa" && (
            <>
              <Link to="/quiero-contratar" className="hover:text-blue-600">Quiero Contratar</Link>
              <Link to="/aprender" className="hover:text-blue-600">Quiero Aprender</Link>
            </>
          )}
          {/* Trabajador: Quiero trabajar y Quiero aprender */}
          {(user?.rol === "profesional" || user?.rol === "profesional-ejecutivo") && (
            <>
              <Link to="/trabajar" className="hover:text-blue-600">Quiero Trabajar</Link>
              <Link to="/aprender" className="hover:text-blue-600">Quiero Aprender</Link>
            </>
          )}
          {/* Invitado: muestra ambos */}
          {!user && (
            <>
              <Link to="/quiero-contratar" className="hover:text-blue-600">Quiero Contratar</Link>
              <Link to="/trabajar" className="hover:text-blue-600">Quiero Trabajar</Link>
              <Link to="/aprender" className="hover:text-blue-600">Quiero Aprender</Link>
            </>
          )}
        </nav>

        {/* DERECHA */}
        <div className="relative ml-0 md:ml-auto flex items-center mt-2 md:mt-0">
          {user ? (
            <div className="relative group inline-block">
              <div className="flex items-center space-x-2 cursor-pointer">
                {/* Indicador de disponibilidad */}
                {user.rol === "profesional" && user.disponibilidad && (
                  <div
                    className={`w-3.5 h-3.5 rounded-full mr-1 shadow-md transition-all duration-200 
                    ${getDisponibilidadColor(user.disponibilidad)} `}
                    title={`Estado: ${user.disponibilidad}`}
                  />
                )}

                {/* Imagen o ícono */}
                {user.fotoPerfil && typeof user.fotoPerfil === "string" && user.fotoPerfil.trim() !== "" && !user.fotoPerfil.includes("undefined") && !imgError ? (
                  <img
                    src={user.fotoPerfil}
                    alt="Foto Perfil"
                    onError={() => setImgError(true)}
                    className="inline-block w-10 h-10 rounded-full object-cover border-2 border-blue-500 shadow"
                  />
                ) : (
                  <FaUserCircle className="inline-block text-4xl" />
                )}
                <span className="hover:text-blue-600">{user.nombre}</span>
              </div>

              {/* Dropdown */}
              <div
                className={`absolute right-0 top-full mt-0 w-52 bg-white border rounded shadow z-50 transition-all duration-200 transform origin-top
                  opacity-0 scale-95 pointer-events-none
                  group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto`}
              >
                {user.rol === "profesional" && (
                  <Link to="/dashboard" className="px-4 py-2 hover:bg-gray-200 flex items-center">
                    <LiaChartPieSolid className="mr-2" />
                    <span>Dashboard</span>
                  </Link>
                )}
                {(user.rol === "empresa" || esEjecutivo) && (
                  <Link to="/empresa" className="px-4 py-2 hover:bg-gray-200 flex items-center">
                    <LiaChartPieSolid className="mr-2" />
                    <span>Dashboard Empresa</span>
                  </Link>
                )}
                <Link to="/configuracion" className="px-4 py-2 hover:bg-gray-200 flex items-center">
                  <LiaCogSolid className="mr-2" />
                  <span>Configuración</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 flex items-center"
                >
                  <LiaTimesSolid className="text-red-500 text-sm mr-2" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="hover:text-blue-600">Iniciar Sesión</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
