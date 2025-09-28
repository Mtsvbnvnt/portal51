// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AdminFraccional from "./pages/AdminFraccional";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterSelector from "./pages/RegisterSelector";
import RegisterEmpresa from "./pages/RegisterEmpresa";
import RegisterUsuario from "./pages/RegisterUsuario";
import Configuracion from "./pages/Configuracion";
import QuieroContratar from "./pages/Quierocontratar";
import EmpresaPanel from "./pages/EmpresaPanel";
import PublicarOferta from "./pages/PublicarOferta";
import EmpresaPostulantes from "./pages/EmpresaPostulantes";
import Trabajar from "./pages/Trabajar";
import PostularOferta from "./pages/PostularOferta";
import EditarOferta from "./pages/EditarOferta";
import Trabajadores from "./pages/Trabajadores";
import CompletarPerfil from "./pages/CompletarPerfil";
import PerfilTrabajador from "./pages/PerfilTrabajador";
import Aprender from "./pages/Aprender";
import ProfesionalAprender from "./pages/ProfesionalAprender";
import CursoDetalle from "./pages/CursoDetalle";
import SubirCurso from "./pages/SubirCurso";


export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
             <Route path="/register" element={<RegisterSelector />} />
             <Route path="/register-empresa" element={<RegisterEmpresa />} />
             <Route path="/register-usuario" element={<RegisterUsuario />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/empresa" element={<EmpresaPanel />} />
            <Route path="/quiero-contratar" element={<QuieroContratar />} />
            <Route path="/publicar-oferta" element={<PublicarOferta />} />
            <Route path="/postular-oferta/:jobId" element={<PostularOferta />} />
            <Route path="/trabajar" element={<Trabajar />} />
            <Route path="/completar-perfil" element={<CompletarPerfil />} />
            <Route path="/quiero-contratar/trabajadores" element={<Trabajadores />} />
            <Route path="/empresa/postulantes/:jobId" element={<EmpresaPostulantes />} />
            <Route path="/perfil-trabajador/:id" element={<PerfilTrabajador />} />
            <Route path="/editar-oferta/:jobId" element={<EditarOferta />} />
            <Route path="/aprender" element={<Aprender />} />
            <Route path="/aprender/profesional/:uid" element={<ProfesionalAprender />} />
            <Route path="/subir-curso" element={<SubirCurso />} />
            <Route path="/aprender/curso/:id" element={<CursoDetalle />} />
            <Route path="/admin-fraccional" element={<AdminFraccional />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
