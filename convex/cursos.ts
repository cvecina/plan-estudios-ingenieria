import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Crear un nuevo curso
export const createCurso = mutation({
  args: {
    nombre: v.string(),
    descripcion: v.optional(v.string()),
    fechaInicio: v.string(),
    fechaFin: v.string(),
    color: v.string(),
    estado: v.string(), // "activo", "completado", "pausado"
    usuarioId: v.id("usuarios"),
  },
  handler: async (ctx, args) => {
    const cursoId = await ctx.db.insert("cursos", {
      nombre: args.nombre,
      descripcion: args.descripcion || "",
      fechaInicio: args.fechaInicio,
      fechaFin: args.fechaFin,
      color: args.color,
      estado: args.estado,
      usuarioId: args.usuarioId,
      fechaCreacion: new Date().toISOString(),
    });
    return cursoId;
  },
});

// Obtener todos los cursos de un usuario
export const getCursos = query({
  args: { usuarioId: v.id("usuarios") },
  handler: async (ctx, args) => {
    const cursos = await ctx.db
      .query("cursos")
      .filter((q) => q.eq(q.field("usuarioId"), args.usuarioId))
      .order("desc")
      .collect();

    // Obtener el número de asignaturas por curso
    const cursosConAsignaturas = await Promise.all(
      cursos.map(async (curso) => {
        const asignaturas = await ctx.db
          .query("asignaturas")
          .filter((q) => q.eq(q.field("cursoId"), curso._id))
          .collect();

        // Calcular progreso promedio del curso
        const progresoTotal = asignaturas.reduce((suma, asignatura) => suma + (asignatura.progreso || 0), 0);
        const progresoPromedio = asignaturas.length > 0 ? Math.round(progresoTotal / asignaturas.length) : 0;

        return {
          ...curso,
          numeroAsignaturas: asignaturas.length,
          progreso: progresoPromedio,
        };
      })
    );

    return cursosConAsignaturas;
  },
});

// Obtener un curso por ID
export const getCursoById = query({
  args: { 
    id: v.id("cursos"),
    usuarioId: v.id("usuarios") 
  },
  handler: async (ctx, args) => {
    const curso = await ctx.db.get(args.id);
    
    if (!curso || curso.usuarioId !== args.usuarioId) {
      return null;
    }

    // Obtener asignaturas del curso
    const asignaturas = await ctx.db
      .query("asignaturas")
      .filter((q) => q.eq(q.field("cursoId"), args.id))
      .collect();

    // Calcular estadísticas
    const progresoTotal = asignaturas.reduce((suma, asignatura) => suma + (asignatura.progreso || 0), 0);
    const progresoPromedio = asignaturas.length > 0 ? Math.round(progresoTotal / asignaturas.length) : 0;

    return {
      ...curso,
      asignaturas,
      numeroAsignaturas: asignaturas.length,
      progreso: progresoPromedio,
    };
  },
});

// Actualizar un curso
export const updateCurso = mutation({
  args: {
    id: v.id("cursos"),
    nombre: v.optional(v.string()),
    descripcion: v.optional(v.string()),
    fechaInicio: v.optional(v.string()),
    fechaFin: v.optional(v.string()),
    color: v.optional(v.string()),
    estado: v.optional(v.string()),
    usuarioId: v.id("usuarios"),
  },
  handler: async (ctx, args) => {
    const { id, usuarioId, ...updates } = args;
    
    const curso = await ctx.db.get(id);
    if (!curso || curso.usuarioId !== usuarioId) {
      throw new Error("Curso no encontrado o sin permisos");
    }

    await ctx.db.patch(id, updates);
    return id;
  },
});

// Eliminar un curso
export const deleteCurso = mutation({
  args: { 
    id: v.id("cursos"),
    usuarioId: v.id("usuarios") 
  },
  handler: async (ctx, args) => {
    const curso = await ctx.db.get(args.id);
    if (!curso || curso.usuarioId !== args.usuarioId) {
      throw new Error("Curso no encontrado o sin permisos");
    }

    // Opcional: También eliminar todas las asignaturas del curso
    const asignaturas = await ctx.db
      .query("asignaturas")
      .filter((q) => q.eq(q.field("cursoId"), args.id))
      .collect();

    for (const asignatura of asignaturas) {
      await ctx.db.delete(asignatura._id);
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});
