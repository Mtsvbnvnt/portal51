# Portal 51 - Plataforma de Empleabilidad 50+

Portal 51 es una plataforma integral de empleabilidad diseñada específicamente para personas mayores de 50 años, conectando talento experimentado con empresas que valoran la experiencia.

## 📋 Descripción del Proyecto

Esta plataforma ofrece:
- 👥 **Registro y gestión de perfiles** para trabajadores y empresas
- 💼 **Sistema de publicación y postulación** de ofertas de trabajo
- 🎓 **Módulo de aprendizaje** con cursos y capacitaciones
- 📊 **Dashboard administrativo** para gestión completa
- 🔒 **Autenticación segura** con Firebase Auth
- 📱 **Interfaz responsive** y moderna

## 🏗️ Arquitectura

El proyecto está estructurado como una aplicación full-stack:

### Backend (`Backend_Portal50/`)
- **Framework**: Node.js con TypeScript
- **Base de datos**: MongoDB
- **Autenticación**: Firebase Admin SDK
- **API**: RESTful con Express.js
- **Documentación**: Swagger/OpenAPI
- **Upload de archivos**: Multer

### Frontend (`Frontend_Portal50/`)
- **Framework**: React con TypeScript
- **Styling**: Tailwind CSS
- **Build tool**: Vite
- **Autenticación**: Firebase Auth
- **Estado**: Context API

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB
- Firebase Project

### 1. Clonar el repositorio
```bash
git clone [repo-url]
cd portal51
```

### 2. Configurar Backend
```bash
cd Backend_Portal50
npm install
```

Crear archivo de configuración Firebase:
```bash
# Crear src/config/firebase.ts con tu configuración de Firebase
# Agregar serviceAccountKey.json con las credenciales del servicio
```

### 3. Configurar Frontend
```bash
cd ../Frontend_Portal50
npm install
```

Crear archivo de configuración Firebase:
```bash
# Crear src/firebase.ts con tu configuración de Firebase Web
```

### 4. Base de Datos
Restaurar backup de MongoDB (opcional):
```bash
mongorestore --db portal50 mongo-backup/
```

## 📂 Estructura del Proyecto

```
portal51/
├── Backend_Portal50/          # API Backend
│   ├── src/
│   │   ├── config/           # Configuraciones (DB, Firebase, Swagger)
│   │   ├── controllers/      # Controladores de rutas
│   │   ├── middlewares/      # Middlewares (auth, uploads)
│   │   ├── models/          # Modelos de datos
│   │   ├── routes/          # Definición de rutas
│   │   └── validators/      # Validadores de entrada
│   └── uploads/             # Archivos subidos
├── Frontend_Portal50/         # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas principales
│   │   ├── context/         # Context providers
│   │   └── services/        # Servicios API
└── mongo-backup/             # Backup de base de datos
```

## 🔧 Scripts Disponibles

### Backend
```bash
npm run dev     # Desarrollo
npm run build   # Compilar TypeScript
npm start       # Producción
```

### Frontend
```bash
npm run dev     # Servidor de desarrollo
npm run build   # Build de producción
npm run preview # Preview del build
```

## 🛡️ Seguridad

### Archivos Sensibles Excluidos
El `.gitignore` está configurado para excluir:
- ✅ Configuraciones de Firebase (`firebase.ts`, `serviceAccountKey.json`)
- ✅ Variables de entorno (`.env*`)
- ✅ Uploads de usuarios (CVs, fotos de perfil)
- ✅ Logs y archivos temporales
- ✅ Dependencias y builds

### Configuración de Firebase
⚠️ **Importante**: Nunca commitear las credenciales de Firebase. Usa variables de entorno en producción.

## 📝 Funcionalidades Principales

### Para Trabajadores 50+
- Registro y perfil completo
- Búsqueda y postulación a ofertas
- Cursos de capacitación
- Seguimiento de postulaciones

### Para Empresas
- Publicación de ofertas de trabajo
- Gestión de postulantes
- Filtros por experiencia
- Dashboard de métricas

### Para Administradores
- Gestión completa de usuarios
- Moderación de contenido
- Reportes y estadísticas
- Gestión de cursos

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

---

**Portal 51** - Conectando experiencia con oportunidad 🚀
