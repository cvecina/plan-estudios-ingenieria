import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

// Obtener todas las entregas de un usuario
export const getEntregasByUsuario = query({
  args: { usuarioId: v.id("usuarios") },
  handler: async (ctx, args) => {
    const entregas = await ctx.db
      .query("entregas")
      .filter((q) => q.eq(q.field("usuarioId"), args.usuarioId))
      .collect();
    
    return entregas;
  },
});

// Obtener entregas de una asignatura
export const getEntregasByAsignatura = query({
  args: { 
    asignaturaId: v.id("asignaturas"),
    usuarioId: v.id("usuarios") 
  },
  handler: async (ctx, args) => {
    // Verificar que la asignatura pertenece al usuario
    const asignatura = await ctx.db.get(args.asignaturaId);
    if (!asignatura || asignatura.usuarioId !== args.usuarioId) {
      return [];
    }
    
    const entregas = await ctx.db
      .query("entregas")
      .filter((q) => q.eq(q.field("asignaturaId"), args.asignaturaId))
      .collect();
    
    return entregas;
  },
});

// Crear una nueva entrega
export const crearEntrega = mutation({
  args: {
    usuarioId: v.id("usuarios"),
    asignaturaId: v.id("asignaturas"),
    titulo: v.string(),
    descripcion: v.optional(v.string()),
    tipo: v.string(),
    fechaEntrega: v.number(),
    prioridad: v.string(),
  },
  handler: async (ctx, args) => {
    // Verificar que la asignatura pertenece al usuario
    const asignatura = await ctx.db.get(args.asignaturaId);
    if (!asignatura || asignatura.usuarioId !== args.usuarioId) {
      throw new Error("Asignatura no encontrada o sin permisos");
    }
    
    const ahora = Date.now();
    
    const entregaId = await ctx.db.insert("entregas", {
      usuarioId: args.usuarioId,
      asignaturaId: args.asignaturaId,
      titulo: args.titulo,
      descripcion: args.descripcion,
      tipo: args.tipo,
      fechaEntrega: args.fechaEntrega,
      prioridad: args.prioridad,
      estado: "pendiente",
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    });
    
    return entregaId;
  },
});

// Actualizar una entrega
export const actualizarEntrega = mutation({
  args: {
    entregaId: v.id("entregas"),
    usuarioId: v.id("usuarios"),
    titulo: v.optional(v.string()),
    descripcion: v.optional(v.string()),
    tipo: v.optional(v.string()),
    fechaEntrega: v.optional(v.number()),
    prioridad: v.optional(v.string()),
    estado: v.optional(v.string()),
    puntuacion: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const entrega = await ctx.db.get(args.entregaId);
    
    if (!entrega || entrega.usuarioId !== args.usuarioId) {
      throw new Error("Entrega no encontrada o sin permisos");
    }
    
    const actualizaciones: any = {
      fechaActualizacion: Date.now(),
    };
    
    if (args.titulo !== undefined) actualizaciones.titulo = args.titulo;
    if (args.descripcion !== undefined) actualizaciones.descripcion = args.descripcion;
    if (args.tipo !== undefined) actualizaciones.tipo = args.tipo;
    if (args.fechaEntrega !== undefined) actualizaciones.fechaEntrega = args.fechaEntrega;
    if (args.prioridad !== undefined) actualizaciones.prioridad = args.prioridad;
    if (args.estado !== undefined) actualizaciones.estado = args.estado;
    if (args.puntuacion !== undefined) actualizaciones.puntuacion = args.puntuacion;
    
    await ctx.db.patch(args.entregaId, actualizaciones);
    
    // Recalcular progreso de la asignatura automáticamente
    if (args.estado === "completada" || entrega.estado === "completada") {
      await recalcularProgresoAsignatura(ctx, entrega.asignaturaId, args.usuarioId);
    }
    
    return args.entregaId;
  },
});

// Eliminar una entrega
export const eliminarEntrega = mutation({
  args: {
    entregaId: v.id("entregas"),
    usuarioId: v.id("usuarios"),
  },
  handler: async (ctx, args) => {
    const entrega = await ctx.db.get(args.entregaId);
    
    if (!entrega || entrega.usuarioId !== args.usuarioId) {
      throw new Error("Entrega no encontrada o sin permisos");
    }
    
    await ctx.db.delete(args.entregaId);
    
    return args.entregaId;
  },
});

// Marcar entrega como completada
export const completarEntrega = mutation({
  args: {
    entregaId: v.id("entregas"),
    usuarioId: v.id("usuarios"),
    puntuacion: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const entrega = await ctx.db.get(args.entregaId);
    
    if (!entrega || entrega.usuarioId !== args.usuarioId) {
      throw new Error("Entrega no encontrada o sin permisos");
    }
    
    const actualizaciones: any = {
      estado: "completada",
      fechaActualizacion: Date.now(),
    };
    
    if (args.puntuacion !== undefined) {
      actualizaciones.puntuacion = args.puntuacion;
    }
    
    await ctx.db.patch(args.entregaId, actualizaciones);
    
    // Recalcular progreso de la asignatura automáticamente
    await recalcularProgresoAsignatura(ctx, entrega.asignaturaId, args.usuarioId);
    
    return args.entregaId;
  },
});

// Función auxiliar para recalcular el progreso de una asignatura
async function recalcularProgresoAsignatura(ctx: any, asignaturaId: any, usuarioId: any) {
  const asignatura = await ctx.db.get(asignaturaId);
  
  if (!asignatura || asignatura.usuarioId !== usuarioId) {
    return;
  }
  
  // Obtener todas las entregas de esta asignatura
  const entregas = await ctx.db
    .query("entregas")
    .filter((q: any) => 
      q.and(
        q.eq(q.field("asignaturaId"), asignaturaId),
        q.eq(q.field("usuarioId"), usuarioId)
      )
    )
    .collect();
  
  let progreso = 0;
  
  if (entregas.length > 0) {
    // Contar entregas completadas
    const entregasCompletadas = entregas.filter((entrega: any) => entrega.estado === "completada");
    
    // Calcular progreso como porcentaje de entregas completadas
    progreso = Math.round((entregasCompletadas.length / entregas.length) * 100);
    
    // Si hay puntuaciones, usar promedio ponderado
    const entregasConPuntuacion = entregasCompletadas.filter((entrega: any) => 
      entrega.puntuacion !== undefined && entrega.puntuacion !== null
    );
    
    if (entregasConPuntuacion.length > 0) {
      const promedioPuntuaciones = entregasConPuntuacion.reduce((sum: any, entrega: any) => 
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
  await ctx.db.patch(asignaturaId, {
    progreso: progreso,
    fechaActualizacion: Date.now(),
  });
  
  return progreso;
}
