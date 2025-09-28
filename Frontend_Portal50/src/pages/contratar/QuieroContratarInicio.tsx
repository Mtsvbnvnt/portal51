import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getUserRoleByUid } from "../../services/userRole";
import { saveTipoContratacion } from "../../services/empresaService";
import ContratacionCard from "../../components/contratar/ContratacionCard";

const opciones = [
  {
    key: "tiempo_completo",
    icon: "💼",
    title: "Profesionales Certificados Tiempo Completo",
    description: "Contrata talento validado para jornadas completas en tu empresa.",
  },
  {
    key: "fraccional",
    icon: "⏳",
    title: "Profesionales Certificados Fraccionales",
    description: "Accede a expertos por horas o proyectos específicos.",
  },
  {
    key: "consultoria",
    icon: "🧑‍💼",
    title: "Consultoría",
    description: "Recibe asesoría estratégica de profesionales senior.",
  },
  {
    key: "mentoria",
    icon: "🎓",
    title: "Mentoría",
    description: "Impulsa el desarrollo de tu equipo con mentoría personalizada.",
  },
];

export default function QuieroContratarInicio() {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRole = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        navigate(`/auth/login?redirect=/contratar`);
        return;
      }
      const role = await getUserRoleByUid(user.uid);
      if (role !== "empresa") {
       navigate("/acceso-no-autorizado");
      }
    };
    checkAuthAndRole();
  }, [navigate]);

  const handleSelect = async (key: string) => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        navigate(`/auth/login?redirect=/contratar`);
        return;
      }
      const token = await user.getIdToken();
      await saveTipoContratacion(user.uid, key, token);
      setSelected(key);
      setTimeout(() => {
        navigate("/contratar/como-funciona");
      }, 600);
    } catch (err) {
      alert("No se pudo guardar la preferencia. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">¿Qué tipo de servicio necesitas?</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {opciones.map((op) => (
          <ContratacionCard
            key={op.key}
            icon={<span>{op.icon}</span>}
            title={op.title}
            description={op.description}
            onSelect={() => handleSelect(op.key)}
            selected={selected === op.key}
          />
        ))}
      </div>
      {loading && <div className="mt-8 text-blue-600 font-semibold">Guardando preferencia...</div>}
    </div>
  );
}
