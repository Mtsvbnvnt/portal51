import { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  LiaSaveSolid,
  LiaFileUploadSolid,
  LiaVideoSolid,
  LiaTimesSolid,
  LiaIdCard,
  LiaImageSolid,
} from "react-icons/lia";
import { useNavigate } from "react-router-dom";

export default function Configuracion() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const navigate = useNavigate();
  const [pais, setPais] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [educacion, setEducacion] = useState({
    institucion: "",
    titulo: "",
    desde: "",
    hasta: "",
  });
  const [idiomas, setIdiomas] = useState([{ idioma: "", nivel: "" }]);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [modalidadPreferida, setModalidadPreferida] = useState("");
  const [status, setStatus] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [useruid, setUseruid] = useState<string | null>(null);
  const [rol, setRol] = useState("");
  const [disponibilidad, setDisponibilidad] = useState("disponible");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
  const loadPreviewImagen = async (fotoPerfilLocal: string | undefined, id: string, rol: string) => {
    let fotoFinal = fotoPerfilLocal;

    if (rol === "empresa") {
      try {
        const idToken = await auth.currentUser?.getIdToken();
        const res = await fetch(`http://localhost:3000/api/empresas/${id}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        if (res.ok) {
          const empresa = await res.json();
          if (empresa.fotoPerfil) {
            fotoFinal = empresa.fotoPerfil;

            const stored = localStorage.getItem("user");
            if (stored) {
              const user = JSON.parse(stored);
              user.fotoPerfil = empresa.fotoPerfil;
              localStorage.setItem("user", JSON.stringify(user));
            }
          }
        }
      } catch (err) {
        console.warn("Error al obtener datos empresa:", err);
      }
    }

    if (fotoFinal) {
      const fullUrl = fotoFinal.startsWith("http")
        ? fotoFinal
        : `http://localhost:3000${fotoFinal}`;
      setPreviewUrl(fullUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const stored = localStorage.getItem("user");
  if (stored) {
    const user = JSON.parse(stored);
    setNombre(user.nombre || "");
    setTelefono(user.telefono || "");
    { rol === "profesional" && (setPais(user.pais || ""))}
    setPais(user.direccion || "");
    setExperiencia(user.experiencia || "");
    setModalidadPreferida(user.modalidadPreferida || "");
    setDisponibilidad(user.disponibilidad || "disponible");
    if (user.educacion?.length) setEducacion(user.educacion[0]);
    if (user.idiomas?.length) setIdiomas(user.idiomas);
    setUserId(user._id || user.uid);
    setUseruid(user.uid);
    setRol(user.rol || "profesional");
    loadPreviewImagen(user.fotoPerfil, user._id || user.uid, user.rol || "profesional");
  }
}, []);

  const handleUploadProfilePic = async () => {
    if (!profilePic || !userId) return;
    if (profilePic.size > 2 * 1024 * 1024) {
      setStatus("❌ Imagen supera 2MB");
      return;
    }

    const allowed = ["image/jpeg", "image/png"];
    if (!allowed.includes(profilePic.type)) {
      setStatus("❌ Solo .jpg o .png permitidos");
      return;
    }

    const formData = new FormData();
    formData.append("fotoPerfil", profilePic);

    try {
      const idToken = await auth.currentUser?.getIdToken();

      const endpoint =
        rol === "empresa"
          ? `http://localhost:3000/api/empresas/${userId}/upload-foto-perfil`
          : `http://localhost:3000/api/users/${userId}/upload-foto-perfil`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
        body: formData,
      });

      if (!res.ok) throw new Error();
      const data = await res.json();

      const fullUrl = data.fotoPerfil.startsWith("http")
        ? data.fotoPerfil
        : `http://localhost:3000${data.fotoPerfil}`;

      setPreviewUrl(fullUrl);

      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        user.fotoPerfil = fullUrl;
        localStorage.setItem("user", JSON.stringify(user));
      }

      setStatus("✅ Imagen subida correctamente");
    } catch {
      setStatus("❌ Error al subir imagen");
    }
  };

  const handleIdiomaChange = (index: number, field: "idioma" | "nivel", value: string) => {
    const updated = [...idiomas];
    updated[index][field] = value;
    setIdiomas(updated);
  };

  const addIdioma = () => setIdiomas([...idiomas, { idioma: "", nivel: "" }]);

  const removeIdioma = (index: number) => {
    if (idiomas.length > 1) {
      setIdiomas(idiomas.filter((_, i) => i !== index));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setStatus("");

    try {
      const idToken = await auth.currentUser?.getIdToken();
      const endpoint =
        rol === "empresa"
          ? `http://localhost:3000/api/empresas/${userId}`
          : `http://localhost:3000/api/users/${userId}`;

      const payload =
        rol === "empresa"
          ? { nombre, telefono, direccion: pais }
          : {
              nombre,
              telefono,
              pais,
              experiencia,
              educacion: [educacion],
              idiomas,
              modalidadPreferida,
              disponibilidad,
            };

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });
      console.log("📤 Payload enviado:", payload);
      console.log("📥 Respuesta:", res.status);
      if (!res.ok) throw new Error();
      setStatus("✅ Datos actualizados");
      {rol !== "empresa" &&(
      setTimeout(() => {
        navigate("/dashboard");
        window.location.reload();}, 2000)
      )}
      setTimeout(() => {
        navigate("/empresa");
        window.location.reload();}, 2000)
    } catch {
      setStatus("❌ Error al actualizar");
    }
  };

  const handleUploadCV = async () => {
    if (!cvFile || !userId) return;
    if (cvFile.size > 5 * 1024 * 1024) {
      setStatus("❌ El archivo CV supera 5MB");
      return;
    }
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(cvFile.type)) {
      setStatus("❌ Formato CV no permitido");
      return;
    }
    const formData = new FormData();
    formData.append("cv", cvFile);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const res = await fetch(`http://localhost:3000/api/users/${userId}/upload-cv`, {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
        body: formData,
      });
      if (!res.ok) throw new Error();
      setStatus("✅ CV subido correctamente");
    } catch {
      setStatus("❌ Error al subir CV");
    }
  };

  const handleUploadVideo = async () => {
    if (!videoFile || !userId) return;
    if (videoFile.size > 50 * 1024 * 1024) {
      setStatus("❌ El video supera 50MB");
      return;
    }
    const allowed = ["video/mp4", "video/quicktime", "video/x-msvideo"];
    if (!allowed.includes(videoFile.type)) {
      setStatus("❌ Formato video no permitido");
      return;
    }
    const formData = new FormData();
    formData.append("videoPresentacion", videoFile);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const res = await fetch(`http://localhost:3000/api/users/${userId}/upload-video`, {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
        body: formData,
      });
      if (!res.ok) throw new Error();
      setStatus("✅ Video subido correctamente");
    } catch {
      setStatus("❌ Error al subir video");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-10">
      <LiaIdCard className="text-6xl text-blue-600" />
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Configuración de perfil</h1>

      {userId && (
        <div className="mb-4 p-4 bg-white border rounded shadow text-gray-700 w-full max-w-6xl">
          <p className="font-bold text-sm text-gray-600 mb-1">🔑 ID de Usuario</p>
          <p className="text-xs break-all">{useruid}</p>
          <p className="text-xs text-gray-500">Este ID se usa para asociarte como ejecutivo en una empresa.</p>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="w-full max-w-6xl grid md:grid-cols-2 gap-8 bg-white p-6 rounded shadow"
      >
        {/* Columna izquierda */}
        <div className="space-y-4">
          <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full border p-3 rounded" />
          <input placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full border p-3 rounded" />
          <input placeholder="País" value={pais} onChange={(e) => setPais(e.target.value)} className="w-full border p-3 rounded" />
          
          {rol !== "empresa" && (
          <textarea placeholder="Experiencia o Descripción" value={experiencia} onChange={(e) => setExperiencia(e.target.value)} className="w-full border p-3 rounded" />
          )}

          {rol !== "empresa" && (
            <div>
              <label className="block font-bold mb-1">Modalidad preferida</label>
              <select value={modalidadPreferida} onChange={(e) => setModalidadPreferida(e.target.value)} className="w-full border p-3 rounded">
                <option value="">Selecciona una opción</option>
                <option value="tiempo completo">Tiempo Completo</option>
                <option value="fraccional">Fraccional</option>
                <option value="proyectos">Por Proyectos</option>
                <option value="híbrida">Híbrida</option>
                <option value="remoto">Remoto</option>
                <option value="presencial">Presencial</option>
              </select>
            </div>
          )}

          {rol !== "empresa" && (
          <div>
            <label className="block font-bold mb-1">Estado de disponibilidad</label>
            <select
              value={disponibilidad}
              onChange={(e) => setDisponibilidad(e.target.value)}
              className="w-full border p-3 rounded"
            >
              <option value="disponible">🟢 Disponible</option>
              <option value="con condiciones">🟡 Con condiciones</option>
              <option value="no disponible">🔴 No disponible</option>
            </select>
          </div>
          )}

          {rol !== "empresa" && (
            <>
              <h3 className="font-bold">Idiomas</h3>
              {idiomas.map((lang, i) => (
                <div key={i} className="flex space-x-2 mb-2">
                  <input placeholder="Idioma" value={lang.idioma} onChange={(e) => handleIdiomaChange(i, "idioma", e.target.value)} className="flex-1 border p-2 rounded" />
                  <input placeholder="Nivel" value={lang.nivel} onChange={(e) => handleIdiomaChange(i, "nivel", e.target.value)} className="flex-1 border p-2 rounded" />
                  {idiomas.length > 1 && (
                    <button type="button" onClick={() => removeIdioma(i)} className="text-red-500"><LiaTimesSolid /></button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addIdioma} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">➕ Agregar Idioma</button>

              <h3 className="font-bold mt-4">Educación</h3>
              <input placeholder="Institución" value={educacion.institucion} onChange={(e) => setEducacion({ ...educacion, institucion: e.target.value })} className="w-full border p-3 rounded" />
              <input placeholder="Título" value={educacion.titulo} onChange={(e) => setEducacion({ ...educacion, titulo: e.target.value })} className="w-full border p-3 rounded" />
              <div className="flex space-x-2">
                <input placeholder="Desde (año)" value={educacion.desde} onChange={(e) => setEducacion({ ...educacion, desde: e.target.value })} className="w-full border p-3 rounded" />
                <input placeholder="Hasta (año)" value={educacion.hasta} onChange={(e) => setEducacion({ ...educacion, hasta: e.target.value })} className="w-full border p-3 rounded" />
              </div>
            </>
          )}

          <button type="submit" className="flex items-center bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
            <LiaSaveSolid className="mr-2" /> Guardar Cambios
          </button>
        </div>

        {/* Columna derecha */}
        <div className="space-y-8">
          {/* Preview Imagen de Perfil */}
          <div>
            <div className="flex justify-center mb-2">
              <img
                src={previewUrl || "/default-user.png"}
                alt="Preview"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/default-user.png";
                }}
                className="w-64 h-64 rounded-full object-cover border-4 border-blue-500 shadow"
              />
            </div>
            <h3 className="font-bold mb-2">Imagen de Perfil (.jpg, .png, máx 2MB)</h3>
            <input type="file" accept=".jpg,.png" onChange={(e) => setProfilePic(e.target.files?.[0] || null)} className="w-full border p-2 rounded" />
            <button type="button" onClick={handleUploadProfilePic} className="mt-2 flex items-center bg-pink-600 text-white px-6 py-3 rounded hover:bg-pink-700">
              <LiaImageSolid className="mr-2" /> Subir Imagen
            </button>
          </div>

          <div>
            <h3 className="font-bold mb-2">Subir CV (PDF, DOC, DOCX, máx 5MB)</h3>
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCvFile(e.target.files?.[0] || null)} className="w-full border p-2 rounded" />
            <button type="button" onClick={handleUploadCV} className="mt-2 flex items-center bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
              <LiaFileUploadSolid className="mr-2" /> Subir CV
            </button>
          </div>

          <div>
            <h3 className="font-bold mb-2">Subir Video Presentación (MP4, MOV, AVI, máx 50MB)</h3>
            <input type="file" accept=".mp4,.mov,.avi" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="w-full border p-2 rounded" />
            <button type="button" onClick={handleUploadVideo} className="mt-2 flex items-center bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700">
              <LiaVideoSolid className="mr-2" /> Subir Video
            </button>
          </div>
        </div>
      </form>

      {status && <p className="mt-4 text-center">{status}</p>}
    </main>
  );
}
