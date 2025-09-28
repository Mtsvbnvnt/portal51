// Script para limpiar las clases inyectadas anteriormente
// Ejecutar con: mongosh portal50 limpiar-clases.js

print("🧹 Iniciando limpieza de clases...");

// Contar las clases existentes antes de limpiar
const clasesAntesLimpieza = db.clases.countDocuments();
print(`📊 Clases encontradas antes de la limpieza: ${clasesAntesLimpieza}`);

if (clasesAntesLimpieza === 0) {
  print("✅ No hay clases para limpiar.");
  exit();
}

try {
  // Eliminar todas las clases
  const resultadoClases = db.clases.deleteMany({});
  print(`🗑️  Clases eliminadas: ${resultadoClases.deletedCount}`);

  // Limpiar las referencias de clases en los cursos
  const resultadoCursos = db.cursos.updateMany(
    {},
    { 
      $unset: { 
        clases: "",
        totalClases: "" 
      }
    }
  );
  print(`🔄 Cursos actualizados (referencias limpiadas): ${resultadoCursos.modifiedCount}`);

  // Verificar limpieza
  const clasesAfterLimpieza = db.clases.countDocuments();
  print(`📊 Clases restantes después de la limpieza: ${clasesAfterLimpieza}`);

  print("\n✅ Limpieza completada exitosamente!");
  print("💡 Ahora puedes volver a ejecutar el script de inyección si es necesario.");

} catch (error) {
  print(`❌ Error durante la limpieza: ${error.message}`);
}

// Mostrar estadísticas finales
const cursosRestantes = db.cursos.countDocuments();
const usuariosRestantes = db.usuarios.countDocuments();

print(`\n📈 Estado final de la base de datos:`);
print(`   Usuarios: ${usuariosRestantes}`);
print(`   Cursos: ${cursosRestantes}`);
print(`   Clases: ${db.clases.countDocuments()}`);
