import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

export default function RegisterUsuario() {
  const generarPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(18);
    doc.text("Curriculum Vitae", 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Nombre: ${nombre}`, 20, y);
    y += 8;
    doc.text(`Email: ${email}`, 20, y);
    y += 8;
    doc.text(`Teléfono: ${telefono}`, 20, y);
    y += 8;
    doc.text(`País: ${pais}`, 20, y);
    y += 10;
    doc.setFontSize(14);
    doc.text("Educación", 20, y);
    y += 8;
    doc.setFontSize(12);
    educaciones.forEach((edu) => {
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
    y += 6;
    doc.setFontSize(14);
    doc.text("Experiencia Laboral", 20, y);
    y += 8;
    doc.setFontSize(12);
    experiencias.forEach((exp) => {
      doc.text(`Año: ${exp.anio} - Empresa: ${exp.empresa} - Cargo: ${exp.cargo}`, 22, y);
      y += 6;
    });
    y += 6;
    if (habilidades) {
      doc.setFontSize(14);
      doc.text("Habilidades Técnicas", 20, y);
      y += 8;
      doc.setFontSize(12);
      doc.text(habilidades, 22, y);
      y += 6;
    }
    doc.save("CV.pdf");
  };
  const [educaciones, setEducaciones] = useState([
    { institucion: "", titulo: "", ciudad: "", pais: "", desde: "", hasta: "", cursos: "" }
  ]);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pais, setPais] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [noCv, setNoCv] = useState(false);
  const [experiencias, setExperiencias] = useState([
    { anio: "", empresa: "", cargo: "" }
  ]);
  const [habilidades, setHabilidades] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email || !pass || !nombre) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }
    if (email && !email.includes("@")) {
      setError("El correo debe tener un formato válido.");
      return;
    }
    if (pass.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      const formData = new FormData();
      formData.append("uid", user.uid);
      formData.append("nombre", nombre);
      formData.append("email", email);
      formData.append("telefono", telefono);
      formData.append("pais", pais);
      formData.append("rol", "profesional");
      formData.append("habilidades", JSON.stringify(habilidades.split(",").map((h) => h.trim())));
      if (cvFile) formData.append("cv", cvFile);
      if (videoFile) formData.append("videoPresentacion", videoFile);
  if (noCv) formData.append("experiencias", JSON.stringify(experiencias));
  formData.append("educaciones", JSON.stringify(educaciones));
      const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Error guardando en MongoDB");
      setSuccess(true);
      setTimeout(() => {
        navigate("/", { state: { success: true } });
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-lg bg-white shadow-md rounded px-8 py-6"
      >
        <h1 className="text-2xl font-bold mb-4">Registro de Trabajador / Usuario</h1>
        <input
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input mb-4"
        />
        <input
          placeholder="Contraseña *"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="input mb-4"
        />
        <input
          placeholder="Nombre completo *"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="input mb-4"
        />
        <input
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="input mb-4"
        />
        <input
          placeholder="País"
          value={pais}
          onChange={(e) => setPais(e.target.value)}
          className="input mb-4"
        />
        <input
          placeholder="Habilidades técnicas (opcional)"
          value={habilidades}
          onChange={(e) => setHabilidades(e.target.value)}
          className="input mb-4"
        />
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Educación</label>
          {educaciones.map((edu, idx) => (
            <div key={idx} className="mb-2 flex flex-col gap-2 border-b pb-2">
              <input
                placeholder="Institución"
                value={edu.institucion}
                onChange={e => {
                  const arr = [...educaciones];
                  arr[idx].institucion = e.target.value;
                  setEducaciones(arr);
                }}
                className="input"
              />
              <input
                placeholder="Título"
                value={edu.titulo}
                onChange={e => {
                  const arr = [...educaciones];
                  arr[idx].titulo = e.target.value;
                  setEducaciones(arr);
                }}
                className="input"
              />
              <input
                placeholder="Ciudad"
                value={edu.ciudad}
                onChange={e => {
                  const arr = [...educaciones];
                  arr[idx].ciudad = e.target.value;
                  setEducaciones(arr);
                }}
                className="input"
              />
              <input
                placeholder="País"
                value={edu.pais}
                onChange={e => {
                  const arr = [...educaciones];
                  arr[idx].pais = e.target.value;
                  setEducaciones(arr);
                }}
                className="input"
              />
              <input
                placeholder="Desde (año)"
                type="number"
                value={edu.desde}
                onChange={e => {
                  const arr = [...educaciones];
                  arr[idx].desde = e.target.value;
                  setEducaciones(arr);
                }}
                className="input"
              />
              <input
                placeholder="Hasta (año)"
                type="number"
                value={edu.hasta}
                onChange={e => {
                  const arr = [...educaciones];
                  arr[idx].hasta = e.target.value;
                  setEducaciones(arr);
                }}
                className="input"
              />
              <textarea
                placeholder="Cursos relevantes (opcional)"
                value={edu.cursos}
                onChange={e => {
                  const arr = [...educaciones];
                  arr[idx].cursos = e.target.value;
                  setEducaciones(arr);
                }}
                className="input"
              />
              <button type="button" onClick={() => {
                setEducaciones(educaciones.filter((_, i) => i !== idx));
              }} className="bg-red-500 text-white px-2 rounded self-end">Eliminar</button>
            </div>
          ))}
          <button type="button" onClick={() => setEducaciones([...educaciones, { institucion: "", titulo: "", ciudad: "", pais: "", desde: "", hasta: "", cursos: "" }])} className="bg-blue-500 text-white px-3 py-1 rounded mt-2">Agregar educación</button>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Video de presentación (opcional):</label>
          <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files?.[0] || null)} />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Curriculum Vitae (opcional):</label>
          <input type="file" accept=".pdf,.doc,.docx,image/*" onChange={e => setCvFile(e.target.files?.[0] || null)} />
        </div>
        <div className="mb-4 flex items-center">
          <input type="checkbox" checked={noCv} onChange={e => setNoCv(e.target.checked)} id="nocv" />
          <label htmlFor="nocv" className="ml-2">No tengo CV</label>
        </div>
        {noCv && (
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Experiencia laboral</label>
            {experiencias.map((exp, idx) => (
              <div key={idx} className="mb-2 flex gap-2">
                <input
                  type="number"
                  placeholder="Año"
                  value={exp.anio}
                  onChange={e => {
                    const arr = [...experiencias];
                    arr[idx].anio = e.target.value;
                    setExperiencias(arr);
                  }}
                  className="input w-20"
                />
                <input
                  placeholder="Empresa"
                  value={exp.empresa}
                  onChange={e => {
                    const arr = [...experiencias];
                    arr[idx].empresa = e.target.value;
                    setExperiencias(arr);
                  }}
                  className="input w-32"
                />
                <input
                  placeholder="Cargo"
                  value={exp.cargo}
                  onChange={e => {
                    const arr = [...experiencias];
                    arr[idx].cargo = e.target.value;
                    setExperiencias(arr);
                  }}
                  className="input w-32"
                />
                <button type="button" onClick={() => {
                  setExperiencias(experiencias.filter((_, i) => i !== idx));
                }} className="bg-red-500 text-white px-2 rounded">Eliminar</button>
              </div>
            ))}
            <button type="button" onClick={() => setExperiencias([...experiencias, { anio: "", empresa: "", cargo: "" }])} className="bg-blue-500 text-white px-3 py-1 rounded mt-2">Agregar experiencia</button>
          </div>
        )}
        <button
          type="submit"
          className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-full"
        >
          Registrar trabajador / usuario
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && (
          <div className="fixed top-0 left-0 w-full bg-green-500 text-white text-center py-2 z-50">
            Registro exitoso, redirigiendo...
            <button
              type="button"
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              onClick={generarPDF}
            >
              Descargar CV en PDF
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
