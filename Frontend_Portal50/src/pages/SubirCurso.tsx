// src/pages/SubirCurso.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { auth } from "../firebase"
import "react-datepicker/dist/react-datepicker.css";

export default function SubirCurso() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    precio: "",
    tipoPago: "sesion",
    duracionMinutos: "",
    videoIntro: null as File | null,
  });

  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [fechaTemp, setFechaTemp] = useState<Date | null>(null);
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormulario((prev) => ({ ...prev, videoIntro: e.target.files![0] }));
      setErrores((prev) => ({ ...prev, videoIntro: "" }));
    }
  };

  const agregarFecha = () => {
    if (
      fechaTemp &&
      !fechasSeleccionadas.some((f) => f.getTime() === fechaTemp.getTime())
    ) {
      setFechasSeleccionadas((prev) => [...prev, fechaTemp]);
      setFechaTemp(null);
    }
  };

  const eliminarFecha = (fechaAEliminar: Date) => {
    setFechasSeleccionadas(
      fechasSeleccionadas.filter(
        (f) => f.getTime() !== fechaAEliminar.getTime()
      )
    );
  };

  const validarFormulario = () => {
    const nuevosErrores: { [key: string]: string } = {};
    if (!formulario.titulo.trim()) nuevosErrores.titulo = "Campo obligatorio";
    if (!formulario.descripcion.trim()) nuevosErrores.descripcion = "Campo obligatorio";
    if (!formulario.categoria.trim()) nuevosErrores.categoria = "Campo obligatorio";
    if (!formulario.precio || parseFloat(formulario.precio) < 0) nuevosErrores.precio = "Precio inválido";
    if (!formulario.duracionMinutos) nuevosErrores.duracionMinutos = "Campo obligatorio";
    if (!formulario.videoIntro) nuevosErrores.videoIntro = "Debes subir un video";
    if (fechasSeleccionadas.length === 0) nuevosErrores.agenda = "Agrega al menos una fecha";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      // 1. Crear curso
      const crearCursoRes = await fetch("http://localhost:3000/api/cursos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profesionalId: user._id,
          titulo: formulario.titulo,
          descripcion: formulario.descripcion,
          categoria: formulario.categoria,
          precio: parseFloat(formulario.precio),
          tipoPago: formulario.tipoPago,
          duracionMinutos: parseInt(formulario.duracionMinutos),
          agendaDisponible: fechasSeleccionadas,
        }),
      });

      if (!crearCursoRes.ok) throw new Error("Error al crear curso");

      const nuevoCurso = await crearCursoRes.json();

      // 2. Subir video
      if (formulario.videoIntro) {
        const videoData = new FormData();
        videoData.append("videoCurso", formulario.videoIntro);

        const videoRes = await fetch(`http://localhost:3000/api/cursos/${nuevoCurso._id}/upload-video`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          body: videoData,
        });

        if (!videoRes.ok) throw new Error("Error al subir video");
      }

    setMensajeExito("✅ Curso publicado correctamente. Redirigiendo...");
    setTimeout(() => {
      navigate("/dashboard?tab=mis-cursos");
       }, 2000);
    } catch (error) {
      console.error("❌ Error al crear curso:", error);
      alert("Ocurrió un error al publicar el curso.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          🎓 Publicar nuevo curso
        </h1>
        {mensajeExito && (
          <div className="mb-4 p-3 text-green-800 bg-green-100 rounded border border-green-300 text-center font-medium">
            {mensajeExito}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="titulo"
              value={formulario.titulo}
              onChange={handleChange}
              placeholder="Título del curso"
              className="input w-full"
            />
            {errores.titulo && <p className="text-red-500 text-sm">{errores.titulo}</p>}
          </div>

          <div>
            <textarea
              name="descripcion"
              value={formulario.descripcion}
              onChange={handleChange}
              placeholder="Descripción completa"
              className="input w-full h-28 resize-none"
            />
            {errores.descripcion && <p className="text-red-500 text-sm">{errores.descripcion}</p>}
          </div>

          <div>
            <input
              name="categoria"
              value={formulario.categoria}
              onChange={handleChange}
              placeholder="Categoría (Ej: Ofimática, Soft Skills)"
              className="input w-full"
            />
            {errores.categoria && <p className="text-red-500 text-sm">{errores.categoria}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                name="precio"
                type="number"
                value={formulario.precio}
                onChange={handleChange}
                placeholder="Precio CLP"
                className="input"
                min={0}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") e.preventDefault();
                }}
              />
              {errores.precio && <p className="text-red-500 text-sm">{errores.precio}</p>}
            </div>
            <select
              name="tipoPago"
              value={formulario.tipoPago}
              onChange={handleChange}
              className="input"
            >
              <option value="sesion">Por sesión</option>
              <option value="mensual">Mensual</option>
            </select>
          </div>

          <div>
            <input
              name="duracionMinutos"
              type="number"
              value={formulario.duracionMinutos}
              onChange={handleChange}
              placeholder="Duración en minutos por sesión"
              className="input w-full"
              min={1}
            />
            {errores.duracionMinutos && <p className="text-red-500 text-sm">{errores.duracionMinutos}</p>}
          </div>

          {/* Agendamiento de fechas */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">
              Agenda disponible (selecciona varias):
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-grow">
                <DatePicker
                  selected={fechaTemp}
                  onChange={(date) => setFechaTemp(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  dateFormat="Pp"
                  placeholderText="Selecciona fecha y hora"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <button
                type="button"
                onClick={agregarFecha}
                className="h-[42px] px-4 bg-green-600 text-white rounded hover:bg-green-500 text-sm"
              >
                Agregar
              </button>
            </div>
            {errores.agenda && <p className="text-red-500 text-sm">{errores.agenda}</p>}
            <div className="flex flex-wrap gap-2 mt-2">
              {fechasSeleccionadas.map((fecha, idx) => (
                <div
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {fecha.toLocaleString()}
                  <button
                    type="button"
                    onClick={() => eliminarFecha(fecha)}
                    className="text-red-500 font-bold ml-2"
                    title="Eliminar"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Video */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">
              Video de introducción (MP4, MOV, AVI)
            </label>
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/x-msvideo"
              onChange={handleVideoChange}
              className="input"
            />
            {errores.videoIntro && <p className="text-red-500 text-sm">{errores.videoIntro}</p>}
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded w-full mt-4"
            disabled={loading}
          >
            {loading ? "Publicando..." : "Publicar Curso"}
          </button>
        </form>
      </div>
    </main>
  );
}
