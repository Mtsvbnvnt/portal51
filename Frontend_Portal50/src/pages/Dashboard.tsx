import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import jsPDF from "jspdf";

interface User {
  _id: string;
  nombre: string;
  email: string;
  telefono?: string;
  pais?: string;
  experiencia?: string;
  modalidadPreferida?: string;
  cv?: string;
  fotoPerfil?: string;
  disponibilidad?: "disponible" | "con condiciones" | "no disponible";
  rol?: string;
}

export default function Dashboard() {
  const generarPDF = () => {
    if (!user) return;
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(18);
    doc.text("Curriculum Vitae", 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Nombre: ${user.nombre}`, 20, y);
    y += 8;
    doc.text(`Email: ${user.email}`, 20, y);
    y += 8;
    doc.text(`Teléfono: ${user.telefono || ""}`, 20, y);
    y += 8;
    doc.text(`País: ${user.pais || ""}`, 20, y);
    y += 10;
    doc.setFontSize(14);
    doc.text("Educación", 20, y);
    y += 8;
    doc.setFontSize(12);
    if (user.educaciones) {
      user.educaciones.forEach((edu: any) => {
        doc.text(`Institución: ${edu.institucion}`, 22, y);
        y += 6;
        doc.text(`Título: ${edu.titulo} (${edu.ciudad}, ${edu.pais})`, 22, y);
        y += 6;
        doc.text(`Desde: ${edu.desde} - Hasta: ${edu.hasta}`, 22, y);
        y += 6;
        if (edu.cursos) {
          doc.text(`Cursos relevantes: ${edu.cursos}`, 22, y);
          y += 6;
        }
        y += 2;
      });
    }
    y += 6;
    doc.setFontSize(14);
    doc.text("Experiencia Laboral", 20, y);
    y += 8;
    doc.setFontSize(12);
    if (user.experiencias) {
      user.experiencias.forEach((exp: any) => {
        doc.text(`Año: ${exp.anio} - Empresa: ${exp.empresa} - Cargo: ${exp.cargo}`, 22, y);
        y += 6;
      });
    }
    y += 6;
    if (user.habilidades) {
      doc.setFontSize(14);
      doc.text("Habilidades Técnicas", 20, y);
      y += 8;
      doc.setFontSize(12);
      doc.text(user.habilidades, 22, y);
      y += 6;
    }
    doc.save("CV.pdf");
  };
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState("perfil");
  const [postulaciones, setPostulaciones] = useState<any[]>([]);
  const [cursos, setCursos] = useState<any[]>([]);
  const [cursosExpandido, setCursosExpandido] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsedUser = JSON.parse(stored);
      if (
        parsedUser.fotoPerfil &&
        typeof parsedUser.fotoPerfil === "string" &&
        !parsedUser.fotoPerfil.startsWith("http")
      ) {
        parsedUser.fotoPerfil = `http://localhost:3000${parsedUser.fotoPerfil}`;
      }
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    const fetchPostulaciones = async () => {
      if (!user?._id) return;
      try {
        const idToken = await auth.currentUser?.getIdToken();
        const res = await fetch(`http://localhost:3000/api/postulaciones/usuario/${user._id}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPostulaciones(data);
      } catch (err) {
        console.error("❌ Error cargando postulaciones:", err);
      }
    };

    if (tab === "postulaciones" || tab === "perfil") {
      fetchPostulaciones();
    }
  }, [tab, user]);

  useEffect(() => {
    const fetchCursos = async () => {
      if (!user?._id || !user.rol || !["profesional"].includes(user.rol)) return;
      try {
        const idToken = await auth.currentUser?.getIdToken();
        const res = await fetch(`http://localhost:3000/api/cursos/usuario/${user._id}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCursos(data);
      } catch (err) {
        console.error("❌ Error cargando cursos:", err);
      }
    };

    if (tab === "cursos" || tab === "perfil") {
      fetchCursos();
    }
  }, [tab, user]);

  

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">
        🎉 Bienvenido, {user?.nombre || "Usuario"} a tu Panel Profesional
      </h1>

      {/* Tabs */}
      <div className="flex border-b mb-8 space-x-4">
        <button
          onClick={() => setTab("perfil")}
          className={`px-4 py-2 ${tab === "perfil" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
        >
          Mi Perfil
        </button>
        <button
          onClick={() => setTab("postulaciones")}
          className={`px-4 py-2 ${tab === "postulaciones" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
        >
          Mis Postulaciones
        </button>
        {["profesional", "profesional-ejecutivo"].includes(user?.rol || "") && (
          <button
            onClick={() => setTab("cursos")}
            className={`px-4 py-2 ${tab === "cursos" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
          >
            Mis Cursos
          </button>
        )}
      </div>

      {/* Mi Perfil */}
      {tab === "perfil" && (
  <>
          <section className="bg-white shadow p-6 rounded mb-10">
            <div className="flex justify-end mb-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                onClick={generarPDF}
              >
                Descargar mi CV en PDF
              </button>
            </div>
            <h2 className="text-xl font-bold mb-4 text-center">Tu Perfil Profesional</h2>
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex flex-col items-center">
                <img
                  src={user?.fotoPerfil || "/default-user.png"}
                  alt="Foto de perfil"
                  className="w-40 h-40 rounded-full object-cover border shadow mb-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/default-user.png";
                  }}
                />
                {user?.cv ? (
                  <a
                    href={`http://localhost:3000/api/users/download/${user.cv.split("/").pop()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm mb-2"
                  >
                    📄 Descargar mi CV
                  </a>
                ) : (
                  <p className="text-sm text-gray-500 mt-2 text-center">CV no disponible</p>
                )}
                <Link
                  to="/configuracion"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm mt-3"
                >
                  ✏️ Editar Perfil
                </Link>
              </div>

              <div className="flex-grow space-y-2">
                {user?.disponibilidad && (
                  <div
                    className={`border rounded px-4 py-2 text-sm font-medium mb-4 ${
                      user.disponibilidad === "disponible"
                        ? "bg-green-100 text-green-800 border-green-300"
                        : user.disponibilidad === "con condiciones"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                        : "bg-red-100 text-red-800 border-red-300"
                    }`}
                  >
                    {user.disponibilidad === "disponible" && "🟢 Disponible para trabajar"}
                    {user.disponibilidad === "con condiciones" && "🟡 Disponible con condiciones"}
                    {user.disponibilidad === "no disponible" && "🔴 No disponible por ahora"}
                  </div>
                )}
                <p><strong>Nombre:</strong> {user?.nombre}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Teléfono:</strong> {user?.telefono || "No disponible"}</p>
                <p><strong>País:</strong> {user?.pais || "No especificado"}</p>
                <p><strong>Modalidad Preferida:</strong> {user?.modalidadPreferida || "No especificada"}</p>
                <div>
                  <strong>Descripción:</strong>
                  <p className="whitespace-pre-line mt-1">
                    {user?.experiencia || "Sin descripción registrada."}
                  </p>
                </div>
              </div>
            </div>

            {!user?.cv && (
              <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded text-center">
                <p className="mb-3">
                  Aún falta completar tu perfil profesional. Completa todos los datos, para tener mayor visibilidad o una presentación más completa.
                </p>
                <Link
                  to="/completar-perfil"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full"
                >
                  Completar Perfil
                </Link>
              </div>
            )}
          </section>
        </>
      )}

      {/* Mis Postulaciones */}
      {tab === "postulaciones" && (
        <section className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-bold mb-4">📋 Mis Postulaciones</h2>
          {postulaciones.length === 0 ? (
            <p className="text-gray-500">Aún no tienes postulaciones activas.</p>
          ) : (
            <div className="space-y-4">
              {postulaciones.map((p) => (
                <div key={p._id} className="border rounded p-4 shadow-sm">
                  <h3 className="font-semibold">{p.ofertaId?.titulo || "Oferta desconocida"}</h3>
                  <p className="text-sm text-gray-600">
                    Estado:{" "}
                    <span
                      className={`font-bold ${
                        p.estado === "preseleccionado"
                          ? "text-green-600"
                          : p.estado === "rechazado"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {p.estado}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Postulado el: {new Date(p.fechaPostulacion).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Mis Cursos */}
      {tab === "cursos" && (
        <>
        <div className="bg-white shadow p-6 rounded mb-8">
          {/* Cursos Suscritos */}
          <div>
            <h2 className="text-xl font-bold mb-4">📚 Cursos Suscritos</h2>
            {cursos.filter((c) => {
                                    const profId = typeof c.profesionalId === 'string' ? c.profesionalId : c.profesionalId?._id;
                                    return profId !== user?._id;
                                  }).length === 0 ? (
              <p className="text-gray-500">No estás inscrito en cursos de otros profesionales.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {cursos.filter((c) => {
                                        const profId = typeof c.profesionalId === 'string' ? c.profesionalId : c.profesionalId?._id;
                                        return profId !== user?._id;
                                      })
                  .map((curso) => (
                    <div key={curso._id} className="border p-4 rounded shadow-sm">
                      <h3 className="text-lg font-semibold">{curso.titulo}</h3>
                      <p className="text-sm text-gray-600">{curso.descripcion}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      
          {/* Mis Cursos Publicados */}
          <div className="bg-white shadow p-6 rounded">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">🎓 Mis Cursos Publicados</h2>
              <Link
                to="/subir-curso"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
              >
                Subir Curso
              </Link>
            </div>
          
            {cursos.filter((c) => {
                                    const profId = typeof c.profesionalId === 'string' ? c.profesionalId : c.profesionalId?._id;
                                    return profId === user?._id;
                                  }).length === 0 ? (
              <p className="text-gray-500">No has publicado ningún curso aún.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {cursos.filter((c) => {
                                        const profId = typeof c.profesionalId === 'string' ? c.profesionalId : c.profesionalId?._id;
                                        return profId === user?._id;
                                      })
                  .map((curso) => {
                    const estaExpandido = cursosExpandido.includes(curso._id);
                    const toggleExpandir = () => {
                      setCursosExpandido((prev) =>
                        prev.includes(curso._id)
                          ? prev.filter((id) => id !== curso._id)
                          : [...prev, curso._id]
                      );
                    };
                  
                    const eliminarCurso = async () => {
                      if (!confirm("¿Estás seguro de eliminar este curso?")) return;
                      try {
                        const idToken = await auth.currentUser?.getIdToken();
                        const res = await fetch(`http://localhost:3000/api/cursos/${curso._id}`, {
                          method: "DELETE",
                          headers: { Authorization: `Bearer ${idToken}` },
                        });
                        if (!res.ok) throw new Error("No se pudo eliminar");
                        setCursos((prev) => prev.filter((c) => c._id !== curso._id));
                      } catch (error) {
                        console.error("Error eliminando curso:", error);
                        alert("No se pudo eliminar el curso.");
                      }
                    };
                  
                    const toggleEstadoCurso = async () => {
                      try {
                        const idToken = await auth.currentUser?.getIdToken();
                        const res = await fetch(`http://localhost:3000/api/cursos/${curso._id}/estado`, {
                          method: "PUT",
                          headers: {
                            Authorization: `Bearer ${idToken}`,
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            activo: !curso.activo,
                          }),
                        });
                        if (!res.ok) throw new Error("No se pudo actualizar estado");
                        const actualizado = await res.json();
                        setCursos((prev) =>
                          prev.map((c) => (c._id === curso._id ? actualizado : c))
                        );
                      } catch (err) {
                        console.error("Error al cambiar estado del curso:", err);
                        alert("No se pudo cambiar el estado del curso.");
                      }
                    };
                  
                    return (
                      <div key={curso._id} className="border p-4 rounded shadow-sm">
                        <h3 className="text-lg font-semibold">{curso.titulo}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{curso.descripcion}</p>
                        <button
                          onClick={toggleExpandir}
                          className="mt-2 text-blue-600 hover:underline text-sm"
                        >
                          {estaExpandido ? "Ocultar detalles" : "Ver más"}
                        </button>
                    
                        {estaExpandido && (
                          <div className="mt-3 text-sm space-y-2">
                            <p><strong>Categoría:</strong> {curso.categoria}</p>
                            <p><strong>Duración:</strong> {curso.duracionMinutos} minutos</p>
                            <p><strong>Precio:</strong> ${curso.precio} CLP</p>
                            <p><strong>Pago:</strong> {curso.tipoPago}</p>
                            <p><strong>Estado:</strong>{" "}
                              <span className={curso.activo ? "text-green-600" : "text-red-600"}>
                                {curso.activo ? "Activo" : "Pausado"}
                              </span>
                            </p>
                        
                            <div className="flex flex-wrap gap-2 mt-2">
                              <button
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                                onClick={() => alert("Función de edición en desarrollo")}
                              >
                                 Editar
                              </button>
                              <button
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                onClick={toggleEstadoCurso}
                              >
                                {curso.activo ? "Pausar" : "Reanudar"}
                              </button>
                              <button
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                onClick={eliminarCurso}
                              >
                                Eliminar
                              </button>
                              <button
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
                                onClick={() => alert("Próximamente: ver inscritos")}
                              >
                                Ver inscritos
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
            </div>
        </div>
        </>
      )}

      {/* Tarjetas Informativas */}
      {tab === "perfil" && (
        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">💼 Postulaciones</h3>
            <p className="text-4xl font-bold text-blue-600">
              {postulaciones.length === 0 ? "--" : postulaciones.length}
            </p>
            <p className="text-sm text-gray-500 mt-2">Total de ofertas a las que has postulado</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">🎓 Actividad de Cursos</h3>
            {/* Cursos Suscritos */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Cursos suscritos</p>
              <p className="text-3xl font-bold text-green-600">
                {
                  cursos.filter((c) => {
                    const profId = typeof c.profesionalId === "string" ? c.profesionalId : c.profesionalId?._id;
                    return profId !== user?._id;
                  }).length
                }
              </p>
            </div>
              
            {/* Cursos Publicados */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Cursos publicados</p>
              <p className="text-3xl font-bold text-blue-600">
                {
                  cursos.filter((c) => {
                    const profId = typeof c.profesionalId === "string" ? c.profesionalId : c.profesionalId?._id;
                    return profId === user?._id;
                  }).length
                }
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">👁️ Visitas al perfil</h3>
            <p className="text-4xl font-bold text-purple-600">0</p>
            <p className="text-sm text-gray-500 mt-2">Veces que tu perfil ha sido visualizado</p>
          </div>
        </section>
      )}
    </main>
  );
}
