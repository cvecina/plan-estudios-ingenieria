import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Obtener una nota por ID
export const getNoteById = query({
  args: { 
    noteId: v.id("notas"),
    usuarioId: v.id("usuarios") 
  },
  handler: async (ctx, args) => {
    const nota = await ctx.db.get(args.noteId);
    
    if (!nota || nota.usuarioId !== args.usuarioId) {
      return null;
    }
    
    return nota;
  },
});

// Obtener todas las notas de una asignatura
export const getNotasByAsignatura = query({
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
    
    const notas = await ctx.db
      .query("notas")
      .filter((q) => q.eq(q.field("asignaturaId"), args.asignaturaId))
      .collect();
    
    return notas;
  },
});

// Crear una nueva nota
export const crearNota = mutation({
  args: {
    usuarioId: v.id("usuarios"),
    asignaturaId: v.id("asignaturas"),
    titulo: v.string(),
    contenido: v.string(),
    etiquetas: v.optional(v.array(v.string())),
    esPublica: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Verificar que la asignatura pertenece al usuario
    const asignatura = await ctx.db.get(args.asignaturaId);
    if (!asignatura || asignatura.usuarioId !== args.usuarioId) {
      throw new Error("Asignatura no encontrada o sin permisos");
    }
    
    const ahora = Date.now();
    
    const notaId = await ctx.db.insert("notas", {
      usuarioId: args.usuarioId,
      asignaturaId: args.asignaturaId,
      titulo: args.titulo,
      contenido: args.contenido,
      etiquetas: args.etiquetas,
      esPublica: args.esPublica ?? false,
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    });
    
    return notaId;
  },
});

// Actualizar una nota
export const actualizarNota = mutation({
  args: {
    notaId: v.id("notas"),
    usuarioId: v.id("usuarios"),
    titulo: v.optional(v.string()),
    contenido: v.optional(v.string()),
    etiquetas: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const nota = await ctx.db.get(args.notaId);
    
    if (!nota || nota.usuarioId !== args.usuarioId) {
      throw new Error("Nota no encontrada o sin permisos");
    }
    
    const actualizaciones: any = {
      fechaActualizacion: Date.now(),
    };
    
    if (args.titulo !== undefined) actualizaciones.titulo = args.titulo;
    if (args.contenido !== undefined) actualizaciones.contenido = args.contenido;
    if (args.etiquetas !== undefined) actualizaciones.etiquetas = args.etiquetas;
    
    await ctx.db.patch(args.notaId, actualizaciones);
    
    return args.notaId;
  },
});

// Eliminar una nota
export const eliminarNota = mutation({
  args: {
    notaId: v.id("notas"),
    usuarioId: v.id("usuarios"),
  },
  handler: async (ctx, args) => {
    const nota = await ctx.db.get(args.notaId);
    
    if (!nota || nota.usuarioId !== args.usuarioId) {
      throw new Error("Nota no encontrada o sin permisos");
    }
    
    await ctx.db.delete(args.notaId);
    
    return args.notaId;
  },
});
