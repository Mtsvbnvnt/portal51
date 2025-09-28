import { createContext, useState, useEffect } from "react";

export interface User {
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
  rol?: "profesional" | "profesional-ejecutivo" | "empresa";
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.fotoPerfil && !parsed.fotoPerfil.startsWith("http")) {
        parsed.fotoPerfil = `http://localhost:3000${parsed.fotoPerfil}`;
      }
      setUser(parsed);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
