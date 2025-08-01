import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Obtener usuario por email
export const getUsuarioByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("usuarios")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
  },
});

// Crear un nuevo usuario
export const crearUsuario = mutation({
  args: {
    nombre: v.string(),
    email: v.string(),
    preferencias: v.optional(v.object({
      tema: v.optional(v.string()),
      idioma: v.optional(v.string()),
      notificaciones: v.optional(v.boolean()),
    })),
  },
  handler: async (ctx, args) => {
    const ahora = Date.now();
    
    const usuarioId = await ctx.db.insert("usuarios", {
      nombre: args.nombre,
      email: args.email,
      preferencias: args.preferencias,
      horasEstudioTotales: 0,
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    });
    
    return usuarioId;
  },
});

// Actualizar preferencias del usuario
export const actualizarPreferencias = mutation({
  args: {
    usuarioId: v.id("usuarios"),
    preferencias: v.object({
      tema: v.optional(v.string()),
      idioma: v.optional(v.string()),
      notificaciones: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.usuarioId, {
      preferencias: args.preferencias,
      fechaActualizacion: Date.now(),
    });
    
    return args.usuarioId;
  },
});

// Actualizar horas de estudio totales
export const actualizarHorasEstudio = mutation({
  args: {
    usuarioId: v.id("usuarios"),
    horasAdicionales: v.number(),
  },
  handler: async (ctx, args) => {
    const usuario = await ctx.db.get(args.usuarioId);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    
    const nuevasHoras = (usuario.horasEstudioTotales || 0) + args.horasAdicionales;
    
    await ctx.db.patch(args.usuarioId, {
      horasEstudioTotales: nuevasHoras,
      fechaActualizacion: Date.now(),
    });
    
    return nuevasHoras;
  },
});
