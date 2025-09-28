import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pais, setPais] = useState("");
  const [rol, setRol] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [habilidades, setHabilidades] = useState("");
  const [idiomas, setIdiomas] = useState<{ idioma: string; nivel: string }[]>([
    { idioma: "", nivel: "" },
  ]);
  const [institucion, setInstitucion] = useState("");
  const [titulo, setTitulo] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleIdiomaChange = (
    index: number,
    field: "idioma" | "nivel",
    value: string
  ) => {
    const updated = [...idiomas];
    updated[index][field] = value;
    setIdiomas(updated);
  };

  const addIdioma = () => {
    setIdiomas([...idiomas, { idioma: "", nivel: "" }]);
  };

  const removeIdioma = (index: number) => {
    if (idiomas.length > 1) {
      const updated = idiomas.filter((_, i) => i !== index);
      setIdiomas(updated);
    }
  };

  const camposRequeridosIncompletos = !email || !pass || !nombre || !rol;
  const emailInvalido = email && !email.includes("@");
  const fechasInvalidas = desde && hasta && parseInt(desde) > parseInt(hasta);
  const passInvalida =
    pass && (pass.length < 6 || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass));

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError("");
  setSuccess(false);

  if (camposRequeridosIncompletos) {
    setError("Por favor completa todos los campos obligatorios.");
    return;
  }

  if (emailInvalido) {
    setError("El correo debe tener un formato válido.");
    return;
  }

  if (passInvalida) {
    setError("La contraseña debe tener mínimo 6 caracteres y un carácter especial.");
    return;
  }

  if (fechasInvalidas) {
    setError("El año de inicio no puede ser mayor al año de término.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    const idToken = await user.getIdToken();

    let url = "";
    let body = {};

    if (rol === "empresa") {
      url = "http://localhost:3000/api/empresas";
      body = {
        uid: user.uid,
        email,
        nombre,
        rut: "-", // Podrías pedir este dato en el formulario
        telefono,
        rol,
        direccion: pais,
        videoPresentacion: "",
        ejecutivos: [],
      };
    } else {
      url = "http://localhost:3000/api/users";
      body = {
        uid: user.uid,
        nombre,
        email,
        telefono,
        pais,
        rol,
        experiencia,
        habilidades:
          rol === "empresa"
            ? []
            : habilidades.split(",").map((h) => h.trim()),
        idiomas: rol === "empresa" ? [] : idiomas,
        educacion:
          rol === "empresa"
            ? []
            : [{ institucion, titulo, desde, hasta }],
      };
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("❌ Error guardando en MongoDB");

    setSuccess(true);
    setTimeout(() => {
      navigate("/", { state: { success: true } });
    }, 1000);
  } catch (err: any) {
    console.error(err);
    setError(err.message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-lg bg-white shadow-md rounded px-8 py-6"
      >
        <h1 className="text-2xl font-bold mb-4">Registro Portal50+</h1>

        <input
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`input ${emailInvalido ? "border-red-500" : ""}`}
        />
        {emailInvalido && (
          <p className="text-red-500 text-sm mb-2">
            El correo debe incluir un @ válido.
          </p>
        )}

        <input
          placeholder="Contraseña *"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className={`input ${passInvalida ? "border-red-500" : ""}`}
        />
        {passInvalida && (
          <p className="text-red-500 text-sm mb-2">
            Mínimo 6 caracteres y un carácter especial.
          </p>
        )}

        <input
          placeholder="Nombre completo *"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={`input ${!nombre && error ? "border-red-500" : ""}`}
        />
        {!nombre && error && (
          <p className="text-red-500 text-sm mb-2">El nombre es obligatorio.</p>
        )}

        <input
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="input"
        />

        <select
          value={pais}
          onChange={(e) => setPais(e.target.value)}
          className="input"
        >
          <option value="">Selecciona tu país</option>
          <option value="Chile">Chile</option>
          <option value="Argentina">Argentina</option>
          <option value="Perú">Perú</option>
          <option value="México">México</option>
          <option value="España">España</option>
          <option value="Colombia">Colombia</option>
        </select>

        <select
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          className="input"
        >
          <option value="">Elige tu rol</option>
          <option value="profesional">Profesional</option>
          <option value="empresa">Empresa</option>
          <option value="aprendiz">Aprendiz</option>
        </select>
        
        {rol !== "empresa" && (
          <textarea
            placeholder="Experiencia laboral"
            value={experiencia}
            onChange={(e) => setExperiencia(e.target.value)}
            className="input"
          />
        )}

        <input
          placeholder="Habilidades (separadas por coma)"
          value={habilidades}
          onChange={(e) => setHabilidades(e.target.value)}
          className="input"
          disabled={rol === "empresa"}
        />

        {rol !== "empresa" &&
          idiomas.map((lang, index) => (
            <div key={index} className="mb-4">
              <input
                placeholder="Idioma"
                value={lang.idioma}
                onChange={(e) =>
                  handleIdiomaChange(index, "idioma", e.target.value)
                }
                className="input"
              />
              <input
                placeholder="Nivel de idioma"
                value={lang.nivel}
                onChange={(e) =>
                  handleIdiomaChange(index, "nivel", e.target.value)
                }
                className="input"
              />

              {idiomas.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIdioma(index)}
                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  ❌ Quitar
                </button>
              )}
            </div>
          ))}

        {rol !== "empresa" && (
          <button
            type="button"
            onClick={addIdioma}
            className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded"
          >
            ➕ Agregar otro idioma
          </button>
        )}

        <input
          placeholder="Institución educativa"
          value={institucion}
          onChange={(e) => setInstitucion(e.target.value)}
          className="input"
          disabled={rol === "empresa"}
        />
        <input
          placeholder="Título obtenido"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="input"
          disabled={rol === "empresa"}
        />
        <input
          placeholder="Desde (año)"
          type="number"
          min="1900"
          max="2099"
          value={desde}
          onChange={(e) => setDesde(e.target.value)}
          className="input"
          disabled={rol === "empresa"}
        />
        <input
          placeholder="Hasta (año)"
          type="number"
          min="1900"
          max="2099"
          value={hasta}
          onChange={(e) => setHasta(e.target.value)}
          className="input"
          disabled={rol === "empresa"}
        />
        {fechasInvalidas && (
          <p className="text-red-500 text-sm mb-2">
            El año de inicio no puede ser mayor al año de término.
          </p>
        )}

        <button
          type="submit"
          disabled={camposRequeridosIncompletos}
          className={`mt-4 ${
            camposRequeridosIncompletos
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-400"
          } text-white py-2 px-4 rounded w-full`}
        >
          Registrarse
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      {success && (
        <div className="fixed top-0 left-0 w-full bg-green-500 text-white text-center py-2 z-50">
          ✅ Registro exitoso, redirigiendo...
        </div>
      )}
    </div>
  );
}
