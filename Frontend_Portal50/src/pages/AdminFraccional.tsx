import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const AdminFraccional: React.FC = () => {
  // Hooks siempre al inicio
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [nuevoTelefono, setNuevoTelefono] = useState("");
  const [creando, setCreando] = useState(false);
  const [creaError, setCreaError] = useState("");
  const [creaSuccess, setCreaSuccess] = useState("");
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [empError, setEmpError] = useState("");

  React.useEffect(() => {
    if (isLogged) {
      setEmpLoading(true);
      fetch("http://localhost:3000/api/empresas/activas")
        .then(res => res.json())
        .then(data => setEmpresas(data))
        .catch(() => setEmpError("Error al cargar empresas"))
        .finally(() => setEmpLoading(false));
    }
  }, [isLogged, creaSuccess]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const idToken = await cred.user.getIdToken();
      // Buscar usuario en la API (ajusta endpoint según tu backend)
      const res = await fetch(`http://localhost:3000/api/users/uid/${cred.user.uid}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!res.ok) throw new Error("No se encontró el usuario");
      const data = await res.json();
      if (data.rol === "admin-fraccional") {
        setIsLogged(true);
      } else {
        setError("No tienes permisos de administrador fraccional");
      }
    } catch (err) {
      setError("Credenciales incorrectas o sin permisos");
    } finally {
      setLoading(false);
    }
  };

  // Render condicional, pero hooks siempre arriba
  if (!isLogged) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow max-w-xs w-full">
          <h2 className="text-xl font-bold mb-4 text-center">Acceso Administrador Fraccional</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border p-2 rounded mb-3"
            autoFocus
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={pass}
            onChange={e => setPass(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-4">Panel Administrador Fraccional</h1>
      <p className="mb-6 text-gray-700">Aquí podrás ver todas las empresas, sus ofertas y postulantes.</p>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold mb-8"
        onClick={() => setShowModal(true)}
      >
        Crear ejecutivo nuevo
      </button>

      {/* Modal para crear ejecutivo */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow max-w-md w-full relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => { setShowModal(false); setCreaError(""); setCreaSuccess(""); }}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Crear Ejecutivo Fraccional</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCreaError("");
                setCreaSuccess("");
                setCreando(true);
                try {
                  const res = await fetch("http://localhost:3000/api/users/adminfraccional", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre: nuevoNombre, email: nuevoEmail, telefono: nuevoTelefono, rol: "ejecutivo" })
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.message || "Error al crear ejecutivo");
                  setCreaSuccess("Ejecutivo creado y notificado por correo.");
                  setNuevoNombre(""); setNuevoEmail(""); setNuevoTelefono("");
                } catch (err: any) {
                  setCreaError(err.message || "Error al crear ejecutivo");
                } finally {
                  setCreando(false);
                }
              }}
              className="space-y-4"
            >
              <input
                placeholder="Nombre completo"
                value={nuevoNombre}
                onChange={e => setNuevoNombre(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
              <input
                placeholder="Email"
                type="email"
                value={nuevoEmail}
                onChange={e => setNuevoEmail(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
              <input
                placeholder="Teléfono"
                value={nuevoTelefono}
                onChange={e => setNuevoTelefono(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
                disabled={creando}
              >
                {creando ? "Creando..." : "Crear ejecutivo"}
              </button>
              {creaError && <p className="text-red-500 text-sm">{creaError}</p>}
              {creaSuccess && <p className="text-green-600 text-sm">{creaSuccess}</p>}
            </form>
          </div>
        </div>
      )}

      {/* Listado de empresas */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Empresas registradas</h2>
        {empLoading && <p>Cargando empresas...</p>}
        {empError && <p className="text-red-500">{empError}</p>}
        {empresas.length === 0 && !empLoading ? (
          <p className="text-gray-500">No hay empresas activas.</p>
        ) : (
          empresas.map((empresa) => (
            <div key={empresa._id} className="bg-white rounded shadow p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-bold text-lg">{empresa.nombre}</h3>
                  <p className="text-sm text-gray-600">Email: {empresa.email}</p>
                  <p className="text-sm text-gray-600">Teléfono: {empresa.telefono}</p>
                </div>
                {/* Aquí irá el botón para asignar ejecutivo */}
                <button className="bg-green-600 text-white px-4 py-2 rounded font-semibold">Asignar ejecutivo</button>
              </div>
              <div>
                <strong>Ejecutivos:</strong>
                {empresa.ejecutivos && empresa.ejecutivos.length > 0 ? (
                  <ul className="list-disc pl-6">
                    {empresa.ejecutivos.map((ej: any) => (
                      <li key={ej.uid}>
                        {ej.nombre} ({ej.email})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-500 ml-2">Sin ejecutivos asignados</span>
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default AdminFraccional;
