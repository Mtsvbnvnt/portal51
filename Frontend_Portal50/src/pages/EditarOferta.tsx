// src/pages/EditarOferta.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function EditarOferta() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [modalidad, setModalidad] = useState("remota");
  const [jornada, setJornada] = useState("tiempo completo");
  const [ubicacion, setUbicacion] = useState("");
  const [salario, setSalario] = useState("");
  const [etiquetas, setEtiquetas] = useState("");
  const [preguntas, setPreguntas] = useState<
    { pregunta: string; obligatoria: boolean }[]
  >([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchOferta = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/jobs/${jobId}`);
        if (!res.ok) throw new Error("Error cargando oferta");
        const data = await res.json();
        setTitulo(data.titulo);
        setDescripcion(data.descripcion);
        setModalidad(data.modalidad);
        setJornada(data.jornada);
        setUbicacion(data.ubicacion || "");
        setSalario(data.salario || "");
        setEtiquetas((data.etiquetas || []).join(", "));

        // 🟢 Asegurarse de normalizar la estructura al cargar
        const parsedPreguntas = Array.isArray(data.preguntas)
          ? data.preguntas.map((p: any) => ({
              pregunta: p?.pregunta || "",
              obligatoria: !!p?.obligatoria,
            }))
          : [];
        setPreguntas(parsedPreguntas);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOferta();
  }, [jobId]);

  const handleAddPregunta = () => {
    setPreguntas([
      ...preguntas,
      { pregunta: "", obligatoria: false }
    ]);
  };

  const handlePreguntaChange = (
    index: number,
    field: "pregunta" | "obligatoria",
    value: any
  ) => {
    const updated = preguntas.map((p, i) =>
      i === index
        ? { ...p, [field]: field === "pregunta" ? value : !!value }
        : p
    );
    setPreguntas(updated);
  };

  const handleRemovePregunta = (index: number) => {
    const updated = [...preguntas];
    updated.splice(index, 1);
    setPreguntas(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");

    try {
      const idToken = await auth.currentUser?.getIdToken();

      // ✅ Normalizar preguntas: filtro de strings/valores nulos
      const cleanedPreguntas = preguntas
        .filter((p) => typeof p === "object" && p.pregunta.trim() !== "")
        .map((p) => ({
          pregunta: p.pregunta.trim(),
          obligatoria: !!p.obligatoria
        }));

      const res = await fetch(`http://localhost:3000/api/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          modalidad,
          jornada,
          ubicacion: modalidad === "remota" ? "" : ubicacion,
          salario,
          etiquetas: etiquetas.split(",").map((e) => e.trim()),
          preguntas: cleanedPreguntas,
        }),
      });

      if (!res.ok) throw new Error("Error actualizando oferta");

      setStatus("✅ Oferta actualizada correctamente.");
      setTimeout(() => {
        navigate("/empresa");
      }, 1500);
    } catch (err) {
      console.error(err);
      setStatus("❌ Error actualizando la oferta.");
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-blue-600 text-center">
        Editar Oferta
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-4"
      >
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título del cargo *"
          required
          className="w-full border p-3 rounded"
        />

        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción detallada *"
          required
          className="w-full border p-3 rounded"
          rows={5}
        />

        <div className="flex space-x-4">
          <select
            value={modalidad}
            onChange={(e) => setModalidad(e.target.value)}
            className="w-full border p-3 rounded"
          >
            <option value="remota">Remota</option>
            <option value="presencial">Presencial</option>
            <option value="híbrida">Híbrida</option>
          </select>

          <select
            value={jornada}
            onChange={(e) => setJornada(e.target.value)}
            className="w-full border p-3 rounded"
          >
            <option value="tiempo completo">Tiempo Completo</option>
            <option value="part-time">Part time</option>
          </select>
        </div>

        {modalidad !== "remota" && (
          <input
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            placeholder="Ubicación (Ciudad, País)"
            className="w-full border p-3 rounded"
          />
        )}

        <input
          value={salario}
          onChange={(e) => setSalario(e.target.value)}
          placeholder="Rango salarial (opcional)"
          className="w-full border p-3 rounded"
        />

        <input
          value={etiquetas}
          onChange={(e) => setEtiquetas(e.target.value)}
          placeholder="Etiquetas (separadas por coma)"
          className="w-full border p-3 rounded"
        />

        <div className="space-y-3 border-t pt-4">
          <h2 className="text-lg font-semibold">Preguntas para postulantes</h2>

          {preguntas.map((p, i) => (
            <div key={i} className="flex items-center space-x-2">
              <input
                type="text"
                value={p.pregunta}
                onChange={(e) =>
                  handlePreguntaChange(i, "pregunta", e.target.value)
                }
                placeholder={`Pregunta #${i + 1}`}
                className="flex-1 border p-2 rounded"
              />
              <label className="flex items-center space-x-1 text-sm">
                <input
                  type="checkbox"
                  checked={p.obligatoria}
                  onChange={(e) =>
                    handlePreguntaChange(i, "obligatoria", e.target.checked)
                  }
                />
                <span>Obligatoria</span>
              </label>
              <button
                type="button"
                onClick={() => handleRemovePregunta(i)}
                className="text-red-600 text-sm hover:underline"
              >
                ✖
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddPregunta}
            className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded"
          >
            ➕ Agregar Pregunta
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition"
          >
            Guardar Cambios
          </button>
        </div>

        {status && (
          <p className="text-center text-sm mt-2">{status}</p>
        )}
      </form>
    </main>
  );
}
