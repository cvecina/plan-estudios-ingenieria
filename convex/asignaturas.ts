import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

// Obtener todas las asignaturas de un usuario
export const getAsignaturasByUsuario = query({
  args: { usuarioId: v.id("usuarios") },
  handler: async (ctx, args) => {
    const asignaturas = await ctx.db
      .query("asignaturas")
      .filter((q) => q.eq(q.field("usuarioId"), args.usuarioId))
      .collect();
    
    return asignaturas;
  },
});

// Obtener una asignatura específica
export const getAsignatura = query({
  args: { 
    asignaturaId: v.id("asignaturas"),
    usuarioId: v.id("usuarios") 
  },
  handler: async (ctx, args) => {
    const asignatura = await ctx.db.get(args.asignaturaId);
    
    if (!asignatura || asignatura.usuarioId !== args.usuarioId) {
      return null;
    }
    
    return asignatura;
  },
});

// Alias para getAsignatura
export const getAsignaturaById = query({
  args: { 
    asignaturaId: v.id("asignaturas"),
    usuarioId: v.id("usuarios") 
  },
  handler: async (ctx, args) => {
    const asignatura = await ctx.db.get(args.asignaturaId);
    
    if (!asignatura || asignatura.usuarioId !== args.usuarioId) {
      return null;
    }
    
    return asignatura;
  },
});

// Crear una nueva asignatura
export const crearAsignatura = mutation({
  args: {
    usuarioId: v.id("usuarios"),
    cursoId: v.optional(v.id("cursos")),
    nombre: v.string(),
    codigo: v.string(),
    profesor: v.string(),
    creditos: v.number(),
    color: v.string(),
    descripcion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const ahora = Date.now();
    
    const asignaturaId = await ctx.db.insert("asignaturas", {
      usuarioId: args.usuarioId,
      cursoId: args.cursoId,
      nombre: args.nombre,
      codigo: args.codigo,
      profesor: args.profesor,
      creditos: args.creditos,
      color: args.color,
      descripcion: args.descripcion,
      progreso: 0,
      horasEstudio: 0,
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    });
    
    return asignaturaId;
  },
});

// Alias para compatibilidad
export const createAsignatura = crearAsignatura;

// Actualizar una asignatura
export const actualizarAsignatura = mutation({
  args: {
    asignaturaId: v.id("asignaturas"),
    usuarioId: v.id("usuarios"),
    nombre: v.optional(v.string()),
    codigo: v.optional(v.string()),
    profesor: v.optional(v.string()),
    creditos: v.optional(v.number()),
    color: v.optional(v.string()),
    descripcion: v.optional(v.string()),
    progreso: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const asignatura = await ctx.db.get(args.asignaturaId);
    
    if (!asignatura || asignatura.usuarioId !== args.usuarioId) {
      throw new Error("Asignatura no encontrada o sin permisos");
    }
    
    const actualizaciones: any = {
      fechaActualizacion: Date.now(),
    };
    
    if (args.nombre !== undefined) actualizaciones.nombre = args.nombre;
    if (args.codigo !== undefined) actualizaciones.codigo = args.codigo;
    if (args.profesor !== undefined) actualizaciones.profesor = args.profesor;
    if (args.creditos !== undefined) actualizaciones.creditos = args.creditos;
    if (args.color !== undefined) actualizaciones.color = args.color;
    if (args.descripcion !== undefined) actualizaciones.descripcion = args.descripcion;
    if (args.progreso !== undefined) actualizaciones.progreso = args.progreso;
    
    await ctx.db.patch(args.asignaturaId, actualizaciones);
    
    return args.asignaturaId;
  },
});

// Eliminar una asignatura
export const eliminarAsignatura = mutation({
  args: {
    asignaturaId: v.id("asignaturas"),
    usuarioId: v.id("usuarios"),
  },
  handler: async (ctx, args) => {
    const asignatura = await ctx.db.get(args.asignaturaId);
    
    if (!asignatura || asignatura.usuarioId !== args.usuarioId) {
      throw new Error("Asignatura no encontrada o sin permisos");
    }
    
    // Eliminar la asignatura
    await ctx.db.delete(args.asignaturaId);
    
    return args.asignaturaId;
  },
});

// Calcular y actualizar automáticamente el progreso de una asignatura
export const calcularProgresoAsignatura = mutation({
  args: {
    asignaturaId: v.id("asignaturas"),
    usuarioId: v.id("usuarios"),
  },
  handler: async (ctx, args) => {
    const asignatura = await ctx.db.get(args.asignaturaId);
    
    if (!asignatura || asignatura.usuarioId !== args.usuarioId) {
      throw new Error("Asignatura no encontrada o sin permisos");
    }
    
    // Obtener todas las entregas de esta asignatura
    const entregas = await ctx.db
      .query("entregas")
      .filter((q) => 
        q.and(
          q.eq(q.field("asignaturaId"), args.asignaturaId),
          q.eq(q.field("usuarioId"), args.usuarioId)
        )
      )
      .collect();
    
    let progreso = 0;
    
    if (entregas.length > 0) {
      // Contar entregas completadas
      const entregasCompletadas = entregas.filter(entrega => entrega.estado === "completada");
      
      // Calcular progreso como porcentaje de entregas completadas
      progreso = Math.round((entregasCompletadas.length / entregas.length) * 100);
      
      // Si hay puntuaciones, usar promedio ponderado
      const entregasConPuntuacion = entregasCompletadas.filter(entrega => 
        entrega.puntuacion !== undefined && entrega.puntuacion !== null
      );
      
      if (entregasConPuntuacion.length > 0) {
        const promedioPuntuaciones = entregasConPuntuacion.reduce((sum, entrega) => 
          sum + entrega.puntuacion!, 0
        ) / entregasConPuntuacion.length;
        
        // Combinar progreso de completitud con promedio de puntuaciones
        // 70% peso a completitud, 30% peso a puntuaciones
        const progresoCompletitud = (entregasCompletadas.length / entregas.length) * 100;
        progreso = Math.round((progresoCompletitud * 0.7) + (promedioPuntuaciones * 0.3));
      }
    }
    
    // Asegurar que el progreso esté entre 0 y 100
    progreso = Math.max(0, Math.min(100, progreso));
    
    // Actualizar el progreso en la asignatura
    await ctx.db.patch(args.asignaturaId, {
      progreso: progreso,
      fechaActualizacion: Date.now(),
    });
    
    return {
      asignaturaId: args.asignaturaId,
      progresoAnterior: asignatura.progreso,
      progresoNuevo: progreso,
      totalEntregas: entregas.length,
      entregasCompletadas: entregas.filter(e => e.estado === "completada").length,
    };
  },
});

// Calcular progreso para todas las asignaturas de un usuario
export const calcularProgresoTodasAsignaturas = mutation({
  args: {
    usuarioId: v.id("usuarios"),
  },
  handler: async (ctx, args) => {
    // Obtener todas las asignaturas del usuario
    const asignaturas = await ctx.db
      .query("asignaturas")
      .filter((q) => q.eq(q.field("usuarioId"), args.usuarioId))
      .collect();
    
    const resultados = [];
    
    // Calcular progreso para cada asignatura
    for (const asignatura of asignaturas) {
      // Obtener entregas de esta asignatura
      const entregas = await ctx.db
        .query("entregas")
        .filter((q) => 
          q.and(
            q.eq(q.field("asignaturaId"), asignatura._id),
            q.eq(q.field("usuarioId"), args.usuarioId)
          )
        )
        .collect();
      
      let progreso = 0;
      
      if (entregas.length > 0) {
        const entregasCompletadas = entregas.filter(entrega => entrega.estado === "completada");
        progreso = Math.round((entregasCompletadas.length / entregas.length) * 100);
        
        // Si hay puntuaciones, usar promedio ponderado
        const entregasConPuntuacion = entregasCompletadas.filter(entrega => 
          entrega.puntuacion !== undefined && entrega.puntuacion !== null
        );
        
        if (entregasConPuntuacion.length > 0) {
          const promedioPuntuaciones = entregasConPuntuacion.reduce((sum, entrega) => 
            sum + entrega.puntuacion!, 0
          ) / entregasConPuntuacion.length;
          
          const progresoCompletitud = (entregasCompletadas.length / entregas.length) * 100;
          progreso = Math.round((progresoCompletitud * 0.7) + (promedioPuntuaciones * 0.3));
        }
      }
      
      progreso = Math.max(0, Math.min(100, progreso));
      
      // Actualizar progreso
      await ctx.db.patch(asignatura._id, {
        progreso: progreso,
        fechaActualizacion: Date.now(),
      });
      
      resultados.push({
        asignaturaId: asignatura._id,
        nombre: asignatura.nombre,
        progresoAnterior: asignatura.progreso,
        progresoNuevo: progreso,
        totalEntregas: entregas.length,
        entregasCompletadas: entregas.filter(e => e.estado === "completada").length,
      });
    }
    
    return {
      usuarioId: args.usuarioId,
      asignaturasActualizadas: resultados.length,
      resultados: resultados,
    };
  },
});

// Actualizar horas de estudio de una asignatura
export const actualizarHorasEstudio = mutation({
  args: {
    asignaturaId: v.id("asignaturas"),
    usuarioId: v.id("usuarios"),
    horasAdicionales: v.number(),
  },
  handler: async (ctx, args) => {
    const asignatura = await ctx.db.get(args.asignaturaId);
    
    if (!asignatura || asignatura.usuarioId !== args.usuarioId) {
      throw new Error("Asignatura no encontrada o sin permisos");
    }
    
    const nuevasHoras = (asignatura.horasEstudio || 0) + args.horasAdicionales;
    
    await ctx.db.patch(args.asignaturaId, {
      horasEstudio: nuevasHoras,
      fechaActualizacion: Date.now(),
    });
    
    return nuevasHoras;
  },
});
