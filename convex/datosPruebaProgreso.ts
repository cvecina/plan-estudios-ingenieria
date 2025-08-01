import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Función para crear datos de prueba más completos para el cálculo automático
export const crearDatosPruebaProgreso = mutation({
  args: {},
  handler: async (ctx, args) => {
    console.log("🚀 Creando datos de prueba para progreso automático...");
    
    const usuarioId = "kd7chrfefvj8sb4wsxf4jtqqms7mvkx0" as any; // Usuario ejemplo
    
    // Obtener asignaturas existentes
    const asignaturas = await ctx.db
      .query("asignaturas")
      .filter((q: any) => q.eq(q.field("usuarioId"), usuarioId))
      .collect();
    
    console.log(`📚 Encontradas ${asignaturas.length} asignaturas`);
    
    if (asignaturas.length === 0) {
      throw new Error("No hay asignaturas. Ejecuta primero datosEjemplo:llenarDatosEjemplo");
    }
    
    const ahora = Date.now();
    const unaSemana = 7 * 24 * 60 * 60 * 1000;
    const unMes = 30 * 24 * 60 * 60 * 1000;
    
    // Para cada asignatura, crear varias entregas
    for (const asignatura of asignaturas) {
      console.log(`📝 Creando entregas para ${asignatura.nombre}...`);
      
      // Crear 5 entregas para cada asignatura
      const entregas = [
        {
          titulo: "Práctica 1: Fundamentos",
          descripcion: "Ejercicios básicos de la materia",
          tipo: "practica",
          fechaEntrega: ahora - (2 * unaSemana), // Hace 2 semanas
          prioridad: "media",
          estado: "completada",
          puntuacion: 85
        },
        {
          titulo: "Tarea 1: Investigación",
          descripcion: "Ensayo sobre conceptos clave",
          tipo: "tarea",
          fechaEntrega: ahora - unaSemana, // Hace 1 semana
          prioridad: "baja",
          estado: "completada",
          puntuacion: 92
        },
        {
          titulo: "Examen Parcial",
          descripcion: "Evaluación de la primera mitad del curso",
          tipo: "examen",
          fechaEntrega: ahora - (3 * 24 * 60 * 60 * 1000), // Hace 3 días
          prioridad: "alta",
          estado: "completada",
          puntuacion: 78
        },
        {
          titulo: "Proyecto Final",
          descripcion: "Desarrollo de proyecto integral",
          tipo: "proyecto",
          fechaEntrega: ahora + unaSemana, // En 1 semana
          prioridad: "alta",
          estado: "en_progreso",
          puntuacion: null
        },
        {
          titulo: "Práctica 2: Avanzada",
          descripcion: "Ejercicios avanzados",
          tipo: "practica",
          fechaEntrega: ahora + (2 * unaSemana), // En 2 semanas
          prioridad: "media",
          estado: "pendiente",
          puntuacion: null
        }
      ];
      
      // Insertar entregas
      for (const entrega of entregas) {
        await ctx.db.insert("entregas", {
          usuarioId: usuarioId as any,
          asignaturaId: asignatura._id,
          titulo: entrega.titulo,
          descripcion: entrega.descripcion,
          tipo: entrega.tipo,
          fechaEntrega: entrega.fechaEntrega,
          prioridad: entrega.prioridad,
          estado: entrega.estado,
          puntuacion: entrega.puntuacion || undefined,
          fechaCreacion: ahora,
          fechaActualizacion: ahora,
        });
        
        console.log(`  ✅ Creada: ${entrega.titulo} (${entrega.estado})`);
      }
    }
    
    console.log("🎉 Datos de prueba creados exitosamente!");
    
    return {
      mensaje: "Datos de prueba creados exitosamente",
      asignaturasConEntregas: asignaturas.length,
      entregasPorAsignatura: 5,
      totalEntregas: asignaturas.length * 5
    };
  },
});
