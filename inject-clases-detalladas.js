// Script para inyectar clases detalladas y materiales a cursos existentes
// Ejecutar con: mongosh portal50 inject-clases-detalladas.js

print("🎓 Iniciando inyección de clases detalladas...");

// Primero verificamos si hay cursos existentes
const cursosExistentes = db.cursos.find({}).toArray();

if (cursosExistentes.length === 0) {
  print("❌ No hay cursos en la base de datos.");
  print("💡 Primero ejecuta inject-cursos.js para crear cursos.");
  exit();
}

print(`✅ Encontrados ${cursosExistentes.length} cursos existentes`);

// Función para generar clases según la categoría del curso
function generarClasesPorCategoria(curso) {
  const clasesBase = [];
  
  switch (curso.categoria) {
    case "Programación":
      if (curso.titulo.includes("React")) {
        clasesBase.push(
          {
            numeroClase: 1,
            titulo: "Introducción a React y JSX",
            descripcion: "Conceptos fundamentales de React, componentes funcionales, JSX y estructura básica de una aplicación.",
            duracionMinutos: 90,
            objetivos: [
              "Entender qué es React y sus ventajas",
              "Configurar el entorno de desarrollo",
              "Crear primeros componentes con JSX",
              "Comprender el Virtual DOM"
            ],
            materialesAdicionales: [
              { nombre: "Guía de instalación React", url: "#", tipo: "pdf" },
              { nombre: "Documentación oficial React", url: "https://react.dev/", tipo: "link" },
              { nombre: "Códigos de ejemplo", url: "#", tipo: "archivo" }
            ]
          },
          {
            numeroClase: 2,
            titulo: "Estados y Props",
            descripcion: "Manejo de estados locales con useState, comunicación entre componentes mediante props y lifting state up.",
            duracionMinutos: 90,
            objetivos: [
              "Manejar estado local con useState",
              "Pasar datos entre componentes con props",
              "Implementar lifting state up",
              "Manejar eventos en React"
            ],
            prerequisitos: ["Clase 1: Introducción a React"],
            materialesAdicionales: [
              { nombre: "Ejercicios de Estado y Props", url: "#", tipo: "pdf" },
              { nombre: "Proyecto: Lista de Tareas", url: "#", tipo: "archivo" }
            ]
          },
          {
            numeroClase: 3,
            titulo: "Hooks Avanzados",
            descripcion: "useEffect, useContext, useReducer y custom hooks. Manejo de efectos secundarios y optimización.",
            duracionMinutos: 90,
            objetivos: [
              "Dominar useEffect y ciclos de vida",
              "Implementar useContext para estado global",
              "Crear custom hooks reutilizables",
              "Optimizar rendimiento con useMemo y useCallback"
            ],
            prerequisitos: ["Clase 2: Estados y Props"],
            materialesAdicionales: [
              { nombre: "Guía de Hooks", url: "#", tipo: "pdf" },
              { nombre: "Patrones de Custom Hooks", url: "#", tipo: "pdf" }
            ]
          },
          {
            numeroClase: 4,
            titulo: "Proyecto Final: Aplicación Completa",
            descripcion: "Desarrollo de una aplicación completa integrando todos los conceptos aprendidos.",
            duracionMinutos: 120,
            objetivos: [
              "Integrar todos los conceptos de React",
              "Implementar routing con React Router",
              "Conectar con APIs externas",
              "Desplegar la aplicación"
            ],
            prerequisitos: ["Clase 3: Hooks Avanzados"],
            materialesAdicionales: [
              { nombre: "Especificaciones del Proyecto", url: "#", tipo: "pdf" },
              { nombre: "API de ejemplo", url: "https://jsonplaceholder.typicode.com/", tipo: "link" },
              { nombre: "Guía de despliegue", url: "#", tipo: "pdf" }
            ]
          }
        );
      }
      break;

    case "Marketing":
      clasesBase.push(
        {
          numeroClase: 1,
          titulo: "Fundamentos del Marketing Digital",
          descripcion: "Conceptos básicos, ecosistema digital, customer journey y métricas clave.",
          duracionMinutos: 60,
          objetivos: [
            "Comprender el ecosistema del marketing digital",
            "Identificar el customer journey",
            "Definir KPIs y métricas importantes",
            "Crear buyer personas"
          ],
          materialesAdicionales: [
            { nombre: "Template Buyer Persona", url: "#", tipo: "pdf" },
            { nombre: "Guía de KPIs", url: "#", tipo: "pdf" }
          ]
        },
        {
          numeroClase: 2,
          titulo: "Estrategias en Redes Sociales",
          descripcion: "Creación de contenido, manejo de comunidades, publicidad en Facebook e Instagram.",
          duracionMinutos: 60,
          objetivos: [
            "Desarrollar estrategia de contenido",
            "Optimizar perfiles en redes sociales",
            "Crear campañas publicitarias efectivas",
            "Analizar métricas de engagement"
          ],
          prerequisitos: ["Clase 1: Fundamentos del Marketing Digital"],
          materialesAdicionales: [
            { nombre: "Calendario de contenido", url: "#", tipo: "pdf" },
            { nombre: "Herramientas de diseño gratuitas", url: "https://canva.com", tipo: "link" }
          ]
        },
        {
          numeroClase: 3,
          titulo: "SEO y Marketing de Contenidos",
          descripcion: "Optimización para motores de búsqueda, estrategia de contenidos y blogging.",
          duracionMinutos: 60,
          objetivos: [
            "Implementar SEO on-page y off-page",
            "Crear estrategia de contenidos",
            "Usar herramientas de keyword research",
            "Medir resultados orgánicos"
          ],
          prerequisitos: ["Clase 2: Estrategias en Redes Sociales"],
          materialesAdicionales: [
            { nombre: "Checklist SEO", url: "#", tipo: "pdf" },
            { nombre: "Google Keyword Planner", url: "https://ads.google.com/", tipo: "link" }
          ]
        },
        {
          numeroClase: 4,
          titulo: "Email Marketing y Automatización",
          descripcion: "Campañas de email, segmentación, automatización y análisis de resultados.",
          duracionMinutos: 60,
          objetivos: [
            "Diseñar campañas de email efectivas",
            "Implementar automatización de marketing",
            "Segmentar audiencias",
            "Analizar métricas de email marketing"
          ],
          prerequisitos: ["Clase 3: SEO y Marketing de Contenidos"],
          materialesAdicionales: [
            { nombre: "Templates de Email", url: "#", tipo: "pdf" },
            { nombre: "Guía de Mailchimp", url: "#", tipo: "pdf" }
          ]
        }
      );
      break;

    case "Data Science":
      clasesBase.push(
        {
          numeroClase: 1,
          titulo: "Introducción a Python para Análisis",
          descripcion: "Configuración del entorno, pandas básico, numpy y primeros análisis exploratorios.",
          duracionMinutos: 120,
          objetivos: [
            "Configurar entorno Python para data science",
            "Dominar pandas para manipulación de datos",
            "Usar numpy para operaciones numéricas",
            "Realizar análisis exploratorio básico"
          ],
          materialesAdicionales: [
            { nombre: "Dataset de práctica", url: "#", tipo: "archivo" },
            { nombre: "Cheat sheet pandas", url: "#", tipo: "pdf" },
            { nombre: "Jupyter Notebook templates", url: "#", tipo: "archivo" }
          ]
        },
        {
          numeroClase: 2,
          titulo: "Visualización de Datos",
          descripcion: "Matplotlib, seaborn y plotly. Creación de gráficos efectivos y dashboards.",
          duracionMinutos: 120,
          objetivos: [
            "Crear visualizaciones con matplotlib",
            "Usar seaborn para gráficos estadísticos",
            "Desarrollar dashboards interactivos",
            "Aplicar principios de visualización efectiva"
          ],
          prerequisitos: ["Clase 1: Introducción a Python"],
          materialesAdicionales: [
            { nombre: "Galería de gráficos", url: "#", tipo: "pdf" },
            { nombre: "Paletas de colores", url: "#", tipo: "pdf" }
          ]
        },
        {
          numeroClase: 3,
          titulo: "Análisis Estadístico Avanzado",
          descripcion: "Estadística descriptiva, correlaciones, regresiones y pruebas de hipótesis.",
          duracionMinutos: 120,
          objetivos: [
            "Realizar análisis estadístico descriptivo",
            "Implementar regresiones lineales y logísticas",
            "Ejecutar pruebas de hipótesis",
            "Interpretar resultados estadísticos"
          ],
          prerequisitos: ["Clase 2: Visualización de Datos"],
          materialesAdicionales: [
            { nombre: "Formulario estadístico", url: "#", tipo: "pdf" },
            { nombre: "Casos de estudio", url: "#", tipo: "archivo" }
          ]
        }
      );
      break;

    case "Gestión":
      clasesBase.push(
        {
          numeroClase: 1,
          titulo: "Introducción a Metodologías Ágiles",
          descripcion: "Historia y principios ágiles, diferencias con metodologías tradicionales.",
          duracionMinutos: 75,
          objetivos: [
            "Comprender los principios ágiles",
            "Identificar cuándo usar metodologías ágiles",
            "Conocer el Manifiesto Ágil",
            "Comparar enfoques tradicionales vs ágiles"
          ],
          materialesAdicionales: [
            { nombre: "Manifiesto Ágil", url: "https://agilemanifesto.org/", tipo: "link" },
            { nombre: "Comparativa metodologías", url: "#", tipo: "pdf" }
          ]
        },
        {
          numeroClase: 2,
          titulo: "Framework Scrum",
          descripcion: "Roles, eventos y artefactos de Scrum. Implementación práctica.",
          duracionMinutos: 75,
          objetivos: [
            "Dominar roles de Scrum",
            "Facilitar ceremonias de Scrum",
            "Gestionar product backlog",
            "Planificar sprints efectivos"
          ],
          prerequisitos: ["Clase 1: Introducción a Metodologías Ágiles"],
          materialesAdicionales: [
            { nombre: "Scrum Guide", url: "#", tipo: "pdf" },
            { nombre: "Templates de Scrum", url: "#", tipo: "archivo" }
          ]
        },
        {
          numeroClase: 3,
          titulo: "Kanban y Lean",
          descripcion: "Principios de Kanban, visualización del flujo de trabajo y mejora continua.",
          duracionMinutos: 75,
          objetivos: [
            "Implementar tableros Kanban",
            "Medir y optimizar flujo de trabajo",
            "Aplicar principios Lean",
            "Identificar desperdicios en procesos"
          ],
          prerequisitos: ["Clase 2: Framework Scrum"],
          materialesAdicionales: [
            { nombre: "Template tablero Kanban", url: "#", tipo: "archivo" },
            { nombre: "Métricas Kanban", url: "#", tipo: "pdf" }
          ]
        }
      );
      break;

    case "Idiomas":
      clasesBase.push(
        {
          numeroClase: 1,
          titulo: "Business English Fundamentals",
          descripcion: "Vocabulario básico de negocios, presentaciones personales y networking.",
          duracionMinutos: 60,
          objetivos: [
            "Dominar vocabulario de negocios esencial",
            "Realizar presentaciones personales efectivas",
            "Participar en conversaciones de networking",
            "Usar phrasal verbs comunes en negocios"
          ],
          materialesAdicionales: [
            { nombre: "Business Vocabulary List", url: "#", tipo: "pdf" },
            { nombre: "Audio ejercicios pronunciación", url: "#", tipo: "archivo" }
          ]
        },
        {
          numeroClase: 2,
          titulo: "Meetings and Presentations",
          descripcion: "Participación en reuniones, presentaciones formales y manejo de Q&A.",
          duracionMinutos: 60,
          objetivos: [
            "Participar activamente en meetings",
            "Estructurar presentaciones profesionales",
            "Manejar preguntas y respuestas",
            "Usar lenguaje formal apropiado"
          ],
          prerequisitos: ["Clase 1: Business English Fundamentals"],
          materialesAdicionales: [
            { nombre: "Meeting phrases", url: "#", tipo: "pdf" },
            { nombre: "Presentation templates", url: "#", tipo: "archivo" }
          ]
        },
        {
          numeroClase: 3,
          titulo: "Email Communication",
          descripcion: "Redacción de emails profesionales, negociación por escrito y etiqueta digital.",
          duracionMinutos: 60,
          objetivos: [
            "Redactar emails profesionales efectivos",
            "Usar tono apropiado según el contexto",
            "Negociar por escrito",
            "Seguir etiqueta de comunicación digital"
          ],
          prerequisitos: ["Clase 2: Meetings and Presentations"],
          materialesAdicionales: [
            { nombre: "Email templates", url: "#", tipo: "pdf" },
            { nombre: "Business writing guide", url: "#", tipo: "pdf" }
          ]
        }
      );
      break;

    case "Diseño":
      clasesBase.push(
        {
          numeroClase: 1,
          titulo: "Fundamentos de UX Design",
          descripcion: "Principios de experiencia de usuario, research y persona development.",
          duracionMinutos: 90,
          objetivos: [
            "Comprender principios de UX",
            "Realizar research de usuarios",
            "Crear user personas",
            "Desarrollar user journey maps"
          ],
          materialesAdicionales: [
            { nombre: "UX Research toolkit", url: "#", tipo: "pdf" },
            { nombre: "Persona templates", url: "#", tipo: "archivo" }
          ]
        },
        {
          numeroClase: 2,
          titulo: "UI Design y Sistemas de Diseño",
          descripcion: "Principios de interfaz, tipografía, color y creación de design systems.",
          duracionMinutos: 90,
          objetivos: [
            "Aplicar principios de UI design",
            "Crear paletas de colores efectivas",
            "Establecer jerarquías tipográficas",
            "Desarrollar design systems"
          ],
          prerequisitos: ["Clase 1: Fundamentos de UX Design"],
          materialesAdicionales: [
            { nombre: "Color theory guide", url: "#", tipo: "pdf" },
            { nombre: "Typography handbook", url: "#", tipo: "pdf" }
          ]
        },
        {
          numeroClase: 3,
          titulo: "Prototipado con Figma",
          descripcion: "Herramientas de Figma, wireframing, prototipado interactivo y testing.",
          duracionMinutos: 90,
          objetivos: [
            "Dominar herramientas de Figma",
            "Crear wireframes y mockups",
            "Desarrollar prototipos interactivos",
            "Realizar testing con usuarios"
          ],
          prerequisitos: ["Clase 2: UI Design y Sistemas de Diseño"],
          materialesAdicionales: [
            { nombre: "Figma starter kit", url: "#", tipo: "archivo" },
            { nombre: "Usability testing guide", url: "#", tipo: "pdf" }
          ]
        }
      );
      break;

    default:
      // Clases genéricas para categorías no especificadas
      clasesBase.push(
        {
          numeroClase: 1,
          titulo: "Introducción al curso",
          descripcion: "Conceptos fundamentales y objetivos del curso.",
          duracionMinutos: curso.duracionMinutos || 60,
          objetivos: ["Comprender los fundamentos", "Establecer objetivos de aprendizaje"],
          materialesAdicionales: [
            { nombre: "Material introductorio", url: "#", tipo: "pdf" }
          ]
        },
        {
          numeroClase: 2,
          titulo: "Desarrollo práctico",
          descripcion: "Aplicación práctica de los conceptos aprendidos.",
          duracionMinutos: curso.duracionMinutos || 60,
          objetivos: ["Aplicar conceptos en práctica", "Desarrollar habilidades específicas"],
          prerequisitos: ["Clase 1: Introducción al curso"],
          materialesAdicionales: [
            { nombre: "Ejercicios prácticos", url: "#", tipo: "pdf" }
          ]
        }
      );
  }

  return clasesBase.map((clase, index) => ({
    ...clase,
    cursoId: curso._id,
    orden: index + 1,
    activa: true,
    creadoEn: new Date(),
    actualizadoEn: new Date()
  }));
}

// Procesar cada curso existente
let totalClasesCreadas = 0;
const cursosActualizados = [];

for (const curso of cursosExistentes) {
  print(`\n📚 Procesando curso: "${curso.titulo}"`);
  
  // Verificar si ya tiene clases
  const clasesExistentes = db.clases.find({ cursoId: curso._id }).count();
  
  if (clasesExistentes > 0) {
    print(`   ⚠️  Ya tiene ${clasesExistentes} clases, saltando...`);
    continue;
  }
  
  // Generar clases para este curso
  const nuevasClases = generarClasesPorCategoria(curso);
  
  try {
    // Insertar las clases
    if (nuevasClases.length > 0) {
      const resultClases = db.clases.insertMany(nuevasClases);
      print(`   ✅ ${resultClases.insertedIds.length} clases creadas`);
      totalClasesCreadas += resultClases.insertedIds.length;
      
      // Actualizar el curso con el número total de clases
      db.cursos.updateOne(
        { _id: curso._id },
        { 
          $set: { 
            totalClases: nuevasClases.length,
            clases: Object.values(resultClases.insertedIds)
          }
        }
      );
      
      cursosActualizados.push({
        titulo: curso.titulo,
        categoria: curso.categoria,
        clasesCreadas: nuevasClases.length
      });
    }
  } catch (error) {
    print(`   ❌ Error creando clases para "${curso.titulo}": ${error.message}`);
  }
}

// Mostrar resumen final
print(`\n📊 RESUMEN DE LA INYECCIÓN:`);
print(`   Total de clases creadas: ${totalClasesCreadas}`);
print(`   Cursos actualizados: ${cursosActualizados.length}`);
print(`\n📋 Detalle por curso:`);

cursosActualizados.forEach(curso => {
  print(`   • ${curso.titulo} (${curso.categoria}): ${curso.clasesCreadas} clases`);
});

// Estadísticas finales
const estadisticasFinales = db.clases.aggregate([
  {
    $lookup: {
      from: "cursos",
      localField: "cursoId",
      foreignField: "_id",
      as: "curso"
    }
  },
  { $unwind: "$curso" },
  {
    $group: {
      _id: "$curso.categoria",
      totalClases: { $sum: 1 },
      cursos: { $addToSet: "$curso.titulo" }
    }
  },
  { $sort: { totalClases: -1 } }
]).toArray();

print(`\n📈 Estadísticas por categoría:`);
estadisticasFinales.forEach(stat => {
  print(`   ${stat._id}: ${stat.totalClases} clases en ${stat.cursos.length} cursos`);
});

print(`\n🎉 ¡Inyección de clases completada exitosamente!`);
print(`\n💡 Próximos pasos:`);
print(`   1. Actualiza el backend para incluir endpoints de clases`);
print(`   2. Modifica el frontend para mostrar las clases en CursoDetalle`);
print(`   3. Implementa la funcionalidad de materiales descargables`);
