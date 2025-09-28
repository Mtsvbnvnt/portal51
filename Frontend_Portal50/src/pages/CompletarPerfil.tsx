// src/pages/CompletarPerfil.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function CompletarPerfil() {
  const [user, setUser] = useState<any>(null);
  const [modalidad, setModalidad] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setModalidad(u.modalidadPreferida || "");
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;

    try {
      const idToken = await auth.currentUser?.getIdToken();

      // 1) Actualizar modalidad
      const res = await fetch(`http://localhost:3000/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ modalidadPreferida: modalidad }),
      });

      if (!res.ok) throw new Error("Error actualizando modalidad");

      // 2) Subir CV si hay archivo nuevo
      if (cvFile) {
        const formData = new FormData();
        formData.append("cv", cvFile);

        const resCv = await fetch(`http://localhost:3000/api/users/${user._id}/upload-cv`, {
          method: "POST",
          headers: { Authorization: `Bearer ${idToken}` },
          body: formData,
        });

        if (!resCv.ok) throw new Error("Error subiendo CV");
      }

      // 3) Subir video si hay archivo nuevo
      if (videoFile) {
        const formData = new FormData();
        formData.append("videoPresentacion", videoFile);

        const resVid = await fetch(`http://localhost:3000/api/users/${user._id}/upload-video`, {
          method: "POST",
          headers: { Authorization: `Bearer ${idToken}` },
          body: formData,
        });

        if (!resVid.ok) throw new Error("Error subiendo video");
      }

      setStatus("✅ Perfil actualizado correctamente");
      setTimeout(() => navigate("/dashboard"), 2000);

    } catch (err) {
      console.error(err);
      setStatus("❌ Error guardando cambios");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Completa tu Perfil Profesional</h1>

      <form
        onSubmit={handleSave}
        className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-6"
      >
        <div>
          <label className="block font-semibold mb-2">
            Modalidad de trabajo preferida *
          </label>
          <select
            value={modalidad}
            onChange={(e) => setModalidad(e.target.value)}
            required
            className="w-full border p-3 rounded"
          >
            <option value="">Selecciona una opción</option>
            <option value="tiempo completo">Tiempo Completo</option>
            <option value="fraccional">Fraccional</option>
            <option value="proyectos">Por Proyectos</option>
            <option value="híbrida">Híbrida</option>
            <option value="remoto">Remoto</option>
            <option value="presencial">Presencial</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2">Subir CV (opcional)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setCvFile(e.target.files?.[0] || null)}
            className="w-full"
          />
          {user?.cv && (
            <p className="text-sm mt-1">
              📎 CV actual:{" "}
              <a
                href={`http://localhost:3000/api/users/download/${user.cv.split('/').pop()}`}
                className="text-blue-600 underline"
                target="_blank"
                rel="noreferrer"
              >
                Descargar
              </a>
            </p>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-2">Subir Video de Presentación (opcional)</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            className="w-full"
          />
          {user?.videoPresentacion && (
            <p className="text-sm mt-1">
              🎥 Video actual:{" "}
              <a
                href={`http://localhost:3000${user.videoPresentacion}`}
                className="text-blue-600 underline"
                target="_blank"
                rel="noreferrer"
              >
                Ver Video
              </a>
            </p>
          )}
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 text-gray-600 underline"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full"
          >
            Guardar Cambios
          </button>
        </div>

        {status && (
          <p className="text-center text-sm mt-4">{status}</p>
        )}
      </form>
    </main>
  );
}
