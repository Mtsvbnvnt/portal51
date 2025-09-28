// src/pages/EmpresaPanel.tsx

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function EmpresaPanel() {
  const navigate = useNavigate();
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [tab, setTab] = useState("publicaciones");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [empresa, setEmpresa] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);

      const validarAcceso = async () => {
        const idToken = await auth.currentUser?.getIdToken();

        if (user.rol === "empresa") {
          return user.uid; // ✅ Es empresa dueña: devolver su UID
        }

        if (user.rol === "profesional") {
          const empresasRes = await fetch(`http://localhost:3000/api/empresas/activas`, {
            headers: { Authorization: `Bearer ${idToken}` },
          });
          if (empresasRes.ok) {
            const empresas = await empresasRes.json();
            const foundEmpresa = empresas.find((e: any) =>
              (e.ejecutivos || []).some((ej: any) => ej._id === user._id)
            );
            if (foundEmpresa) return foundEmpresa.uid; // ✅ Es ejecutivo: devolver UID empresa
          }
        }

        navigate("/");
        return null;
      };

      validarAcceso().then((empresaUid) => {
        if (empresaUid) {
          const fetchData = async () => {
            try {
              const idToken = await auth.currentUser?.getIdToken();

              const resEmpresa = await fetch(`http://localhost:3000/api/empresas/uid/${empresaUid}`, {
                headers: { Authorization: `Bearer ${idToken}` },
              });
              if (!resEmpresa.ok) throw new Error("Error obteniendo empresa");
              const empresaData = await resEmpresa.json();
              setEmpresa(empresaData);

              const resOfertas = await fetch(`http://localhost:3000/api/jobs`, {
                headers: { Authorization: `Bearer ${idToken}` },
              });
              if (!resOfertas.ok) throw new Error("Error obteniendo ofertas");
              const allJobs = await resOfertas.json();
              const ownJobs = allJobs.filter((job: any) => job.empresaId === empresaData._id);
              setOfertas(ownJobs);
            } catch (err) {
              console.error("❌ Error cargando datos:", err);
            }
          };

          fetchData();
        }
      });
    } else {
      navigate("/");
    }
  }, [navigate]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleDelete = async (id: string) => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const res = await fetch(`http://localhost:3000/api/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!res.ok) throw new Error("Error eliminando oferta");
      setOfertas((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error("❌ Error eliminando oferta:", err);
    }
  };

  const handleToggleEstado = async (id: string, currentEstado: string) => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const nuevoEstado = currentEstado === "activa" ? "pausada" : "activa";

      const res = await fetch(`http://localhost:3000/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) throw new Error("Error actualizando estado");

      setOfertas((prev) =>
        prev.map((o) => (o._id === id ? { ...o, estado: nuevoEstado } : o))
      );
    } catch (err) {
      console.error("❌ Error actualizando estado:", err);
    }
  };

  const handleAgregarEjecutivo = async () => {
    const profesionalId = prompt("🔍 Ingresa el UID del profesional a asignar:");
    if (!profesionalId) return;

    try {
      const idToken = await auth.currentUser?.getIdToken();
      const res = await fetch(`http://localhost:3000/api/empresas/${empresa._id}/ejecutivos`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ userId: profesionalId, action: "add" }),
      });
      if (!res.ok) throw new Error("Error asignando ejecutivo");
      const data = await res.json();
      setEmpresa(data.empresa);
    } catch (err) {
      console.error("❌ Error agregando ejecutivo:", err);
    }
  };

  const handleEliminarEjecutivo = async (uid: string) => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const res = await fetch(`http://localhost:3000/api/empresas/${empresa._id}/ejecutivos`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ userId: uid, action: "remove" }),
      });
      if (!res.ok) throw new Error("Error eliminando ejecutivo");
      const data = await res.json();
      setEmpresa(data.empresa);
    } catch (err) {
      console.error("❌ Error eliminando ejecutivo:", err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-1">Dashboard Empresarial</h1>
      <p className="mb-4 text-gray-600">Gestiona tus publicaciones y tu equipo ejecutivo</p>

      <div className="border rounded p-4 mb-4 bg-white shadow">
        <h2 className="font-semibold mb-2 flex justify-between items-center">
          <span>👤 Ejecutivo Asignado</span>
          <button
            onClick={handleAgregarEjecutivo}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            ➕ Agregar Ejecutivo
          </button>
        </h2>

        {empresa?.ejecutivos?.length > 0 ? (
          empresa.ejecutivos.map((ej: any) => (
            <div key={ej._id} className="flex items-center justify-between border-t pt-2 mt-2">
              <div>
                <p className="font-bold">{ej.nombre}</p>
                <p className="text-sm text-gray-600">{ej.email}</p>
                <p className="text-sm text-gray-600">Teléfono: {ej.telefono || "Sin teléfono registrado"}</p>
              </div>
              <div className="space-x-2 flex items-center">
                <a
                  href={`mailto:${ej.email}`}
                  className="px-3 py-1 bg-blue-700 text-white text-sm rounded hover:bg-blue-800"
                  title="Enviar correo"
                >
                  Email
                </a>
                <a
                  href={ej.telefono ? `https://wa.me/${ej.telefono.replace(/[^\d]/g, "")}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 ${ej.telefono ? '' : 'opacity-50 pointer-events-none'}`}
                  title="Enviar WhatsApp"
                >
                  WhatsApp
                </a>
                <button
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded"
                  onClick={() => handleEliminarEjecutivo(ej.uid)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No tienes ejecutivos asignados aún.</p>
        )}
      </div>

      <div className="flex border-b mb-4">
        <button
          onClick={() => setTab("publicaciones")}
          className={`px-4 py-2 ${tab === "publicaciones" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
        >
          Publicaciones
        </button>
      </div>

      {tab === "publicaciones" && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Mis Publicaciones</h2>
            <Link
              to="/publicar-oferta"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Nueva Publicación
            </Link>
          </div>

          <div className="space-y-4">
            {ofertas.length === 0 ? (
              <p className="text-gray-500">No tienes publicaciones aún.</p>
            ) : (
              ofertas.map((o) => (
                <div key={o._id} className="border rounded p-4 bg-white shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{o.titulo}</h3>
                      <p className="text-sm text-gray-600">
                        Publicada el {new Date(o.fechaPublicacion).toLocaleDateString()} • Estado: {o.estado || "N/A"}
                      </p>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded ${
                      o.estado === "archivada" ? "bg-red-200 text-red-800" :
                      o.estado === "activa" ? "bg-green-200 text-green-800" :
                      "bg-yellow-200 text-yellow-800"}`}>
                      {o.estado}
                    </span>
                  </div>
                  <div className="mt-2 text-right">
                    <button onClick={() => toggleExpand(o._id)} className="text-blue-600 underline">
                      {expandedId === o._id ? "Ocultar detalles" : "Ver detalles"}
                    </button>
                  </div>

                  {expandedId === o._id && (
                    <div className="mt-4 border-t pt-4 text-sm text-gray-700 space-y-2">
                      <p><strong>Descripción:</strong> {o.descripcion}</p>
                      <p><strong>Modalidad:</strong> {o.modalidad}</p>
                      <p><strong>Jornada:</strong> {o.jornada}</p>
                      <p><strong>Ubicación:</strong> {o.ubicacion || "N/A"}</p>
                      <p><strong>Salario:</strong> {o.salario || "No especificado"}</p>
                      <p><strong>Etiquetas:</strong> {(o.etiquetas || []).join(", ")}</p>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <button
                          onClick={() => handleDelete(o._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                          Eliminar
                        </button>
                        <button
                          onClick={() => handleToggleEstado(o._id, o.estado)}
                          className={`${
                            o.estado === "activa"
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-green-600 hover:bg-green-700"
                          } text-white px-4 py-2 rounded`}
                        >
                          {o.estado === "activa" ? "Pausar" : "Activar"}
                        </button>
                        <Link
                          to={`/empresa/postulantes/${o._id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Ver postulantes
                        </Link>
                        <Link
                          to={`/editar-oferta/${o._id}`}
                          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        >
                          Editar
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </main>
  );
}
